var Class, exports, key, moduleKeywords, value;
var __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
}, __slice = Array.prototype.slice;
moduleKeywords = ['included', 'extended'];
Class = (function() {
  function Class() {}
  Class.include = function(obj) {
    var included, key, value, _ref;
    if (!obj) {
      throw new Error('include(obj) requires obj');
    }
    this.extend(obj);
    _ref = obj.prototype;
    for (key in _ref) {
      value = _ref[key];
      if (__indexOf.call(moduleKeywords, key) < 0) {
        this.prototype[key] = value;
      }
    }
    included = obj.included;
    if (included) {
      included.apply(this);
    }
    return this;
  };
  Class.extend = function(obj) {
    var extended, key, value;
    if (!obj) {
      throw new Error('extend(obj) requires obj');
    }
    for (key in obj) {
      value = obj[key];
      if (__indexOf.call(moduleKeywords, key) < 0) {
        this[key] = value;
      }
    }
    extended = obj.extended;
    if (extended) {
      extended.apply(this);
    }
    return this;
  };
  Class["new"] = function() {
    return (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return typeof result === "object" ? result : child;
    })(this, arguments, function() {});
  };
  Class.prototype.instance_exec = function() {
    var _ref;
    return (_ref = arguments[0]).apply.apply(_ref, [this].concat(__slice.call(arguments.slice(1))));
  };
  Class.prototype.instance_eval = function(block) {
    return block.apply(this);
  };
  return Class;
})();
for (key in Class) {
  value = Class[key];
  Function.prototype[key] = value;
}
exports = module.exports = Class;
global.Class = Class;