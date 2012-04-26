var specialProperties,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

specialProperties = ['included', 'extended', 'prototype', 'ClassMethods', 'InstanceMethods'];

Tower.Class = Ember.Object.extend();

Ember.Object.reopenClass({
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
});

Tower.Class.reopenClass({
  mixin: function(self, object) {
    var key, value;
    for (key in object) {
      value = object[key];
      if (__indexOf.call(specialProperties, key) < 0) {
        self[key] = value;
      }
    }
    return object;
  },
  extend: function(object) {
    var extended;
    extended = object.extended;
    delete object.extended;
    this.reopenClass(object);
    if (extended) {
      extended.apply(object);
    }
    return object;
  },
  include: function(object) {
    var included;
    included = object.included;
    delete object.included;
    if (object.hasOwnProperty("ClassMethods")) {
      this.extend(object.ClassMethods);
    }
    if (object.hasOwnProperty("InstanceMethods")) {
      this.include(object.InstanceMethods);
    }
    this.mixin(this.prototype, object);
    if (included) {
      included.apply(object);
    }
    return object;
  },
  className: function() {
    return _.functionName(this);
  }
});

module.exports = Tower.Class;
