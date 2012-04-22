var coffeescriptMixin, towerMixin;

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

Tower.Class = Ember.Object.extend({
  className: function() {
    return this.constructor.className();
  }
});

Tower.Namespace = Ember.Namespace.extend();

towerMixin = Tower.toMixin();

Tower.Class.reopenClass(towerMixin);

Tower.Namespace.reopenClass(towerMixin);

Ember.ArrayProxy.reopenClass(coffeescriptMixin, towerMixin);

module.exports = Tower.Class;
