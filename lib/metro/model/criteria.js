
  Metro.Model.Criteria = (function() {

    function Criteria(query, options) {
      if (query == null) query = {};
      if (options == null) options = {};
      this.query = query;
      this.options = options;
    }

    Criteria.prototype.merge = function(conditions) {
      if (conditions == null) conditions = {};
      return Metro.Support.Object.extend(this.query, conditions);
    };

    Criteria.prototype.where = function(conditions) {
      return this.merge(conditions);
    };

    Criteria.prototype.order = function() {
      this.conditions.push(["order", arguments]);
      return this;
    };

    Criteria.prototype.limit = function() {
      this.conditions.push(["limit", arguments]);
      return this;
    };

    Criteria.prototype.select = function() {
      this.conditions.push(["select", arguments]);
      return this;
    };

    Criteria.prototype.joins = function() {
      this.conditions.push(["joins", arguments]);
      return this;
    };

    Criteria.prototype.includes = function() {
      this.conditions.push(["includes", arguments]);
      return this;
    };

    Criteria.prototype.paginate = function() {
      this.conditions.push(["paginate", arguments]);
      return this;
    };

    Criteria.prototype.within = function() {
      this.conditions.push(["within", arguments]);
      return this;
    };

    Criteria.prototype.clone = function() {
      var clonedOptions, clonedQuery;
      clonedQuery = {};
      clonedOptions = {};
      return new this(clonedQuery, clonedOptions);
    };

    return Criteria;

  })();

  module.exports = Metro.Model.Criteria;
