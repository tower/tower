var __defineStaticProperty = function(clazz, key, value) {
  if (typeof clazz.__defineStaticProperty == 'function') return clazz.__defineStaticProperty(key, value);
  return clazz[key] = value;
},
  __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
};

Tower.NetParam = (function() {

  __defineStaticProperty(NetParam,  "perPage", 20);

  __defineStaticProperty(NetParam,  "sortDirection", 'ASC');

  __defineStaticProperty(NetParam,  "sortKey", 'sort');

  __defineStaticProperty(NetParam,  "limitKey", 'limit');

  __defineStaticProperty(NetParam,  "pageKey", 'page');

  __defineStaticProperty(NetParam,  "separator", '-');

  __defineStaticProperty(NetParam,  "create", function(key, options) {
    var field, klass, type;
    if (options == null) {
      options = {};
    }
    if (typeof options === 'string') {
      options = {
        type: options
      };
    }
    options.as || (options.as = key);
    if (!options.type && (type = options.resourceType)) {
      field = Tower.constant(type).fields()[options.as];
      options.type = field.type;
    }
    options.type || (options.type = 'String');
    klass = Tower['NetParam' + options.type];
    if (!klass) {
      options.type = 'String';
      klass = Tower.NetParamString;
    }
    return new klass(key, options);
  });

  function NetParam(key, options) {
    if (options == null) {
      options = {};
    }
    this.controller = options.controller;
    this.key = key;
    this.attribute = options.as;
    this.modelName = options.modelName;
    if (typeof modelName !== "undefined" && modelName !== null) {
      this.namespace = _.pluralize(this.modelName);
    }
    this.exact = options.exact || false;
    this["default"] = options["default"];
  }

  __defineProperty(NetParam,  "parse", function(value) {
    return value;
  });

  __defineProperty(NetParam,  "render", function(value) {
    return value;
  });

  __defineProperty(NetParam,  "toCursor", function(value) {
    var attribute, conditions, criteria, node, nodes, operator, set, _i, _j, _len, _len1;
    nodes = this.parse(value);
    criteria = Tower.ModelCursor.create();
    criteria.make();
    for (_i = 0, _len = nodes.length; _i < _len; _i++) {
      set = nodes[_i];
      for (_j = 0, _len1 = set.length; _j < _len1; _j++) {
        node = set[_j];
        attribute = node.attribute;
        operator = node.operators[0];
        conditions = {};
        if (operator === '$eq') {
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

  __defineProperty(NetParam,  "parseValue", function(value, operators) {
    return {
      namespace: this.namespace,
      key: this.key,
      operators: operators,
      value: value,
      attribute: this.attribute
    };
  });

  __defineProperty(NetParam,  "_clean", function(string) {
    return string.replace(/^-/, '').replace(/^\+-/, '').replace(/^'|'$/, '').replace('+', ' ').replace(/^\^/, '').replace(/\$$/, '').replace(/^\s+|\s+$/, '');
  });

  return NetParam;

})();

require('./param/array');

require('./param/boolean');

require('./param/date');

require('./param/number');

require('./param/order');

require('./param/string');

module.exports = Tower.NetParam;
