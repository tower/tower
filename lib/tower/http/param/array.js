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

Tower.HTTP.Param.Array = (function(_super) {
  var Array;

  function Array() {
    return Array.__super__.constructor.apply(this, arguments);
  }

  Array = __extends(Array, _super);

  __defineProperty(Array,  "parse", function(value) {
    var array, isSet, negated, negatedSet, operators, set, string, token, tokens, values, _i, _j, _len, _len1;
    values = [];
    array = value.toString().split(/(-?\[[^\]]+\]|-?\w+)/g);
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      string = array[_i];
      negatedSet = false;
      isSet = false;
      if (_.isBlank(string)) {
        continue;
      }
      string = string.replace(/^(-)/, function(_, $1) {
        negatedSet = !!($1 && $1.length > 0);
        return "";
      });
      string = string.replace(/([\[\]])/g, function(_, $1) {
        isSet = !!($1 && $1.length > 0);
        return "";
      });
      if (_.isBlank(string)) {
        continue;
      }
      tokens = string.split(/,/g);
      set = [];
      for (_j = 0, _len1 = tokens.length; _j < _len1; _j++) {
        token = tokens[_j];
        negated = false;
        token = token.replace(/^(-)/, function(_, $1) {
          negated = !!($1 && $1.length > 0);
          return "";
        });
        if (_.isBlank(token)) {
          continue;
        }
        if (isSet) {
          operators = [negated || negatedSet ? '$notInAll' : '$allIn'];
        } else {
          operators = [negated || negatedSet ? '$notInAny' : '$anyIn'];
        }
        set.push(this.parseValue([token], operators));
      }
      values.push(set);
    }
    return values;
  });

  return Array;

})(Tower.HTTP.Param);

module.exports = Tower.HTTP.Param.Array;
