var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.HTTP.Param = (function() {

  Param.perPage = 20;

  Param.sortDirection = "ASC";

  Param.sortKey = "sort";

  Param.limitKey = "limit";

  Param.pageKey = "page";

  Param.separator = "_";

  Param.operators = {
    gte: ":value..t",
    gt: ":value...t",
    lte: "t..:value",
    lte: "t...:value",
    rangeInclusive: ":i..:f",
    rangeExclusive: ":i...:f",
    "in": [",", "+OR+"],
    nin: "-",
    all: "[:value]",
    nil: "[-]",
    notNil: "[+]",
    asc: ["+", ""],
    desc: "-",
    geo: ":lat,:lng,:radius"
  };

  Param.create = function(key, options) {
    options.type || (options.type = "String");
    return new Tower.HTTP.Param[options.type](key, options);
  };

  function Param(key, options) {
    if (options == null) options = {};
    this.controller = options.controller;
    this.key = key;
    this.attribute = options.as || this.key;
    this.modelName = options.modelName;
    if (typeof modelName !== "undefined" && modelName !== null) {
      this.namespace = Tower.Support.String.pluralize(this.modelName);
    }
    this.exact = options.exact || false;
    this["default"] = options["default"];
  }

  Param.prototype.parse = function(value) {
    return value;
  };

  Param.prototype.render = function(value) {
    return value;
  };

  Param.prototype.toCriteria = function(value) {
    var result;
    return result = this.parse(value);
  };

  Param.prototype.parseValue = function(value, operators) {
    return {
      namespace: this.namespace,
      key: this.key,
      operators: operators,
      value: value,
      attribute: this.attribute
    };
  };

  Param.prototype._clean = function(string) {
    return string.replace(/^-/, "").replace(/^\+-/, "").replace(/^'|'$/, "").replace("+", " ").replace(/^\^/, "").replace(/\$$/, "").replace(/^\s+|\s+$/, "");
  };

  return Param;

})();

Tower.HTTP.Param.String = (function() {

  __extends(String, Tower.HTTP.Param);

  function String() {
    String.__super__.constructor.apply(this, arguments);
  }

  String.prototype.parse = function(value) {
    var arrays, i, node, values, _len;
    var _this = this;
    arrays = value.split(/(?:[\s|\+]OR[\s|\+]|\||,)/);
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
          operators = [exact ? "!=" : "!~"];
        } else {
          operators = [exact ? "=" : "=~"];
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

  String.prototype.toCriteria = function(value) {
    var node, nodes, result, _i, _len, _name;
    nodes = String.__super__.toCriteria.call(this, value)[0];
    result = {};
    for (_i = 0, _len = nodes.length; _i < _len; _i++) {
      node = nodes[_i];
      result[_name = node.attribute] || (result[_name] = {});
      result[node.attribute][node.operators[0]] = node.value;
    }
    return result;
  };

  return String;

})();

module.exports = Tower.HTTP.Param;
