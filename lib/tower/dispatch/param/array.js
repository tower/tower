var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Dispatch.Param.Array = (function() {

  __extends(Array, Tower.Dispatch.Param);

  function Array() {
    Array.__super__.constructor.apply(this, arguments);
  }

  Array.prototype.parse = function(value) {
    var array, isRange, negation, string, values, _i, _len;
    var _this = this;
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

  return Array;

})();

module.exports = Tower.Dispatch.Param.Array;
