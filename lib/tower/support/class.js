var specialProperties,
  __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

specialProperties = ['included', 'extended', 'prototype', 'ClassMethods', 'InstanceMethods'];

Tower.Class = (function() {

  Class.global = function(value) {
    if (value !== void 0) this._global = value;
    if (this._global === void 0) this._global = true;
    if (value === true) {
      global[this.name] = this;
    } else if (value === false) {
      delete global[this.name];
    }
    return this._global;
  };

  Class.mixin = function(self, object) {
    var key, value;
    for (key in object) {
      value = object[key];
      if (__indexOf.call(specialProperties, key) < 0) self[key] = value;
    }
    return object;
  };

  Class.extend = function(object) {
    var extended;
    extended = object.extended;
    delete object.extended;
    this.mixin(this, object);
    if (extended) extended.apply(object);
    return object;
  };

  Class.self = Class.extend;

  Class.include = function(object) {
    var included;
    included = object.included;
    delete object.included;
    if (object.hasOwnProperty("ClassMethods")) this.extend(object.ClassMethods);
    if (object.hasOwnProperty("InstanceMethods")) {
      this.include(object.InstanceMethods);
    }
    this.mixin(this.prototype, object);
    if (included) included.apply(object);
    return object;
  };

  Class.className = function() {
    return _.functionName(this);
  };

  Class.prototype.className = function() {
    return this.constructor.className();
  };

  function Class() {
    this.initialize();
  }

  Class.prototype.initialize = function() {};

  return Class;

})();

module.exports = Tower.Class;
