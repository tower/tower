
Tower.HTTP.Param = (function() {

  Param.perPage = 20;

  Param.sortDirection = "ASC";

  Param.sortKey = "sort";

  Param.limitKey = "limit";

  Param.pageKey = "page";

  Param.separator = "_";

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
    var attribute, conditions, criteria, node, nodes, operator, set, _i, _j, _len, _len2;
    nodes = this.parse(value);
    criteria = new Tower.Model.Criteria;
    for (_i = 0, _len = nodes.length; _i < _len; _i++) {
      set = nodes[_i];
      for (_j = 0, _len2 = set.length; _j < _len2; _j++) {
        node = set[_j];
        attribute = node.attribute;
        operator = node.operators[0];
        conditions = {};
        if (operator === "$eq") {
          conditions[attribute] = node.value;
        } else {
          conditions[attribute] = {};
          conditions[attribute][operator] = node.value;
        }
        criteria.where(conditions);
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

require('./param/array');

require('./param/date');

require('./param/number');

require('./param/string');

module.exports = Tower.HTTP.Param;
