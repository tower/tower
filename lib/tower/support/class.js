var coffeescriptMixin, towerMixin;

if (typeof Ember !== 'undefined') {
  coffeescriptMixin = {
    __extend: function(child) {
      var object;
      object = Ember.Object.extend.apply(this);
      object.__name__ = child.name;
      if (this.extended) {
        this.extended.call(object);
      }
      return object;
    },
    __defineStaticProperty: function(key, value) {
      var object;
      object = {};
      object[key] = value;
      this[key] = value;
      return this.reopenClass(object);
    },
    __defineProperty: function(key, value) {
      var object;
      object = {};
      object[key] = value;
      return this.reopen(object);
    }
  };
  Ember.Object.reopenClass(coffeescriptMixin);
  Ember.Namespace.reopenClass(coffeescriptMixin);
  Ember.Application.reopenClass(coffeescriptMixin);
  Ember.ArrayProxy.reopenClass(coffeescriptMixin);
  Ember.State.reopenClass(coffeescriptMixin);
  Ember.StateManager.reopenClass(coffeescriptMixin);
  Tower.Class = Ember.Object.extend({
    className: function() {
      return this.constructor.className();
    }
  });
  Tower.Namespace = Ember.Namespace.extend();
  Tower.Collection = Ember.ArrayProxy.extend();
  Tower.State = Ember.State.extend();
  Tower.StateMachine = Ember.StateManager.extend();
  towerMixin = Tower.toMixin();
  Tower.Class.reopenClass(towerMixin);
  Tower.Namespace.reopenClass(towerMixin);
  Ember.Application.reopenClass(towerMixin);
  Tower.Collection.reopenClass(towerMixin);
  Tower.State.reopenClass(towerMixin);
  Tower.StateMachine.reopenClass(towerMixin);
  if (Ember.View) {
    Ember.View.reopenClass(coffeescriptMixin);
    Ember.View.reopenClass(towerMixin);
    Ember.CollectionView.reopenClass(coffeescriptMixin);
    Ember.CollectionView.reopenClass(towerMixin);
  }
  Ember.NATIVE_EXTENSIONS = Tower.nativeExtensions;
} else {
  throw new Error("Must include Ember.js");
}

module.exports = Tower.Class;
