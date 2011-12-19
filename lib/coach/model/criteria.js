
  Coach.Model.Criteria = (function() {

    function Criteria(query, options) {
      if (query == null) query = {};
      if (options == null) options = {};
      this.query = query;
      this.options = options;
    }

    Criteria.prototype._mergeQuery = function(conditions) {
      if (conditions == null) conditions = {};
      return Coach.Support.Object.extend(this.query, conditions);
    };

    Criteria.prototype._mergeOptions = function(options) {
      if (options == null) options = {};
      return Coach.Support.Object.extend(this.options, options);
    };

    Criteria.prototype.where = function(conditions) {
      return this._mergeQuery(conditions);
    };

    Criteria.prototype.order = function(attribute, direction) {
      if (direction == null) direction = "asc";
      return this._mergeOptions({
        sort: [attribute, direction]
      });
    };

    Criteria.prototype.offset = function(number) {
      return this._mergeOptions({
        offset: number
      });
    };

    Criteria.prototype.limit = function(number) {
      return this._mergeOptions({
        limit: number
      });
    };

    Criteria.prototype.select = function() {
      return this._mergeOptions({
        fields: Coach.Support.Array.args(arguments)
      });
    };

    Criteria.prototype.joins = function() {
      return this._mergeOptions({
        joins: Coach.Support.Array.args(arguments)
      });
    };

    Criteria.prototype.includes = function() {
      return this._mergeOptions({
        includes: Coach.Support.Array.args(arguments)
      });
    };

    Criteria.prototype.paginate = function(options) {
      var limit, page;
      limit = options.perPage || options.limit;
      page = options.page || 0;
      this.limit(limit);
      return this.offset(page * limit);
    };

    Criteria.prototype.within = function(options) {
      return this;
    };

    Criteria.prototype.clone = function() {
      return new this(Coach.Support.Object.cloneHash(this.query), Coach.Support.Object.cloneHash(this.options));
    };

    return Criteria;

  })();

  module.exports = Coach.Model.Criteria;
