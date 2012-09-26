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

Tower.NetParamBoolean = (function(_super) {
  var NetParamBoolean;

  function NetParamBoolean() {
    return NetParamBoolean.__super__.constructor.apply(this, arguments);
  }

  NetParamBoolean = __extends(NetParamBoolean, _super);

  __defineProperty(NetParamBoolean,  "parse", function(value) {
    var array, string, values, _i, _len;
    values = [];
    array = value.toString().split(/[,\|]/);
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      string = array[_i];
      if (_.isEmpty(string)) {
        continue;
      }
      string = string.replace(/^\^/, '');
      values.push([this.parseValue(string, ['$eq'])]);
    }
    return values;
  });

  __defineProperty(NetParamBoolean,  "parseValue", function(value, operators) {
    return NetParamBoolean.__super__[ "parseValue"].call(this, !!/^(true|1)$/i.test(value), operators);
  });

  return NetParamBoolean;

})(Tower.NetParam);

module.exports = Tower.NetParamBoolean;
