var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.HTTP.Param.String = (function() {

  __extends(String, Tower.HTTP.Param);

  function String() {
    String.__super__.constructor.apply(this, arguments);
  }

  String.prototype.parse = function(value) {
    var arrays, i, node, values, _len;
    var _this = this;
    arrays = value.split(/(?:[\s|\+]OR[\s|\+]|\||,)/g);
    for (i = 0, _len = arrays.length; i < _len; i++) {
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
        if (!!token.match(/^\+?\-?\^/)) operators.push("^");
        if (!!token.match(/\$$/)) operators.push("$");
        values.push(_this.parseValue(_this._clean(token), operators));
        return _;
      });
      arrays[i] = values;
    }
    return arrays;
  };

  return String;

})();

module.exports = Tower.HTTP.Param.String;
