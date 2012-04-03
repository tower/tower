
Tower.Controller.Params = {
  ClassMethods: {
    param: function(key, options) {
      if (options == null) options = {};
      return this.params()[key] = Tower.HTTP.Param.create(key, options);
    },
    params: function() {
      return this._params || (this._params = {});
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
