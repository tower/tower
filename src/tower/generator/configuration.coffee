Tower.Generator.Configuration =
  ClassMethods:
    sourceRoot: (path) ->
      @_sourceRoot = path if path
      @_sourceRoot ||= defaultSourceRoot
    
    namespace: (name) ->
      @namespace ||= super.replace(/_generator$/, '').replace(/:generators:/, ':')
    
    hookFor: (names..., block) ->
      options = names.extract_options
      in_base = options["in"] || baseName
      as_hook = options["as"] || generatorName
      
      delete options["in"]
      delete options["as"]

      for name in names
        defaults = if options.type == "boolean"
          {}
        else if @defaultValueForOption(name, options).in?([true, false])
          {banner: ""}
        else
          {desc: "#{name.to_s.humanize} to be invoked", banner: "NAME"}

        unless classOptions.hasOwnProperty(name)
          classOption(name, defaults.merge(options))

        hooks[name] = [in_base, as_hook]
        @invokeFromOption name, options, block
    
    removeHookFor: (names...) ->
      remove_invocation(names...)

      for name in names
        delete hooks[name]
        
      hooks
      
    classOption: (name, options = {}) ->
      options.desc    = "Indicates when to generate #{name.to_s.humanize.downcase}" unless options.hasOwnProperty("desc")
      options.aliases = @defaultAliasesForOption(name, options)
      options.default = @defaultValueForOption(name, options)
      super(name, options)
    
    defaultSourceRoot: ->
      return unless baseName && generatorName
      path = File.expand_path(File.join(baseName, generatorName, 'templates'), @baseRoot())
      path if File.exists?(path)
    
    baseRoot: ->
      File.dirname(__FILE__)
    
module.exports = Tower.Generator.Configuration
