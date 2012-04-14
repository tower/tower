var specialProperties,
  __defineStaticProperty = function(clazz, key, value) {
  if(typeof clazz.__defineStaticProperty == 'function') return clazz.__defineStaticProperty(key, value);
  return clazz[key] = value;
},
  __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

specialProperties = ['included', 'extended', 'prototype', 'ClassMethods', 'InstanceMethods'];

Tower.Class = (function() {

  __defineStaticProperty(Class,  "mixin", function(self, object) {
    var key, value;
    for (key in object) {
      value = object[key];
      if (__indexOf.call(specialProperties, key) < 0) {
        self[key] = value;
      }
    }
    return object;
  });

  __defineStaticProperty(Class,  "extend", function(object) {
    var extended;
    extended = object.extended;
    delete object.extended;
    this.mixin(this, object);
    if (extended) {
      extended.apply(object);
    }
    return object;
  });

  __defineStaticProperty(Class,  "self", Class.extend);

  __defineStaticProperty(Class,  "include", function(object) {
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
  });

  __defineStaticProperty(Class,  "className", function() {
    return _.functionName(this);
  });

  __defineProperty(Class,  "className", function() {
    return this.constructor.className();
  });

  function Class() {
    this.initialize();
  }

  __defineProperty(Class,  "initialize", function() {});

  return Class;

})();

module.exports = Tower.Class;
