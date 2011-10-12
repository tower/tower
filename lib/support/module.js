var Module, exports, moduleKeywords;
var __bind = function(func, context) {
    return function(){ return func.apply(context, arguments); };
  };
moduleKeywords = ['included', 'extended'];
Module = function() {
  (typeof this.init === "function" ? this.init.apply(this, arguments) : undefined);
  return this;
};
Module.proxy = function(func) {
  return __bind(function() {
    return func.apply(this, arguments);
  }, this);
};
Module.prototype.proxy = function(func) {
  return __bind(function() {
    return func.apply(this, arguments);
  }, this);
};
exports = (module.exports = Module);