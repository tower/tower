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

Tower.HTTP.Param.Date = (function(_super) {
  var Date;

  function Date() {
    return Date.__super__.constructor.apply(this, arguments);
  }

  Date = __extends(Date, _super);

  __defineProperty(Date,  "parse", function(value) {
    var array, isRange, string, values, _i, _len,
      _this = this;
    values = [];
    array = value.toString().split(/[\s,\+]/);
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      string = array[_i];
      isRange = false;
      string.replace(/([^\.]+)?(\.\.)([^\.]+)?/, function(_, startsOn, operator, endsOn) {
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

  __defineProperty(Date,  "parseValue", function(value, operators) {
    return Date.__super__[ "parseValue"].call(this, Tower.date(value), operators);
  });

  return Date;

})(Tower.HTTP.Param);

module.exports = Tower.HTTP.Param.Date;
