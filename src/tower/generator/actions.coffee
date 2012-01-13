File = require('pathfinder').File
_path  = require('path')
fs    = require('fs')

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
  injectIntoFile: (file, options, callback) ->
    
  readFile: (file) ->
  
  createFile: (path, data) ->
    File.write @destinationPath(path), data
    
  destinationPath: (path) ->
    File.join(@destinationRoot, @cd, path)
    
  file: (file, data) ->
    @createFile(file, data)
    
  removeFile: (file) ->
    
  createDirectory: (name) ->
    File.mkdirpSync(@destinationPath(name))
    
  directory: (name) ->
    @createDirectory(name)
    
  removeDirectory: (name) ->
    
  emptyDirectory: (name) ->
    
  inside: (directory, block) ->
    cd  = @cd
    @cd = File.join(@cd, directory)
    block.call @
    @cd = cd
    
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
  
  get: (source) ->
    {args, options, block} = @_args(arguments, 1)
    destination = args.first
    
    source = File.expandFile(@findInSourcePaths(source.to_s)) unless !!source.match(/^https?\:\/\//)
    render = open source, (input) -> input.binmode.read
    
    destination ||= if block_given?
      block.arity == if 1 then block.call(render) else block.call
    else
      File.basename(source)
    
    @createFile destination, render, options
  
  template: (source) ->
    {args, options, block} = @_args(arguments, 1)
    destination = args[0] || source.replace(/\.tt$/, '')
    
    source  = File.expandFile(@findInSourcePaths(source))
    
    options.user =
      name: "Lance Pollard"
      email: "lancejpollard@gmail.com"
      username: "viatropos"
      
    options.project =
      name: "test-project"
      title: "Test Project"
      
    options.model = @model
    
    data    = @render(File.read(source), options)
    
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
    
  _args: (args, index) ->
    args = Array.prototype.slice.call(args, index, args.length - 1)
    
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
    File.expandFile(File.join(@sourceRoot, "templates", @cd, path))
    
module.exports = Tower.Generator.Actions
