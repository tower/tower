# doesn't work:
# Ember.Object.__extend = -> @extend arguments...

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

Tower.Class     = Ember.Object.extend(className: -> @constructor.className())
Tower.Namespace = Ember.Namespace.extend()

towerMixin = Tower.toMixin()

Tower.Class.reopenClass(towerMixin)
Tower.Namespace.reopenClass(towerMixin)

module.exports = Tower.Class
