var __defineStaticProperty = function(clazz, key, value) {
  if(typeof clazz.__defineStaticProperty == 'function') return clazz.__defineStaticProperty(key, value);
  return clazz[key] = value;
},
  __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
};

Tower.Factory = (function() {

  __defineStaticProperty(Factory,  "definitions", {});

  __defineStaticProperty(Factory,  "clear", function() {
    return this.definitions = {};
  });

  __defineStaticProperty(Factory,  "define", function(name, options, callback) {
    return this.definitions[name] = new Tower.Factory(name, options, callback);
  });

  __defineStaticProperty(Factory,  "create", function(name, options, callback) {
    var factory;
    factory = Tower.Factory.definitions[name];
    if (!factory) {
      throw new Error("Factory '" + name + "' doesn't exist.");
    }
    return factory.create(options, callback);
  });

  function Factory(name, options, callback) {
    if (options == null) {
      options = {};
    }
    if (this.constructor !== Tower.Factory) {
      return Tower.Factory.create(name, options);
    }
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    if (typeof callback !== "function") {
      throw new Error("Expected function callback for Factory '" + name + "'");
    }
    this.name = name;
    this.className = Tower.namespaced(Tower.Support.String.camelize(options.className || name));
    this.parentClassName = options.parent;
    this.callback = callback;
  }

  __defineProperty(Factory,  "toClass", function() {
    var fn, node, parts, _i, _len;
    parts = this.className.split(".");
    fn = global;
    for (_i = 0, _len = parts.length; _i < _len; _i++) {
      node = parts[_i];
      fn = fn[node];
    }
    if (typeof fn !== "function") {
      throw new Error("Class " + string + " not found");
    }
    return fn;
  });

  __defineProperty(Factory,  "create", function(overrides, callback) {
    var _this = this;
    if (typeof overrides === "function") {
      callback = overrides;
      overrides = {};
    }
    overrides || (overrides = {});
    return this.createAttributes(overrides, function(error, attributes) {
      var klass, result;
      klass = _this.toClass();
      result = klass.build();
      result.setProperties(attributes);
      if (result.save) {
        result.save(function() {
          if (callback) {
            return callback.call(_this, error, result);
          }
        });
      } else {
        if (callback) {
          callback.call(_this, error, result);
        }
      }
      return result;
    });
  });

  __defineProperty(Factory,  "createAttributes", function(overrides, callback) {
    var _this = this;
    if (this.callback.length) {
      return this.callback.call(this, function(error, attributes) {
        return callback.call(_this, error, _.extend(attributes, overrides));
      });
    } else {
      return callback.call(this, null, _.extend(this.callback.call(this), overrides));
    }
  });

  return Factory;

})();

module.exports = Tower.Factory;
