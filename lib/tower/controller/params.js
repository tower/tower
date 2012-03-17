
Tower.Controller.Params = {
  ClassMethods: {
    params: function(options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      if (options) {
        this._paramsOptions = Tower.Support.Object.extend(this._paramsOptions || {}, options);
        if (callback) callback.call(this);
      }
      return this._params || (this._params = {});
    },
    param: function(key, options) {
      if (options == null) options = {};
      this._params || (this._params = {});
      return this._params[key] = Tower.HTTP.Param.create(key, Tower.Support.Object.extend({}, this._paramsOptions || {}, options));
    }
  },
  criteria: function() {
    var criteria, name, params, parser, parsers;
    if (this._criteria) return this._criteria;
    this._criteria = criteria = new Tower.Model.Criteria;
    parsers = this.constructor.params();
    params = this.params;
    for (name in parsers) {
      parser = parsers[name];
      if (params.hasOwnProperty(name)) {
        criteria.where(parser.toCriteria(params[name]));
      }
    }
    return criteria;
  }
};

module.exports = Tower.Controller.Params;
