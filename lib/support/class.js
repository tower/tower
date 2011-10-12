var Class, _ref, exports, key, moduleKeywords, value;
var __hasProp = Object.prototype.hasOwnProperty;
moduleKeywords = ['included', 'extended'];
Class = function() {};
Class.include = function(obj) {
  var _i, _len, _ref, included, key, value;
  if (!(obj)) {
    throw new Error('include(obj) requires obj');
  }
  this.extend(obj);
  _ref = obj.prototype;
  for (key in _ref) {
    if (!__hasProp.call(_ref, key)) continue;
    value = _ref[key];
    if (!(function(){ for (var _i=0, _len=moduleKeywords.length; _i<_len; _i++) { if (moduleKeywords[_i] === key) return true; } return false; }).call(this)) {
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
  var _i, _len, _ref, extended, key, value;
  if (!(obj)) {
    throw new Error('extend(obj) requires obj');
  }
  _ref = obj;
  for (key in _ref) {
    if (!__hasProp.call(_ref, key)) continue;
    value = _ref[key];
    if (!(function(){ for (var _i=0, _len=moduleKeywords.length; _i<_len; _i++) { if (moduleKeywords[_i] === key) return true; } return false; }).call(this)) {
      this[key] = value;
    }
  }
  extended = obj.extended;
  if (extended) {
    extended.apply(this);
  }
  return this;
};
_ref = Class;
for (key in _ref) {
  if (!__hasProp.call(_ref, key)) continue;
  value = _ref[key];
  Function.prototype[key] = value;
}
exports = (module.exports = Class);