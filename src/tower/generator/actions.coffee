File  = require('pathfinder').File
_path = require('path')
fs    = require('fs')
_url  = require('url')
rest  = require('restler')

File.mkdirpSync = (dir) ->
  dir = _path.resolve(_path.normalize(dir))
  try
    fs.mkdirSync(dir, 0755)
  catch e
    switch e.errno
      when 47
        break
      when 34
        @mkdirpSync _path.dirname(dir)
        return @mkdirpSync(dir)
      else
        console.error(e)

Tower.Generator.Actions =
  get: (url, to) ->
    path  = @destinationPath(to)
    
    rest.get(url).on 'complete', (data) =>
      @log "create", path
      File.write path, data
    
  log: (action, path) ->    
    return if action == "create" && File.exists(path)
    
    key = switch action
      when "create"
        '   \x1b[36mcreate\x1b[0m'
      when "destroy"
        '   \x1b[36mremove\x1b[0m'
    
    console.log("#{key} : #{File.relativePath(path)}")
    
  injectIntoFile: (file, options, callback) ->
    
  readFile: (file) ->
  
  createFile: (path, data) ->
    path = @destinationPath(path)
    @log "create", path
    File.write path, data
  
  destinationPath: (path) ->
    File.join(@destinationRoot, @currentDestinationDirectory, path)
  
  file: (file, data) ->
    @createFile(file, data)
  
  createDirectory: (name) ->
    path = @destinationPath(name)
    @log "create", path
    File.mkdirpSync(path)
  
  directory: (name) ->
    @createDirectory(name)
  
  emptyDirectory: (name) ->
    
  inside: (directory, sourceDirectory, block) ->
    if typeof sourceDirectory == "function"
      block           = sourceDirectory
      sourceDirectory = directory
    
    currentSourceDirectory        = @currentSourceDirectory
    @currentSourceDirectory       = File.join(@currentSourceDirectory, sourceDirectory)
    currentDestinationDirectory   = @currentDestinationDirectory
    @currentDestinationDirectory  = File.join(@currentDestinationDirectory, directory)
    block.call @
    @currentSourceDirectory       = currentSourceDirectory
    @currentDestinationDirectory  = currentDestinationDirectory
    
  copyFile: (source) ->
    {args, options, block} = @_args(arguments, 1)
    destination = args[0] || source
    source = File.expandFile(@findInSourcePaths(source))
    
    data = File.read(source)
    
    @createFile destination, data, options
  
  linkFile: (source) ->
    {args, options, block} = @_args(arguments, 1)
    destination = args.first || source
    source = File.expandFile(@findInSourcePaths(source))

    @createLink destination, source, options
  
  template: (source) ->
    {args, options, block} = @_args(arguments, 1)
    destination = args[0] || source.replace(/\.tt$/, '')
    
    source  = File.expandFile(@findInSourcePaths(source))
    
    data    = @render(File.read(source), @locals())
    
    @createFile destination, data, options
    
  render: (string, options = {}) ->  
    require('ejs').render(string, options)
  
  chmod: (path, mode, options = {}) ->
    return unless behavior == "invoke"
    path = File.expandFile(path, destination_root)
    @sayStatus "chmod", @relativeToOriginalDestinationRoot(path), options.fetch("verbose", true)
    FileUtils.chmod_R(mode, path) unless options.pretend

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
  
  gsubFile: (path, flag) ->
    return unless behavior == "invoke"
    {args, options, block} = @_args(arguments, 2)
    
    path = File.expandFile(path, destination_root)
    @sayStatus "gsub", @relativeToOriginalDestinationRoot(path), options.fetch("verbose", true)

    unless options.pretend
      content = File.binread(path)
      content.gsub(flag, args..., block)
      File.open path, 'wb', (file) -> file.write(content)
  
  uncommentLines: (path, flag) ->
    flag = if flag.hasOwnProperty("source") then flag.source else flag

    @gsubFile(path, /^(\s*)#\s*(.*#{flag})/, '\1\2', args...)
  
  commentLines: (path, flag) ->
    {args, options, block} = @_args(arguments, 2)
    
    flag = if flag.hasOwnProperty("source") then flag.source else flag
    
    @gsubFile(path, /^(\s*)([^#|\n]*#{flag})/, '\1# \2', args...)
  
  removeFile: (path, options = {}) ->
    return unless behavior == "invoke"
    path  = File.expandFile(path, destination_root)
    
    @sayStatus "remove", @relativeToOriginalDestinationRoot(path), options.fetch("verbose", true)
    FileUtils.rm_rf(path) if !options.pretend && File.exists?(path)
  
  removeDir: ->
    @removeFile arguments...
    
  _invokeWithConflictCheck: (block) ->
    if File.exists(path)
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
      
    if Tower.Support.Object.isHash(args[args.length - 1])
      options = args.pop()
    else
      options = {}
        
    args: args, options: options, block: block
    
  findInSourcePaths: (path) ->
    File.expandFile(File.join(@sourceRoot, "templates", @currentSourceDirectory, path))
    
module.exports = Tower.Generator.Actions
