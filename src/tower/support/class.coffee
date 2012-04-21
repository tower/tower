# doesn't work:
# Ember.Object.__extend = -> @extend arguments...

Tower.Class     = Ember.Object.extend()
Tower.Namespace = Ember.Namespace.extend()

coffeescriptMixin = 
  __extend: ->
    @extend arguments...
    
  __defineStaticProperty: (key, value) ->
    object = {}
    object[key] = value
    @reopenClass(object)
    
  __defineProperty: (key, value) ->
    object = {}
    object[key] = value
    @reopen(object)

Ember.Object.reopenClass(coffeescriptMixin)
Ember.Namespace.reopenClass(coffeescriptMixin)

towerMixin = Tower.toMixin()

Tower.Class.reopenClass(towerMixin)
Tower.Namespace.reopenClass(towerMixin)

module.exports = Tower.Class
