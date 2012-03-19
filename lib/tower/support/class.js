var Base, specialProperties,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
  __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

specialProperties = ['included', 'extended', 'prototype', 'ClassMethods', 'InstanceMethods'];


Tower.Class = (function(_super) {

  __extends(Class, _super);

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

  Class.alias = function(to, from) {
    return Tower.Support.Object.alias(this.prototype, to, from);
  };

  Class.accessor = function(key, callback) {
    Tower.Support.Object.accessor(this.prototype, key, callback);
    return this;
  };

  Class.getter = function(key, callback) {
    Tower.Support.Object.getter(this.prototype, key, callback);
    return this;
  };

  Class.setter = function(key) {
    Tower.Support.Object.setter(this.prototype, key);
    return this;
  };

  Class.classAlias = function(to, from) {
    Tower.Support.Object.alias(this, to, from);
    return this;
  };

  Class.classAccessor = function(key, callback) {
    Tower.Support.Object.accessor(this, key, callback);
    return this;
  };

  Class.classGetter = function(key, callback) {
    Tower.Support.Object.getter(this, key, callback);
    return this;
  };

  Class.classSetter = function(key) {
    Tower.Support.Object.setter(this, key);
    return this;
  };

  Class.classEval = function(block) {
    return block.call(this);
  };

  Class.delegate = function(key, options) {
    if (options == null) options = {};
    Tower.Support.Object.delegate(this.prototype, key, options);
    return this;
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
    this.mixin(this, object);
    extended = object.extended;
    if (extended) extended.apply(object);
    return object;
  };

  Class.self = function(object) {
    return this.extend(object);
  };

  Class.include = function(object) {
    var included;
    if (object.hasOwnProperty("ClassMethods")) this.extend(object.ClassMethods);
    if (object.hasOwnProperty("InstanceMethods")) {
      this.include(object.InstanceMethods);
    }
    this.mixin(this.prototype, object);
    included = object.included;
    if (included) included.apply(object);
    return object;
  };

  Class.className = function() {
    return Tower.Support.Object.functionName(this);
  };

  Class.prototype.className = function() {
    return this.constructor.className();
  };

  function Class() {
    this.initialize();
  }

  Class.prototype.initialize = function() {};

  return Class;

})(Base);

module.exports = Tower.Class;
