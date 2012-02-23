var __slice = Array.prototype.slice;

Tower.Model.Criteria = (function() {

  function Criteria(args) {
    var key, value;
    if (args == null) args = {};
    for (key in args) {
      value = args[key];
      this[key] = value;
    }
    this._where || (this._where = []);
    this._order || (this._order = []);
  }

  Criteria.prototype.where = function(conditions) {
    if (conditions instanceof Tower.Model.Criteria) {
      return this.merge(conditions);
    } else {
      return this._where.push(conditions);
    }
  };

  Criteria.prototype.order = function(attribute, direction) {
    if (direction == null) direction = "asc";
    this._order || (this._order = []);
    return this._order.push([attribute, direction]);
  };

  Criteria.prototype.asc = function() {
    var attribute, attributes, _i, _len, _results;
    attributes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    _results = [];
    for (_i = 0, _len = attributes.length; _i < _len; _i++) {
      attribute = attributes[_i];
      _results.push(this.order(attribute));
    }
    return _results;
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
    return this._whereOperator("$all", attributes);
  };

  Criteria.prototype.anyIn = function(attributes) {
    return this._whereOperator("$any", attributes);
  };

  Criteria.prototype.notIn = function(attributes) {
    return this._whereOperator("$nin", attributes);
  };

  Criteria.prototype.offset = function(number) {
    return this._offset = number;
  };

  Criteria.prototype.limit = function(number) {
    this._limit = number;
    return this.mergeOptions({
      limit: number
    });
  };

  Criteria.prototype.select = function() {
    return this._fields = Tower.Support.Array.args(arguments);
  };

  Criteria.prototype.includes = function() {
    return this._includes = Tower.Support.Array.args(arguments);
  };

  Criteria.prototype.page = function(number) {
    return this.offset(number);
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
    var attributes;
    attributes = criteria.attributes();
    if (attributes._where.length > 0) {
      this._where = this._where.concat(attributes._where);
    }
    if (attributes._order.length > 0) {
      this._order = this._order.concat(attributes._order);
    }
    if (attributes._offset != null) this._offset = attributes._offset;
    if (attributes._limit != null) this._limit = attributes._limit;
    if (attributes._fields) this._fields = attributes._fields;
    if (attributes._offset != null) this._offset = attributes._offset;
    return this;
  };

  Criteria.prototype.options = function() {
    var options;
    options = {};
    if (this._offset != null) options.offset = this._offset;
    if (this._limit != null) options.limit = this._limit;
    if (this._fields) options.fields = this._fields;
    if (this._order.length > 0) options.sort = this._order;
    return options;
  };

  Criteria.prototype.conditions = function() {
    var conditions, result, _i, _len, _ref;
    result = {};
    _ref = this._where;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      conditions = _ref[_i];
      Tower.Support.Object.deepMergeWithArrays(result, conditions);
    }
    return result;
  };

  Criteria.prototype.attributes = function(to) {
    if (to == null) to = {};
    to._where = this._where.concat();
    to._order = this._order.concat();
    if (this._offset != null) to._offset = this._offset;
    if (this._limit != null) to._limit = this._limit;
    if (this._fields) to._fields = this._fields;
    if (this._includes) to._includes = this._includes;
    return to;
  };

  Criteria.prototype.toQuery = function() {
    return {
      conditions: this.conditions(),
      options: this.options()
    };
  };

  Criteria.prototype.toUpdate = function() {
    return this.toQuery();
  };

  Criteria.prototype.toCreate = function() {
    var attributes, conditions, key, options, value, _i, _key, _len, _ref, _value;
    attributes = {};
    options = {};
    _ref = this._where;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      conditions = _ref[_i];
      for (key in conditions) {
        value = conditions[key];
        if (Tower.Store.isKeyword(key)) {
          for (_key in value) {
            _value = value[_key];
            attributes[_key] = _value;
          }
        } else if (Tower.Support.Object.isHash(value) && Tower.Store.hasKeyword(value)) {
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
    return {
      attributes: attributes,
      options: options
    };
  };

  Criteria.prototype.mergeOptions = function(options) {
    return options;
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
