var __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) { 
    if(typeof parent.__extend == 'function') return parent.__extend(child);
      
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if(typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.HTTP.Param.String = (function(_super) {
  var String;

  function String() {
    return String.__super__.constructor.apply(this, arguments);
  }

  String = __extends(String, _super);

  __defineProperty(String,  "parse", function(value) {
    var arrays, i, node, values, _i, _len,
      _this = this;
    arrays = value.split(/(?:[\s|\+]OR[\s|\+]|\||,)/g);
    for (i = _i = 0, _len = arrays.length; _i < _len; i = ++_i) {
      node = arrays[i];
      values = [];
      node.replace(/([\+\-\^]?[\w@_\s\d\.\$]+|-?\'[\w@-_\s\d\+\.\$]+\')/g, function(_, token) {
        var exact, negation, operators;
        negation = false;
        exact = false;
        token = token.replace(/^(\+?-+)/, function(_, $1) {
          negation = $1 && $1.length > 0;
          return "";
        });
        token = token.replace(/^\'(.+)\'$/, function(_, $1) {
          exact = $1 && $1.length > 0;
          return $1;
        });
        if (negation) {
          operators = [exact ? "$neq" : "$notMatch"];
        } else {
          operators = [exact ? "$eq" : "$match"];
        }
        if (!!token.match(/^\+?\-?\^/)) {
          operators.push("^");
        }
        if (!!token.match(/\$$/)) {
          operators.push("$");
        }
        values.push(_this.parseValue(_this._clean(token), operators));
        return _;
      });
      arrays[i] = values;
    }
    return arrays;
  });

  return String;

})(Tower.HTTP.Param);

module.exports = Tower.HTTP.Param.String;
