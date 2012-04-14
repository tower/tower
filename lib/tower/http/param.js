var __defineStaticProperty = function(clazz, key, value) {
  if(typeof clazz.__defineStaticProperty == 'function') return clazz.__defineStaticProperty(key, value);
  return clazz[key] = value;
},
  __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
};

Tower.HTTP.Param = (function() {

  __defineStaticProperty(Param,  "perPage", 20);

  __defineStaticProperty(Param,  "sortDirection", "ASC");

  __defineStaticProperty(Param,  "sortKey", "sort");

  __defineStaticProperty(Param,  "limitKey", "limit");

  __defineStaticProperty(Param,  "pageKey", "page");

  __defineStaticProperty(Param,  "separator", "_");

  __defineStaticProperty(Param,  "create", function(key, options) {
    if (options == null) {
      options = {};
    }
    if (typeof options === "string") {
      options = {
        type: options
      };
    }
    options.type || (options.type = "String");
    return new Tower.HTTP.Param[options.type](key, options);
  });

  function Param(key, options) {
    if (options == null) {
      options = {};
    }
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

  __defineProperty(Param,  "parse", function(value) {
    return value;
  });

  __defineProperty(Param,  "render", function(value) {
    return value;
  });

  __defineProperty(Param,  "toCriteria", function(value) {
    var attribute, conditions, criteria, node, nodes, operator, set, _i, _j, _len, _len1;
    nodes = this.parse(value);
    criteria = new Tower.Model.Criteria;
    for (_i = 0, _len = nodes.length; _i < _len; _i++) {
      set = nodes[_i];
      for (_j = 0, _len1 = set.length; _j < _len1; _j++) {
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
  });

  __defineProperty(Param,  "parseValue", function(value, operators) {
    return {
      namespace: this.namespace,
      key: this.key,
      operators: operators,
      value: value,
      attribute: this.attribute
    };
  });

  __defineProperty(Param,  "_clean", function(string) {
    return string.replace(/^-/, "").replace(/^\+-/, "").replace(/^'|'$/, "").replace("+", " ").replace(/^\^/, "").replace(/\$$/, "").replace(/^\s+|\s+$/, "");
  });

  return Param;

})();

require('./param/array');

require('./param/date');

require('./param/number');

require('./param/string');

module.exports = Tower.HTTP.Param;
