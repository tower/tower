Tower.Generator.Actions =
  taskfile: (filename, data, block) ->
    @log "rakefile", filename
    @createFile "lib/tasks/#{filename}", data, verbose: false, block
    
  initializer: (filename, data, &block) ->
    @log "initializer", filename
    @createFile "config/initializers/#{filename}", data, verbose: false, block
    
  # Make an entry in Rails routing file config/routes.rb
  #
  # === Example
  #
  #   route "root :to => 'welcome'"
  #
  def route(routingCode)
    @log "route", routingCode
    sentinel = /\.routes\.draw do(?:\s*\|map\|)?\s*$/
    
    @inRoot ->
      @injectIntoFile 'config/routes.rb', "\n  #{routing_code}\n", after: sentinel, verbose: false
    
  nodeModule: (name, options = {}) ->
    
  injectIntoFile: (file, options, callback) ->
    
  readFile: (file) ->
  
  createFile: (file, data) ->
    
  file: (file, data) ->
    @createFile(file, data)
    
  removeFile: (file) ->
    
  createDirectory: (name) ->
    
  directory: (name) ->
    @createDirectory(name)
    
  removeDirectory: (name) ->
    
  emptyDirectory: (name) ->
    
  chmod: (path, permissions = 0755, options = {}) ->
  
  # template "options/databases/#{options[:database]}.yml", "options/database.yml"  
  template: (path) ->
  
  # @inside "config", ->
  #   @template "routes.rb"
  #   @template "application.rb"
  #   @template "environment.rb"
  # 
  #   @directory "environments"
  #   @directory "initializers"
  #   @directory "locales"
  inside: (directory, block) ->
    
  sayStatus: (status, color) ->
    _console.log status if @options.verbose
    #base.shell.sayStatus status, relativeDestination, color if options.verbose
  
  # Copies the file from the relative source to the relative destination. If
  # the destination is not given it's assumed to be equal to the source.
  #
  # ==== Parameters
  # source<String>:: the relative path to the source root.
  # destination<String>:: the relative path to the destination root.
  # options<Hash>:: give :verbose => false to not log the status.
  #
  # ==== Examples
  #
  #   copy_file "README", "doc/README"
  #
  #   copy_file "doc/README"
  #
  # @copyFile(source, args..., block)
  copyFile: (source) ->
    {args, options, block} = @_args(arguments, 1)
    destination = args[0] || source
    source = File.expand_path(@findInSourcePaths(source))
    
    @createFile destination, null, options, ->
      content = File.binread(source)
      content = block.call(content) if block
      content

  # Links the file from the relative source to the relative destination. If
  # the destination is not given it's assumed to be equal to the source.
  #
  # ==== Parameters
  # source<String>:: the relative path to the source root.
  # destination<String>:: the relative path to the destination root.
  # options<Hash>:: give :verbose => false to not log the status.
  #
  # ==== Examples
  #
  #   link_file "README", "doc/README"
  #
  #   link_file "doc/README"
  #
  linkFile: (source) ->
    {args, options, block} = @_args(arguments, 1)
    destination = args.first || source
    source = File.expand_path(@findInSourcePaths(source))

    @createLink destination, source, options
  
  # Gets the content at the given address and places it at the given relative
  # destination. If a block is given instead of destination, the content of
  # the url is yielded and used as location.
  #
  # ==== Parameters
  # source<String>:: the address of the given content.
  # destination<String>:: the relative path to the destination root.
  # options<Hash>:: give :verbose => false to not log the status.
  #
  # ==== Examples
  #
  #   get "http://gist.github.com/103208", "doc/README"
  #
  #   get "http://gist.github.com/103208" do |content|
  #     content.split("\n").first
  #   end
  #
  get: (source) ->
    {args, options, block} = @_args(arguments, 1)
    destination = args.first
    
    source = File.expand_path(@findInSourcePaths(source.to_s)) unless !!source.match(/^https?\:\/\//)
    render = open source, (input) -> input.binmode.read
    
    destination ||= if block_given?
      block.arity == if 1 then block.call(render) else block.call
    else
      File.basename(source)
    
    @createFile destination, render, options

  # Gets an ERB template at the relative source, executes it and makes a copy
  # at the relative destination. If the destination is not given it's assumed
  # to be equal to the source removing .tt from the filename.
  #
  # ==== Parameters
  # source<String>:: the relative path to the source root.
  # destination<String>:: the relative path to the destination root.
  # options<Hash>:: give :verbose => false to not log the status.
  #
  # ==== Examples
  #
  #   template "README", "doc/README"
  #
  #   template "doc/README"
  #
  template: (source) ->
    {args, options, block} = @_args(arguments, 1)
    destination = args.first || source.sub(/\.tt$/, '')
    
    source  = File.expand_path(findInSourcePaths(source.to_s))
    context = instance_eval('binding')
    
    @createFile destination, null, options, ->
      content = ERB.new(File.binread(source), null, '-', '@output_buffer').result(context)
      content = block.call(content) if block
      content
  
  # Changes the mode of the given file or directory.
  #
  # ==== Parameters
  # mode<Integer>:: the file mode
  # path<String>:: the name of the file to change mode
  # options<Hash>:: give :verbose => false to not log the status.
  #
  # ==== Example
  #
  #   chmod "script/*", 0755
  #
  chmod: (path, mode, options = {}) ->
    return unless behavior == "invoke"
    path = File.expand_path(path, destination_root)
    @sayStatus "chmod", @relativeToOriginalDestinationRoot(path), options.fetch("verbose", true)
    FileUtils.chmod_R(mode, path) unless options.pretend

  # Prepend text to a file. Since it depends on insertIntoFile, it's reversible.
  #
  # ==== Parameters
  # path<String>:: path of the file to be changed
  # data<String>:: the data to prepend to the file, can be also given as a block.
  # options<Hash>:: give :verbose => false to not log the status.
  #
  # ==== Example
  #
  #   prependToFile 'options/environments/test.rb', 'options.gem "rspec"'
  #
  #   prependToFile 'options/environments/test.rb' do
  #     'options.gem "rspec"'
  #   end
  #
  prependToFile: (path) ->
    {args, options, block} = @_args(arguments, 1)
    
    options.merge(after: /\A/)
    args.push options
    args.push block
    @insertIntoFile(path, args...)
  
  prependFile: ->
    @prependToFile arguments...

  # Append text to a file. Since it depends on insertIntoFile, it's reversible.
  #
  # ==== Parameters
  # path<String>:: path of the file to be changed
  # data<String>:: the data to append to the file, can be also given as a block.
  # options<Hash>:: give :verbose => false to not log the status.
  #
  # ==== Example
  #
  #   appendToFile 'options/environments/test.rb', 'options.gem "rspec"'
  #
  #   appendToFile 'options/environments/test.rb', ->
  #     'options.gem "rspec"'
  #
  appendToFile: (path) ->
    {args, options, block} = @_args(arguments, 1)
    options.merge(before: /\z/)
    args.push options
    args.push block
    @insertIntoFile(path, args...)
  
  appendFile: ->
    @appendToFile arguments...

  # Injects text right after the class definition. Since it depends on
  # insertIntoFile, it's reversible.
  #
  # ==== Parameters
  # path<String>:: path of the file to be changed
  # klass<String|Class>:: the class to be manipulated
  # data<String>:: the data to append to the class, can be also given as a block.
  # options<Hash>:: give :verbose => false to not log the status.
  #
  # ==== Examples
  #
  #   injectIntoClass "app/controllers/application_controller.rb", ApplicationController, "  filter_parameter :password\n"
  #
  #   injectIntoClass "app/controllers/application_controller.rb", ApplicationController do
  #     "  filter_parameter :password\n"
  #   end
  #
  injectIntoClass: (path, klass) ->
    {args, options, block} = @_args(arguments, 2)
    options.merge(after: /class #{klass}\n|class #{klass} .*\n/)
    args.push options
    args.push block
    @insertIntoFile(path, args...)
  
  # Run a regular expression replacement on a file.
  #
  # ==== Parameters
  # path<String>:: path of the file to be changed
  # flag<Regexp|String>:: the regexp or string to be replaced
  # replacement<String>:: the replacement, can be also given as a block
  # options<Hash>:: give :verbose => false to not log the status.
  #
  # ==== Example
  #
  #   gsubFile 'app/controllers/application_controller.rb', /#\s*(filter_parameter_logging :password)/, '\1'
  #
  #   gsubFile 'README', /rake/, :green do |match|
  #     match << " no more. Use thor!"
  #   end
  #
  gsubFile: (path, flag) ->
    return unless behavior == "invoke"
    {args, options, block} = @_args(arguments, 2)
    
    path = File.expand_path(path, destination_root)
    @sayStatus "gsub", @relativeToOriginalDestinationRoot(path), options.fetch("verbose", true)

    unless options.pretend
      content = File.binread(path)
      content.gsub(flag, args..., block)
      File.open path, 'wb', (file) -> file.write(content)

  # Uncomment all lines matching a given regex.  It will leave the space
  # which existed before the comment hash in tact but will remove any spacing
  # between the comment hash and the beginning of the line.
  #
  # ==== Parameters
  # path<String>:: path of the file to be changed
  # flag<Regexp|String>:: the regexp or string used to decide which lines to uncomment
  # options<Hash>:: give :verbose => false to not log the status.
  #
  # ==== Example
  #
  #   uncommentLines 'options/initializers/session_store.rb', /active_record/
  #
  uncommentLines: (path, flag) ->
    flag = if flag.hasOwnProperty("source") then flag.source else flag

    @gsubFile(path, /^(\s*)#\s*(.*#{flag})/, '\1\2', args...)
  
  # Comment all lines matching a given regex.  It will leave the space
  # which existed before the beginning of the line in tact and will insert
  # a single space after the comment hash.
  #
  # ==== Parameters
  # path<String>:: path of the file to be changed
  # flag<Regexp|String>:: the regexp or string used to decide which lines to comment
  # options<Hash>:: give :verbose => false to not log the status.
  #
  # ==== Example
  #
  #   commentLines 'options/initializers/session_store.rb', /cookie_store/
  #
  commentLines: (path, flag) ->
    {args, options, block} = @_args(arguments, 2)
    
    flag = if flag.hasOwnProperty("source") then flag.source else flag
    
    @gsubFile(path, /^(\s*)([^#|\n]*#{flag})/, '\1# \2', args...)
  
  # Removes a file at the given location.
  #
  # ==== Parameters
  # path<String>:: path of the file to be changed
  # options<Hash>:: give :verbose => false to not log the status.
  #
  # ==== Example
  #
  #   remove_file 'README'
  #   remove_file 'app/controllers/application_controller.rb'
  #
  removeFile: (path, options = {}) ->
    return unless behavior == "invoke"
    path  = File.expand_path(path, destination_root)
    
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

  # What to do when the destination file already exists.
  #
  _onConflictBehavior: (block) ->
    sayStatus "exist", "blue", block
    
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
    
module.exports = Tower.Generator.Actions
