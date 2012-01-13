Tower.Generator.Configuration =
  ClassMethods:
    desc: (usage, description, options = {}) ->
      if options.for
        task = @findAndRefreshTask(options[:for])
        task.usage = usage             if usage
        task.description = description if description
      else
        @usage  = usage
        @desc   = description
        @hide   = options.hide || false
        
    sourceRoot: (path) ->
      @_sourceRoot = path if path
      @_sourceRoot ||= defaultSourceRoot
    
    namespace: (name) ->
      @namespace ||= super.replace(/_generator$/, '').replace(/:generators:/, ':')
    
    hookFor: (names..., block) ->
      options = names.extractOptions
      inBase = options["in"] || baseName
      asHook = options["as"] || generatorName
      
      delete options["in"]
      delete options["as"]

      for name in names
        defaults = if options.type == "boolean"
          {}
        else if @defaultValueForOption(name, options).in?([true, false])
          {banner: ""}
        else
          {desc: "#{name.toS.humanize} to be invoked", banner: "NAME"}

        unless classOptions.hasOwnProperty(name)
          classOption(name, defaults.merge(options))

        hooks[name] = [inBase, asHook]
        @invokeFromOption name, options, block
    
    removeHookFor: (names...) ->
      removeInvocation(names...)

      for name in names
        delete hooks[name]
        
      hooks
      
    classOption: (name, options = {}) ->
      options.desc    = "Indicates when to generate #{name.toS.humanize.downcase}" unless options.hasOwnProperty("desc")
      options.aliases = @defaultAliasesForOption(name, options)
      options.default = @defaultValueForOption(name, options)
      super(name, options)
    
    defaultSourceRoot: ->
      return unless baseName && generatorName
      path = File.expandPath(File.join(baseName, generatorName, 'templates'), @baseRoot())
      path if File.exists?(path)
    
    baseRoot: ->
      File.dirname(__FILE__)
    
module.exports = Tower.Generator.Configuration
