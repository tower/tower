# @module
# Provides an interface for any class to have Tower.Model like callbacks.
# 
# Like the Tower.Model methods, the callback chain is aborted as soon as one of the methods in the chain returns false.
# 
# To use, include {Tower.Support.Callbacks} in the class you are creating:
# 
#     class App.Location
#       @include Tower.Support.Callbacks
# 
Tower.Support.Callbacks =
  ClassMethods:
    before: ->
      @appendCallback "before", arguments...

    # @example
    #   class App.User extends Tower.Model
    #     @before "save", "beforeSave"
    #
    #     beforeSave: (callback) ->
    #       # before
    #       callback.call @
    #       # after
    after: ->
      @appendCallback "after", arguments...

    callback: ->
      args = _.args(arguments)
      args = ["after"].concat args unless args[0].match(/^(?:before|around|after)$/)
      @appendCallback args...

    removeCallback: (action, phase, run) ->
      @

    appendCallback: (phase) ->
      args = _.args(arguments, 1)
      if typeof args[args.length - 1] != "object"
        method    = args.pop()
      if typeof args[args.length - 1] == "object"
        options   = args.pop()
      method    ||= args.pop()
      options   ||= {}

      callbacks   = @callbacks()

      for filter in args
        callback = callbacks[filter] ||= new Tower.Support.Callbacks.Chain
        callback.push phase, method, options

      @

    prependCallback: (action, phase, run, options = {}) ->
      @

    # @todo need to apply metadata here
    callbacks: ->
      @_callbacks ||= {}

  runCallbacks: (kind, options, block, complete) ->
    if typeof options == "function"
      complete  = block
      block     = options
      options   = {}

    options   ||= {}
    
    chain = @constructor.callbacks()[kind]
    
    if chain
      chain.run(@, options, block, complete)
    else
      block.call @
      complete.call @ if complete

  _callback: (callbacks...) ->
    (error) =>
      for callback in callbacks
        callback.call(@, error) if callback

class Tower.Support.Callbacks.Chain
  constructor: (options = {}) ->
    @[key] = value for key, value of options

    @before ||= []
    @after  ||= []
    
  clone: ->
    new Tower.Support.Callbacks.Chain(before: @before.concat(), after: @after.concat())

  run: (binding, options, block, complete) ->
    runner    = (callback, next) =>
      callback.run(binding, options, next)

    Tower.async @before, runner, (error) =>
      unless error
        if block
          # this won't work with coffee-scripts __bind method!
          # it wraps the function with 0 arguments, when yours might have the callback
          switch block.length
            when 0
              block.call(binding)
              Tower.async @after, runner, (error) =>
                complete.call binding if complete
                binding
            else
              block.call binding, (error) =>
                unless error
                  Tower.async @after, runner, (error) =>
                    complete.call binding if complete
                    binding
        else
          Tower.async @after, runner, (error) =>
            complete.call binding if complete
            binding

  push: (phase, method, filters, options) ->
    @[phase].push new Tower.Support.Callback(method, filters, options)

class Tower.Support.Callback
  constructor: (method, conditions = {}) ->
    @method       = method
    @conditions   = conditions

    conditions.only   = _.castArray(conditions.only) if conditions.hasOwnProperty("only")
    conditions.except = _.castArray(conditions.except) if conditions.hasOwnProperty("except")

  run: (binding, options, next) ->
    conditions  = @conditions

    if options && options.hasOwnProperty("name")
      if conditions.hasOwnProperty("only")
        return next() if _.indexOf(conditions.only, options.name) == -1
      else if conditions.hasOwnProperty("except")
        return next() if _.indexOf(conditions.except, options.name) != -1

    method      = @method
    if typeof method == "string"
      throw new Error("The method `#{method}` doesn't exist") unless binding[method]
      method      = binding[method]

    switch method.length
      when 0
        result = method.call binding
        next(if !result then new Error("Callback did not pass") else null)
      else
        method.call binding, next

module.exports = Tower.Support.Callbacks
