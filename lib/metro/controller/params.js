
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
    scopedParams: function() {
      var params;
      if (this._scopedParams) return this._scopedParams;
      this._scopedParams = {};
      return params = this.constructor.params();
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
