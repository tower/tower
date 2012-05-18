if typeof Ember != 'undefined'
  coffeescriptMixin =
    __extend: (child) ->
      object = Ember.Object.extend.apply @
      object.__name__ = child.name
      if @extended
        @extended.call(object)
      else
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
  Ember.Application.reopenClass(coffeescriptMixin)
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
  Ember.Application.reopenClass(towerMixin)
  Tower.Collection.reopenClass(towerMixin)
  Tower.State.reopenClass(towerMixin)
  Tower.StateMachine.reopenClass(towerMixin)

  if Ember.View
    Ember.View.reopenClass(coffeescriptMixin)
    Ember.View.reopenClass(towerMixin)
    Ember.CollectionView.reopenClass(coffeescriptMixin)
    Ember.CollectionView.reopenClass(towerMixin)
    Ember.ContainerView.reopenClass(coffeescriptMixin)
    Ember.ContainerView.reopenClass(towerMixin)

  # need to put in a place where you can set this before it reaches here.
  Ember.NATIVE_EXTENSIONS = Tower.nativeExtensions

  #if Tower.nativeExtensions
  #  _.extend(Function.prototype, coffeescriptMixin, towerMixin)
else
  throw new Error('Must include Ember.js')
  #class Tower.Class
  #
  #_.extend Tower.Class, Tower.toMixin()
  #
  #class Tower.Namespace extends Tower.Class
  #class Tower.Collection extends Tower.Class

module.exports = Tower.Class
