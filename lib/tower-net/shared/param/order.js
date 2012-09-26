var __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) {
    if (typeof parent.__extend == 'function') return parent.__extend(child);
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if (typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.NetParamOrder = (function(_super) {
  var NetParamOrder;

  function NetParamOrder() {
    return NetParamOrder.__super__.constructor.apply(this, arguments);
  }

  NetParamOrder = __extends(NetParamOrder, _super);

  __defineProperty(NetParamOrder,  "parse", function(value) {
    var array, string, values, _i, _len,
      _this = this;
    if (_.isArray(value)) {
      return value;
    }
    values = [];
    array = value.toString().split(/\s*,/);
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      string = array[_i];
      string.replace(/([\w-]+[^\-\+])([\+\-])?/, function(_, token, operator) {
        var controller;
        operator = operator === "-" ? "DESC" : "ASC";
        token = _this._clean(token);
        controller = _this.controller;
        return values.push(token, operator);
      });
    }
    return values;
  });

  return NetParamOrder;

})(Tower.NetParam);

module.exports = Tower.NetParamOrder;
