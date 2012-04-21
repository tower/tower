var coffeescriptMixin, towerMixin;

Tower.Class = Ember.Object.extend();

Tower.Namespace = Ember.Namespace.extend();

coffeescriptMixin = {
  __extend: function() {
    return this.extend.apply(this, arguments);
  },
  __defineStaticProperty: function(key, value) {
    var object;
    object = {};
    object[key] = value;
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

towerMixin = Tower.toMixin();

Tower.Class.reopenClass(towerMixin);

Tower.Namespace.reopenClass(towerMixin);

module.exports = Tower.Class;
