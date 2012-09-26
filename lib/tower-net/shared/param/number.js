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

Tower.NetParamNumber = (function(_super) {
  var NetParamNumber;

  NetParamNumber = __extends(NetParamNumber, _super);

  function NetParamNumber(key, options) {
    var range;
    if (options == null) {
      options = {};
    }
    NetParamNumber.__super__.constructor.call(this, key, options);
    this.allowNegative = options.hasOwnProperty('allowNegative') ? !!options.allowNegative : true;
    this.allowFloat = options.hasOwnProperty('allowFloat') ? !!options.allowFloat : true;
    range = this.allowRange = options.hasOwnProperty('allowRange') ? !!options.allowRange : true;
    if (range) {
      this.parse = this.parseRange;
    }
  }

  __defineProperty(NetParamNumber,  "parse", function(value) {
    var values;
    values = [];
    if (typeof value === 'string') {
      value = parseInt(value);
    }
    if (typeof value === 'number') {
      if (!(!this.allowNegative && value < 0)) {
        values.push([this.parseValue(value, ["$eq"])]);
      }
    }
    return values;
  });

  __defineProperty(NetParamNumber,  "extractValue", function(value) {
    value = this.parse(value)[0];
    if (value != null) {
      value = value[0].value;
    }
    return value;
  });

  __defineProperty(NetParamNumber,  "parseRange", function(value) {
    var array, isRange, negation, string, values, _i, _len,
      _this = this;
    values = [];
    array = value.split(/[,\|]/);
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

  __defineProperty(NetParamNumber,  "parseValue", function(value, operators) {
    return NetParamNumber.__super__[ "parseValue"].call(this, parseFloat(value), operators);
  });

  return NetParamNumber;

})(Tower.NetParam);

module.exports = Tower.NetParamNumber;
