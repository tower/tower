var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.HTTP.Param.Order = (function() {

  __extends(Order, Tower.HTTP.Param);

  function Order() {
    Order.__super__.constructor.apply(this, arguments);
  }

  Order.prototype.parse = function(value) {
    var array, string, values, _i, _len;
    var _this = this;
    values = [];
    array = value.toString().split(/\s*,/);
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      string = array[_i];
      string.replace(/([\w-]+[^\-\+])([\+\-])?/, function(_, token, operator) {
        var controller, _ref;
        operator = (_ref = operator === "-") != null ? _ref : {
          "-": "+"
        };
        token = _this._clean(token);
        controller = _this.controller;
        return values.push(token, operator);
      });
    }
    return values;
  };

  return Order;

})();

module.exports = Tower.HTTP.Param.Order;
