_ = Tower._
_path       = require('path')
fs          = require('fs')

fs.mkdirpSync = (dir) ->
  dir = _path.resolve(_path.normalize(dir))
  try
    fs.mkdirSync(dir, parseInt('0755'))
  catch e
    switch e.errno
      when 47
        break
      when 34
        fs.mkdirpSync _path.dirname(dir)
        return fs.mkdirpSync(dir)
      else
        console.error(e)

Tower.GeneratorActions =
  get: (url, to, retries=0) ->
    path  = @destinationPath(to)

    superagent = Tower.module('superagent')

    error = =>
      if retries > 3
        console.log "Error downloading #{url}"
      else
        retries++
        @get(url, to, retries)
    
    request = superagent.get(url).buffer(true)
    # Cache buster so if the author uploads newer version to same path
    # we get the new version rather than our locally cached version.

    # @todo put this somewhere else
    superagent.parse['application/javascript'] = superagent.parse['text']
    superagent.parse['binary'] = (res, fn) ->
      res.setEncoding('binary')
      res.text = '';
      res.on 'data', (chunk) -> res.text += chunk
      res.on 'end', fn

    superagent.parse['image/png'] = superagent.parse['binary']
    superagent.parse['application/x-shockwave-flash'] = superagent.parse['binary']

    if url.match('cloud.github.com')
      request.set('Pragma', 'no-cache')
      request.set('Cache-Control', 'no-cache')
      # S3 doesn't seem to read the `no-cache` headers above, but adding this works:
      request.set('Accept-Encoding', 'gzip,deflate,sdch')

    request.end (response) =>
      if response.ok
        @log 'create', path
        # @todo better approach
        if response.type == 'image/png'
          Tower.writeFileSync(path, response.text, 'binary')
        else
          Tower.writeFileSync(path, response.text)
      else
        error()

  log: (action, path) ->
    return if @silent
    return if action == 'create' && Tower.existsSync(path)

    key = switch action
      when 'destroy'
        `'   \x1b[36mremove\x1b[0m'`
      else
        `'   \x1b[36m'` + action + `'\x1b[0m'`

    console.log("#{key} : #{_path.relative(process.cwd(), path)}")

  injectIntoFile: (path, options, callback) ->
    string = ''

    if typeof options == 'string'
      string    = options
      options   = callback
      callback  = undefined
    if typeof options == 'function'
      callback  = options
      options   = {}

    options ||= {}

    path    = @destinationPath(path)
    data    = Tower.readFileSync(path, 'utf-8')

    if typeof callback == 'function'
      data = callback.call @, data
    else if options.before
      unless options.duplicate == false && data.match(_.regexpEscape(string))
        data = data.replace options.before, (_) -> "#{string}#{_}"
    else if options.after
      unless options.duplicate == false && data.match(_.regexpEscape(string))
        data = data.replace options.after, (_) -> "#{_}#{string}"
    else # after
      data = data + string

    @log 'update', path

    Tower.writeFileSync path, data

  readFile: (file, callback) ->
    Tower.readFile(file, 'utf-8', callback)

  createFile: (path, data, callback) ->
    path = @destinationPath(path)
    @log 'create', path
    fs.mkdirpSync _path.dirname(path)
    Tower.writeFileSync(path, data)
    callback() if typeof callback == 'function'

  destinationPath: (path) ->
    return path if path.match(/^\//)
    _path.normalize _path.join(@destinationRoot, @currentDestinationDirectory, path)

  createDirectory: (name, callback) ->
    path = @destinationPath(name)
    @log 'create', path
    result = fs.mkdirpSync(path)
    callback.call @, result if callback
    result

  emptyDirectory: (path) ->
    #Tower.module('wrench').rmdirSyncRecursive(@destinationPath(path))

  inside: (directory, sourceDirectory, block) ->
    if typeof sourceDirectory == 'function'
      block           = sourceDirectory
      sourceDirectory = directory

    currentSourceDirectory        = @currentSourceDirectory
    @currentSourceDirectory       = Tower.join(@currentSourceDirectory, sourceDirectory)
    currentDestinationDirectory   = @currentDestinationDirectory
    @currentDestinationDirectory  = Tower.join(@currentDestinationDirectory, directory)
    block.call @
    @currentSourceDirectory       = currentSourceDirectory
    @currentDestinationDirectory  = currentDestinationDirectory

  copyFile: (source) ->
    {args, options, block} = @_args(arguments, 1)
    destination = args[0] || source
    # @todo
    source = _path.resolve(@findInSourcePaths(source))

    data = fs.readFileSync(source, 'utf-8')

    @createFile destination, data, block

  linkFile: (source) ->
    {args, options, block} = @_args(arguments, 1)
    destination = args.first || source
    # @todo
    source = _path.resolve(@findInSourcePaths(source))

    @createLink destination, source, options

  template: (source) ->
    {args, options, block} = @_args(arguments, 1)
    destination = args[0] || source.replace(/\.tt$/, '')
    # @todo
    source  = _path.resolve(@findInSourcePaths(source))

    data    = @render(fs.readFileSync(source, 'utf-8'), @locals())

    @createFile destination, data, options

  render: (string, options = {}) ->
    require('ejs').render(string, options)

  # @todo
  chmod: (path, mode, options = {}) ->
    return unless behavior == 'invoke'
    path = _path.resolve(path, destination_root)
    @sayStatus 'chmod', @relativeToOriginalDestinationRoot(path), options.fetch('verbose', true)
    File.chmod(mode, path) unless options.pretend

  prependToFile: (path) ->
    {args, options, block} = @_args(arguments, 1)

    options.merge(after: /\A/)
    args.push options
    args.push block
    @insertIntoFile(path, args...)

  prependFile: ->
    @prependToFile arguments...

  appendToFile: (path) ->
    {args, options, block} = @_args(arguments, 1)
    options.merge(before: /\z/)
    args.push options
    args.push block
    @insertIntoFile(path, args...)

  appendFile: ->
    @appendToFile arguments...

  injectIntoClass: (path, klass) ->
    {args, options, block} = @_args(arguments, 2)
    options.merge(after: /class #{klass}\n|class #{klass} .*\n/)
    args.push options
    args.push block
    @insertIntoFile(path, args...)


  gsubFile: (path, targets, replacement, callback) ->
    path = @destinationPath(path)

    @readFile path, (readErr, data) =>
      content = data.toString()
      if typeof targets == 'string' or targets instanceof RegExp
        content = content.replace(targets, replacement)
      else if targets instanceof Array
        for target in targets
          content = content.replace(target, replacement)

      Tower.writeFile path, content, (writeErr) =>
        @log('update', path)
        callback() if typeof callback == 'function'


  # todo: maybe remove file recursively
  removeFile: (path) ->
    path = @destinationPath(path)

    try
      fs.unlinkSync path
      @log('destroy', path)
    catch error
      return

  removeDirSync: (path) ->
    path = @destinationPath(path)
    wrench = require 'wrench'
    try
      wrench.rmdirSyncRecursive(path)
      @log('destroy', path)
    catch error
      return

  _invokeWithConflictCheck: (block) ->
    if fs.existsSync(path)
      @_onConflictBehavior(block)
    else
      @sayStatus "create", "green"
      block.call unless @pretend()

    destination

  _onConflictBehavior: (block) ->
    @sayStatus "exist", "blue", block

  _args: (args, index = 0) ->
    args = Array.prototype.slice.call(args, index, args.length)

    if typeof args[args.length - 1] == "function"
      block = args.pop()
    else
      block = null

    if _.isHash(args[args.length - 1])
      options = args.pop()
    else
      options = {}

    args: args, options: options, block: block

  findInSourcePaths: (path) ->
    _path.resolve(_path.join(@sourceRoot, "templates", @currentSourceDirectory, path))

Tower.GeneratorActions.file = Tower.GeneratorActions.createFile
Tower.GeneratorActions.directory = Tower.GeneratorActions.createDirectory

module.exports = Tower.GeneratorActions
