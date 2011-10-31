class Metro.Model.Callbacks
  @CALLBACKS = [
    "afterInitialize", "afterFind", "afterTouch", "beforeValidation", "afterValidation",
    "beforeSave", "aroundSave", "afterSave", "beforeCreate", "aroundCreate",
    "afterCreate", "beforeUpdate", "aroundUpdate", "afterUpdate",
    "beforeDestroy", "aroundDestroy", "afterDestroy", "afterCommit", "afterRollback"
  ]
  
  @defineCallbacks: ->
    callbacks = Metro.Support.Array.extractArgsAndOptions(arguments)
    options   = callbacks.pop()
    options.terminator ||= "result == false"
    options.scope ||= ["kind", "name"]
    options.only ||= ["before", "around", "after"]
    types = options.only.map (type) -> Metro.Support.String.camelize("_#{type}")
    
    for callback in callbacks
      for type in types
        @["_define#{type}Callback"](callback)
    
  @_defineBeforeCallback: (name) ->
    @["before#{Metro.Support.String.camelize("_#{name}")}"] = ->
      @setCallback(name, "before", arguments...)
      
  @_defineAroundCallback: (name) ->
    @["around#{Metro.Support.String.camelize("_#{name}")}"] = ->
      @setCallback(name, "around", arguments...)
      
  @_defineAfterCallback: (name) ->
    @["after#{Metro.Support.String.camelize("_#{name}")}"] = ->
      @setCallback(name, "after", arguments...)
  
  createOrUpdate: ->
    @runCallbacks "save", -> @super

  create: ->
    @runCallbacks "create", -> @super

  update: ->
    @runCallbacks "update", -> @super
    
  destroy: ->
    @runCallbacks "destroy", -> @super
    
module.exports = Metro.Model.Callbacks
