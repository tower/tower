var coffeescriptMixin, towerMixin, _;

_ = Tower._;

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
  if (!Ember.Application) {
    Ember.Application = Ember.Namespace.extend();
  }
  Ember.Object.reopenClass(coffeescriptMixin);
  Ember.Namespace.reopenClass(coffeescriptMixin);
  Ember.Application.reopenClass(coffeescriptMixin);
  Ember.ArrayProxy.reopenClass(coffeescriptMixin);
  Ember.ArrayController.reopenClass(coffeescriptMixin);
  if (Ember.ObjectProxy) {
    Ember.ObjectProxy.reopenClass(coffeescriptMixin);
    Ember.ObjectController.reopenClass(coffeescriptMixin);
  }
  Ember.State.reopenClass(coffeescriptMixin);
  Ember.StateManager.reopenClass(coffeescriptMixin);
  Tower.Class = Ember.Object.extend({
    className: function() {
      return this.constructor.className();
    }
  });
  Tower.Namespace = Ember.Namespace.extend();
  Tower.Collection = Ember.ArrayController.extend();
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
    Ember.ContainerView.reopenClass(coffeescriptMixin);
    Ember.ContainerView.reopenClass(towerMixin);
  }
  Ember.NATIVE_EXTENSIONS = Tower.nativeExtensions;
  Ember.Map.prototype.replaceKey = function(oldKey, newKey) {
    var guid, list, value, values;
    values = this.values;
    list = this.keys.list;
    guid = Ember.guidFor(oldKey);
    value = values[guid];
    delete values[guid];
    list.replace(list.indexOf(oldKey), 1, newKey);
    values[Ember.guidFor(newKey)] = value;
    return void 0;
  };
} else {
  throw new Error('Must include Ember.js');
}

module.exports = Tower.Class;
