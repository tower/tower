(function() {

  Tower.Controller.Params = {
    ClassMethods: {
      param: function(key, options) {
        return this.params()[key] = Tower.HTTP.Param.create(key, options);
      },
      params: function() {
        var arg, key, value, _i, _len;
        if (arguments.length) {
          for (_i = 0, _len = arguments.length; _i < _len; _i++) {
            arg = arguments[_i];
            if (typeof arg === "object") {
              for (key in arg) {
                value = arg[key];
                this.param(key, value);
              }
            } else {
              this.param(arg);
            }
          }
        }
        return this.metadata().params;
      }
    },
    InstanceMethods: {
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
    }
  };

  module.exports = Tower.Controller.Params;

}).call(this);
