var __slice = Array.prototype.slice;

Tower.Model.Criteria = (function() {

  function Criteria(query, options) {
    if (query == null) query = {};
    if (options == null) options = {};
    this.query = query;
    this.options = options;
  }

  Criteria.prototype.where = function(conditions) {
    return this.mergeQuery(conditions);
  };

  Criteria.prototype.order = function(attribute, direction) {
    if (direction == null) direction = "asc";
    return this.mergeOptions({
      sort: [[attribute, direction]]
    });
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
    return this.mergeOptions({
      offset: number
    });
  };

  Criteria.prototype.limit = function(number) {
    return this.mergeOptions({
      limit: number
    });
  };

  Criteria.prototype.select = function() {
    return this.mergeOptions({
      fields: Tower.Support.Array.args(arguments)
    });
  };

  Criteria.prototype.joins = function() {
    return this.mergeOptions({
      joins: Tower.Support.Array.args(arguments)
    });
  };

  Criteria.prototype.includes = function() {
    return this.mergeOptions({
      includes: Tower.Support.Array.args(arguments)
    });
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

  Criteria.prototype.within = function(options) {
    return this;
  };

  Criteria.prototype.clone = function() {
    return new this.constructor(Tower.Support.Object.cloneHash(this.query), Tower.Support.Object.cloneHash(this.options));
  };

  Criteria.prototype.merge = function(criteria) {
    this.mergeQuery(criteria.query);
    return this.mergeOptions(criteria.options);
  };

  Criteria.prototype.mergeQuery = function(conditions) {
    if (conditions == null) conditions = {};
    return Tower.Support.Object.deepMergeWithArrays(this.query, conditions);
  };

  Criteria.prototype.mergeOptions = function(options) {
    if (options == null) options = {};
    return Tower.Support.Object.deepMergeWithArrays(this.options, options);
  };

  Criteria.prototype.mergeUpdates = function() {};

  Criteria.prototype.mergeAttributes = function() {};

  Criteria.prototype.toUpdate = function() {};

  Criteria.prototype.toCreate = function() {};

  Criteria.prototype.toFind = function() {
    return this.query;
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
