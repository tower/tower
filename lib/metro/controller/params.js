
  Metro.Controller.Params = {
    ClassMethods: {
      params: function(options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        if (options) {
          this._paramsOptions = Metro.Support.Object.extend(this._paramsOptions || {}, options);
          callback.call(this);
        }
        return this._params || (this._params = {});
      },
      param: function(key, options) {
        if (options == null) options = {};
        this._params || (this._params = {});
        return this._params[key] = Metro.Net.Param.create(key, Metro.Support.Object.extend({}, this._paramsOptions || {}, options));
      }
    },
    criteria: function() {
      var criteria, name, params, parser, parsers;
      if (this._criteria) return this._criteria;
      this._criteria = criteria = new Metro.Model.Criteria;
      parsers = this.constructor.params();
      params = this.params;
      for (name in parsers) {
        parser = parsers[name];
        if (params.hasOwnProperty(name)) {
          criteria.where(parser.toCriteria(params[name]));
        }
      }
      return criteria;
    },
    withParams: function(path, newParams) {
      var params, queryString;
      if (newParams == null) newParams = {};
      params = Metro.Support.Object.extend(this.query, newParams);
      if (Metro.Support.Object.blank(params)) return path;
      queryString = this.queryFor(params);
      return "" + path + "?" + query_string;
    },
    queryFor: function(params) {
      if (params == null) params = {};
    },
    paramOperators: function(key) {}
  };

  module.exports = Metro.Controller.Params;
