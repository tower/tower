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

Tower.NetParamString = (function(_super) {
  var NetParamString;

  NetParamString = __extends(NetParamString, _super);

  function NetParamString(key, options) {
    if (options == null) {
      options = {};
    }
    NetParamString.__super__.constructor.call(this, key, options);
    this.exact = options.exact === true;
  }

  __defineProperty(NetParamString,  "parse", function(value) {
    var arrays, i, node, values, _i, _len,
      _this = this;
    if (this.exact) {
      return [[this.parseValue(value, ['$eq'])]];
    }
    value = value.trim();
    arrays = null;
    value.replace(/^\/([^\/]+)\/(gi)?$/, function(_, $1) {
      return arrays = [[_this.parseValue([_this._clean($1)], ['$regex'])]];
    });
    if (arrays) {
      return arrays;
    }
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
        values.push(_this.parseValue([_this._clean(token)], operators));
        return _;
      });
      arrays[i] = values;
    }
    return arrays;
  });

  return NetParamString;

})(Tower.NetParam);

module.exports = Tower.NetParamString;
