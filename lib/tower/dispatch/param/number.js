var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Dispatch.Param.Number = (function(_super) {

  __extends(Number, _super);

  function Number() {
    Number.__super__.constructor.apply(this, arguments);
  }

  Number.prototype.parse = function(value) {
    var array, isRange, negation, string, values, _i, _len,
      _this = this;
    values = [];
    array = value.toString().split(/[,\|]/);
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      string = array[_i];
      isRange = false;
      negation = !!string.match(/^\^/);
      string = string.replace(/^\^/, "");
      string.replace(/([^\.]+)?(\.{2})([^\.]+)?/, function(_, startsOn, operator, endsOn) {
        var range;
        isRange = true;
        range = [];
        if (!!(startsOn && startsOn.match(/^\d/))) {
          range.push(_this.parseValue(startsOn, ["$gte"]));
        }
        if (!!(endsOn && endsOn.match(/^\d/))) {
          range.push(_this.parseValue(endsOn, ["$lte"]));
        }
        return values.push(range);
      });
      if (!isRange) values.push([this.parseValue(string, ["$eq"])]);
    }
    return values;
  };

  Number.prototype.parseValue = function(value, operators) {
    return Number.__super__.parseValue.call(this, parseFloat(value), operators);
  };

  return Number;

})(Tower.Dispatch.Param);

module.exports = Tower.Dispatch.Param.Number;
