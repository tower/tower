if typeof Ember != 'undefined'
  coffeescriptMixin = 
    __extend: (child) ->
      object = Ember.Object.extend.apply @
      object.__name__ = child.name
      #Tower.Class.extend.call object, @
      #object.reopenClass(coreMixins)
      @extended.call object if @extended
      object

    __defineStaticProperty: (key, value) ->
      object = {}
      object[key] = value
      @[key] = value
      @reopenClass(object)

    __defineProperty: (key, value) ->
      object = {}
      object[key] = value
      @reopen(object)

  Ember.Object.reopenClass(coffeescriptMixin)
  Ember.Namespace.reopenClass(coffeescriptMixin)
  Ember.ArrayProxy.reopenClass(coffeescriptMixin)
  Ember.State.reopenClass(coffeescriptMixin)
  Ember.StateManager.reopenClass(coffeescriptMixin)

  Tower.Class       = Ember.Object.extend(className: -> @constructor.className())
  Tower.Namespace   = Ember.Namespace.extend()
  Tower.Collection  = Ember.ArrayProxy.extend()
  Tower.State       = Ember.State.extend()
  Tower.StateMachine  = Ember.StateManager.extend()

  towerMixin        = Tower.toMixin()

  Tower.Class.reopenClass(towerMixin)
  Tower.Namespace.reopenClass(towerMixin)
  Tower.Collection.reopenClass(towerMixin)
  Tower.State.reopenClass(towerMixin)
  Tower.StateMachine.reopenClass(towerMixin)
  
  # need to put in a place where you can set this before it reaches here.
  Ember.NATIVE_EXTENSIONS = Tower.nativeExtensions
  
  if Tower.nativeExtensions
    _.extend(Function.prototype, coffeescriptMixin, towerMixin)
else
  class Tower.Class
    
  _.extend Tower.Class, Tower.toMixin()
  
  class Tower.Namespace extends Tower.Class
  class Tower.Collection extends Tower.Class

module.exports = Tower.Class
