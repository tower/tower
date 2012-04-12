var Factory;

Factory = (function() {

  Factory.definitions = {};

  Factory.define = function(name, options, callback) {
    return this.definitions[name] = new Factory(name, options, callback);
  };

  Factory.create = function(name, options) {
    var factory;
    factory = Factory.definitions[name];
    if (!factory) throw new Error("Factory '" + name + "' doesn't exist.");
    return factory.create(options);
  };

  function Factory(name, options, callback) {
    if (options == null) options = {};
    if (this.constructor !== Factory) return Factory.create(name, options);
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    if (typeof callback !== "function") {
      throw new Error("Expected function callback for Factory '" + name + "'");
    }
    this.name = name;
    this.className = _.camelize("_" + (options.className || name));
    this.parentClassName = options.parent;
    this.callback = callback;
  }

  Factory.prototype.toClass = function() {
    var fn, node, parts, _i, _len;
    parts = this.className.split(".");
    fn = typeof window !== "undefined" ? window : exports || this;
    for (_i = 0, _len = parts.length; _i < _len; _i++) {
      node = parts[_i];
      fn = fn[node];
    }
    if (typeof fn !== "function") {
      throw new Error("Class " + string + " not found");
    }
    return fn;
  };

  Factory.prototype.create = function(overrides) {
    var attributes, defaults, key, klass, value;
    if (overrides == null) overrides = {};
    attributes = {};
    defaults = this.callback.call(this) || {};
    for (key in defaults) {
      value = defaults[key];
      attributes[key] = value;
    }
    for (key in overrides) {
      value = overrides[key];
      attributes[key] = value;
    }
    klass = this.toClass();
    return new klass(attributes);
  };

  return Factory;

})();

if (typeof exports !== "undefined" && typeof module !== "undefined") {
  module.exports = Factory;
} else if (typeof window !== "undefined") {
  window.Factory = Factory;
} else {
  this.Factory = Factory;
}
