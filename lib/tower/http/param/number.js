var __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) { 
    if(typeof parent.__extend == 'function') return parent.__extend();
      
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if(typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.HTTP.Param.Number = (function(_super) {
  var Number;

  function Number() {
    return Number.__super__.constructor.apply(this, arguments);
  }

  Number = __extends(Number, _super);

  __defineProperty(Number,  "parse", function(value) {
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
      if (!isRange) {
        values.push([this.parseValue(string, ["$eq"])]);
      }
    }
    return values;
  });

  __defineProperty(Number,  "parseValue", function(value, operators) {
    return Number.__super__[ "parseValue"].call(this, parseFloat(value), operators);
  });

  return Number;

})(Tower.HTTP.Param);

module.exports = Tower.HTTP.Param.Number;
