var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Dispatch.Param = (function() {

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
    return new Tower.Dispatch.Param[options.type](key, options);
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
    var attribute, criteria, node, nodes, operator, query, set, _i, _j, _len, _len2;
    nodes = this.parse(value);
    criteria = new Tower.Model.Criteria;
    for (_i = 0, _len = nodes.length; _i < _len; _i++) {
      set = nodes[_i];
      for (_j = 0, _len2 = set.length; _j < _len2; _j++) {
        node = set[_j];
        attribute = node.attribute;
        operator = node.operators[0];
        query = {};
        if (operator === "$eq") {
          query[attribute] = node.value;
        } else {
          query[attribute] = {};
          query[attribute][operator] = node.value;
        }
        criteria.where(query);
      }
    }
    return criteria;
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

Tower.Dispatch.Param.String = (function() {

  __extends(String, Tower.Dispatch.Param);

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

Tower.Dispatch.Param.Date = (function() {

  __extends(Date, Tower.Dispatch.Param);

  function Date() {
    Date.__super__.constructor.apply(this, arguments);
  }

  Date.prototype.parse = function(value) {
    var array, isRange, string, values, _i, _len;
    var _this = this;
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
      if (!isRange) values.push([this.parseValue(string, ["$eq"])]);
    }
    return values;
  };

  Date.prototype.parseValue = function(value, operators) {
    return Date.__super__.parseValue.call(this, Tower.date(value), operators);
  };

  return Date;

})();

Tower.Dispatch.Param.Number = (function() {

  __extends(Number, Tower.Dispatch.Param);

  function Number() {
    Number.__super__.constructor.apply(this, arguments);
  }

  Number.prototype.parse = function(value) {
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

  Number.prototype.parseValue = function(value, operators) {
    return Number.__super__.parseValue.call(this, parseFloat(value), operators);
  };

  return Number;

})();

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

module.exports = Tower.Dispatch.Param;
