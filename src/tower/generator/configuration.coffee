Tower.Generator.Configuration =
  ClassMethods:
    
    # Returns the source root for this generator using defaultSourceRoot as default.
    sourceRoot: (path) ->
      @_sourceRoot = path if path
      @_sourceRoot ||= defaultSourceRoot
    
    # Convenience method to get the namespace from the class name. It's the
    # same as Thor default except that the Generator at the end of the class
    # is removed.
    namespace: (name) ->
      @namespace ||= super.replace(/_generator$/, '').replace(/:generators:/, ':')

    # Invoke a generator based on the value supplied by the user to the
    # given option named "name". A class option is created when this method
    # is invoked and you can set a hash to customize it.
    #
    # ==== Examples
    #
    #   module Rails::Generators
    #     class ControllerGenerator < Base
    #       hookFor :test_framework, :aliases => "-t"
    #     end
    #   end
    #
    # The example above will create a test framework option and will invoke
    # a generator based on the user supplied value.
    #
    # For example, if the user invoke the controller generator as:
    #
    #   rails generate controller Account --test-framework=test_unit
    #
    # The controller generator will then try to invoke the following generators:
    #
    #   "rails:test_unit", "test_unit:controller", "test_unit"
    #
    # Notice that "rails:generators:test_unit" could be loaded as well, what
    # Rails looks for is the first and last parts of the namespace. This is what
    # allows any test framework to hook into Rails as long as it provides any
    # of the hooks above.
    #
    # ==== Options
    #
    # The first and last part used to find the generator to be invoked are
    # guessed based on class invokes hookFor, as noticed in the example above.
    # This can be customized with two options: :base and :as.
    #
    # Let's suppose you are creating a generator that needs to invoke the
    # controller generator from test unit. Your first attempt is:
    #
    #   class AwesomeGenerator < Rails::Generators::Base
    #     hookFor :test_framework
    #   end
    #
    # The lookup in this case for test_unit as input is:
    #
    #   "test_framework:awesome", "test_framework"
    #
    # Which is not the desired the lookup. You can change it by providing the
    # :as option:
    #
    #   class AwesomeGenerator < Rails::Generators::Base
    #     hookFor :test_framework, :as => :controller
    #   end
    #
    # And now it will lookup at:
    #
    #   "test_framework:controller", "test_framework"
    #
    # Similarly, if you want it to also lookup in the rails namespace, you just
    # need to provide the :base value:
    #
    #   class AwesomeGenerator < Rails::Generators::Base
    #     hookFor :test_framework, :in => :rails, :as => :controller
    #   end
    #
    # And the lookup is exactly the same as previously:
    #
    #   "rails:test_framework", "test_framework:controller", "test_framework"
    #
    # ==== Switches
    #
    # All hooks come with switches for user interface. If you do not want
    # to use any test framework, you can do:
    #
    #   rails generate controller Account --skip-test-framework
    #
    # Or similarly:
    #
    #   rails generate controller Account --no-test-framework
    #
    # ==== Boolean hooks
    #
    # In some cases, you want to provide a boolean hook. For example, webrat
    # developers might want to have webrat available on controller generator.
    # This can be achieved as:
    #
    #   Rails::Generators::ControllerGenerator.hookFor :webrat, :type => :boolean
    #
    # Then, if you want, webrat to be invoked, just supply:
    #
    #   rails generate controller Account --webrat
    #
    # The hooks lookup is similar as above:
    #
    #   "rails:generators:webrat", "webrat:generators:controller", "webrat"
    #
    # ==== Custom invocations
    #
    # You can also supply a block to hookFor to customize how the hook is
    # going to be invoked. The block receives two arguments, an instance
    # of the current class and the klass to be invoked.
    #
    # For example, in the resource generator, the controller should be invoked
    # with a pluralized class name. But by default it is invoked with the same
    # name as the resource generator, which is singular. To change this, we
    # can give a block to customize how the controller can be invoked.
    #
    #   hookFor :resource_controller do |instance, controller|
    #     instance.invoke controller, [ instance.name.pluralize ]
    #   end
    #
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

    # Remove a previously added hook.
    #
    # ==== Examples
    #
    #   removeHookFor :orm
    #
    removeHookFor: (names...) ->
      remove_invocation(names...)

      for name in names
        delete hooks[name]
        
      hooks
      
    # Make class option aware of Rails::Generators.options and Rails::Generators.aliases.
    classOption: (name, options = {}) ->
      options.desc    = "Indicates when to generate #{name.to_s.humanize.downcase}" unless options.hasOwnProperty("desc")
      options.aliases = @defaultAliasesForOption(name, options)
      options.default = @defaultValueForOption(name, options)
      super(name, options)

    # Returns the default source root for a given generator. This is used internally
    # by rails to set its generators source root. If you want to customize your source
    # root, you should use sourceRoot.
    defaultSourceRoot: ->
      return unless baseName && generatorName
      path = File.expand_path(File.join(baseName, generatorName, 'templates'), @baseRoot())
      path if File.exists?(path)
      
    # Returns the base root for a common set of generators. This is used to dynamically
    # guess the default source root.
    baseRoot: ->
      File.dirname(__FILE__)
    
module.exports = Tower.Generator.Configuration
