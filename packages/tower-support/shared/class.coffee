_ = Tower._

if typeof global['Ember'] != 'undefined'
  Ember.Map::toArray = ->
    Tower._.values(@values)

  coffeescriptMixin =
    __extend: (child) ->
      object = Ember.Object.extend.apply @
      object.__name__ = child.name
      @extended.call(object) if @extended
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

  # In Ember 1.0pre+, Ember.Application is dependent on the browser.
  Ember.Application = Ember.Namespace.extend() unless Ember.Application

  Ember.Object.reopenClass(coffeescriptMixin)
  Ember.Namespace.reopenClass(coffeescriptMixin)
  Ember.Application.reopenClass(coffeescriptMixin)
  Ember.ArrayProxy.reopenClass(coffeescriptMixin)
  Ember.ArrayController.reopenClass(coffeescriptMixin)

  if Ember.ObjectProxy
    Ember.ObjectProxy.reopenClass(coffeescriptMixin)
    Ember.ObjectController.reopenClass(coffeescriptMixin)

  Tower.Class       = Ember.Object.extend(className: -> @constructor.className())
  Tower.Namespace   = Ember.Namespace.extend()
  Tower.Collection  = Ember.ArrayController.extend()
  
  if Ember.State
    Ember.State.reopenClass(coffeescriptMixin)
    Ember.StateManager.reopenClass(coffeescriptMixin)
    Tower.State       = Ember.State.extend()
    Tower.StateMachine  = Ember.StateManager.extend()

  towerMixin        = Tower.toMixin()

  Tower.Class.reopenClass(towerMixin)
  Tower.Namespace.reopenClass(towerMixin)
  Ember.Application.reopenClass(towerMixin)
  Tower.Collection.reopenClass(towerMixin)

  if Tower.State
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

  # Should see if ember already has this or add to ember core.
  Ember.Map.prototype.replaceKey = (oldKey, newKey) ->
    values  = @values
    list    = @keys.list
    guid    = Ember.guidFor(oldKey)
    value   = values[guid] # the old record
    delete values[guid]
    list.replace(list.indexOf(oldKey), 1, newKey)
    values[Ember.guidFor(newKey)] = value
    undefined

  #if Tower.nativeExtensions
  #  _.extend(Function.prototype, coffeescriptMixin, towerMixin)
else
  #throw new Error('Must include Ember.js')
  #class Tower.Class
  #
  #_.extend Tower.Class, Tower.toMixin()
  #
  #class Tower.Namespace extends Tower.Class
  #class Tower.Collection extends Tower.Class

module.exports = Tower.Class
