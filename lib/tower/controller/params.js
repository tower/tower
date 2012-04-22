
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
    cursor: function() {
      var cursor, name, params, parser, parsers;
      if (this._cursor) {
        return this._cursor;
      }
      this._cursor = cursor = new Tower.Model.Cursor;
      parsers = this.constructor.params();
      params = this.params;
      for (name in parsers) {
        parser = parsers[name];
        if (params.hasOwnProperty(name)) {
          cursor.where(parser.toCursor(params[name]));
        }
      }
      return cursor;
    }
  }
};

module.exports = Tower.Controller.Params;
