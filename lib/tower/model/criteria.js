var __slice = Array.prototype.slice;

Tower.Model.Criteria = (function() {

  function Criteria(args) {
    if (args == null) args = {};
    args.where || (args.where = []);
    args.joins || (args.joins = {});
    args.order || (args.order = []);
    args.data || (args.data = []);
    args.options || (args.options = {});
    if (!args.options.hasOwnProperty("instantiate")) {
      args.options.instantiate = true;
    }
    this.values = args;
  }

  Criteria.prototype["export"] = function(result) {
    if (!this.values.returnArray) result = result[0];
    delete this.values.data;
    delete this.values.returnArray;
    return result;
  };

  Criteria.prototype.addData = function(args) {
    if (args.length > 1 || _.isArray(args[0])) {
      this.values.data = _.flatten(args);
      return this.values.returnArray = true;
    } else {
      this.values.data = args[0] != null ? [args[0]] : [];
      return this.values.returnArray = false;
    }
  };

  Criteria.prototype.options = function(options) {
    return this.values.options = _.extend(this.values.options, options);
  };

  Criteria.prototype.joins = function(object) {
    var joins, key, _i, _len;
    joins = this.values.joins;
    if (_.isArray(object)) {
      for (_i = 0, _len = object.length; _i < _len; _i++) {
        key = object[_i];
        joins[key] = true;
      }
    } else if (typeof object === "string") {
      joins[object] = true;
    } else {
      _.extend(joins, object);
    }
    return joins;
  };

  Criteria.prototype.except = function() {
    var keys;
    keys = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this.values.except = keys;
  };

  Criteria.prototype.where = function(conditions) {
    if (conditions instanceof Tower.Model.Criteria) {
      return this.merge(conditions);
    } else {
      return this.values.where.push(conditions);
    }
  };

  Criteria.prototype.order = function(attribute, direction) {
    var _base;
    if (direction == null) direction = "asc";
    (_base = this.values).order || (_base.order = []);
    return this.values.order.push([attribute, direction]);
  };

  Criteria.prototype.sort = Criteria.prototype.order;

  Criteria.prototype.defaultSort = function(direction) {
    return this;
  };

  Criteria.prototype.asc = function() {
    var attribute, attributes, _i, _len;
    attributes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    for (_i = 0, _len = attributes.length; _i < _len; _i++) {
      attribute = attributes[_i];
      this.order(attribute);
    }
    return this.values.order;
  };

  Criteria.prototype.desc = function() {
    var attribute, attributes, _i, _len, _results;
    attributes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    _results = [];
    for (_i = 0, _len = attributes.length; _i < _len; _i++) {
      attribute = attributes[_i];
      _results.push(this.order(attribute, "desc"));
    }
    return _results;
  };

  Criteria.prototype.allIn = function(attributes) {
    return this.values.whereOperator("$all", attributes);
  };

  Criteria.prototype.anyIn = function(attributes) {
    return this.values.whereOperator("$any", attributes);
  };

  Criteria.prototype.notIn = function(attributes) {
    return this.values.whereOperator("$nin", attributes);
  };

  Criteria.prototype.offset = function(number) {
    return this.values.offset = number;
  };

  Criteria.prototype.limit = function(number) {
    return this.values.limit = number;
  };

  Criteria.prototype.select = function() {
    var fields;
    fields = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this.values.fields = fields;
  };

  Criteria.prototype.includes = function() {
    return this.values.includes = _.args(arguments);
  };

  Criteria.prototype.uniq = function(value) {
    return this.values.uniq = value;
  };

  Criteria.prototype.page = function(page) {
    return this.offset((page - 1) * this.values.limit || 20);
  };

  Criteria.prototype.paginate = function(options) {
    var limit, page;
    limit = options.perPage || options.limit;
    page = options.page || 1;
    this.limit(limit);
    return this.offset((page - 1) * limit);
  };

  Criteria.prototype.clone = function() {
    return new this.constructor(this.attributes());
  };

  Criteria.prototype.merge = function(criteria) {
    var attributes, values;
    attributes = criteria.attributes();
    values = this.values;
    if (attributes._where.length > 0) {
      values.where = values.where.concat(attributes._where);
    }
    if (attributes._order.length > 0) {
      values.order = values.order.concat(attributes._order);
    }
    if (attributes._offset != null) values.offset = attributes._offset;
    if (attributes._limit != null) values.limit = attributes._limit;
    if (attributes._fields) values.fields = attributes._fields;
    if (attributes._offset != null) values.offset = attributes._offset;
    if (attributes._joins != null) values.joins = attributes._joins;
    if (attributes._through != null) values.through = attributes._through;
    return this;
  };

  Criteria.prototype.conditions = function() {
    var conditions, result, _i, _len, _ref;
    result = {};
    _ref = this.values.where;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      conditions = _ref[_i];
      _.deepMergeWithArrays(result, conditions);
    }
    return result;
  };

  Criteria.prototype.attributes = function(to) {
    var values;
    if (to == null) to = {};
    values = this.values;
    to.where = values.where.concat();
    to.order = values.order.concat();
    if (values.offset != null) to.offset = values.offset;
    if (values.limit != null) to.limit = values.limit;
    if (values.fields) to.fields = values.fields;
    if (values.includes) to.includes = values.includes;
    if (values.joins != null) to.joins = values.joins;
    if (values.through != null) to.through = values.through;
    return to;
  };

  Criteria.prototype.build = function() {
    var attributes, conditions, key, value, _i, _key, _len, _ref, _value;
    attributes = {};
    _ref = this.values.where;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      conditions = _ref[_i];
      for (key in conditions) {
        value = conditions[key];
        if (Tower.Store.isKeyword(key)) {
          for (_key in value) {
            _value = value[_key];
            attributes[_key] = _value;
          }
        } else if (_.isHash(value) && value.constructor.name === "Object" && Tower.Store.hasKeyword(value)) {
          for (_key in value) {
            _value = value[_key];
            attributes[key] = _value;
          }
        } else {
          attributes[key] = value;
        }
      }
    }
    for (key in attributes) {
      value = attributes[key];
      if (value === void 0) delete attributes[key];
    }
    return attributes;
  };

  Criteria.prototype._whereOperator = function(operator, attributes) {
    var key, query, value;
    query = {};
    for (key in attributes) {
      value = attributes[key];
      query[key] = {};
      query[key][operator] = value;
    }
    return this.where(query);
  };

  return Criteria;

})();

module.exports = Tower.Model.Criteria;
