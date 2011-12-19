
  Coach.Controller.Callbacks = {
    ClassMethods: {
      filters: function() {
        return this._filters || (this._filters = {
          before: [],
          after: []
        });
      },
      beforeFilter: function() {
        var args;
        args = Coach.Support.Array.args(arguments);
        this.filters().before.push({
          method: args.shift(),
          options: args.shift()
        });
        return this;
      },
      afterFilter: function() {}
    },
    runFilters: function(block, callback) {
      var afterFilters, beforeFilters, iterator, self;
      self = this;
      beforeFilters = this.constructor.filters().before;
      afterFilters = this.constructor.filters().after;
      iterator = function(filter, next) {
        var method, result;
        method = filter.method;
        if (typeof method === "string") {
          if (!self[method]) {
            throw new Error("Method '" + method + "' not defined on " + self.constructor.name);
          }
          method = self[method];
        }
        switch (method.length) {
          case 0:
            result = method.call(self);
            if (!result) return next(new Error("did not pass filter"));
            return next();
          default:
            return method.call(self, function(error, result) {
              if (error) return next(error);
              if (!result) return next(new Error("did not pass filter"));
              return next();
            });
        }
      };
      return require('async').forEachSeries(beforeFilters, iterator, function(error) {
        if (error) return callback(error);
        return block.call(self);
      });
    }
  };

  module.exports = Coach.Controller.Callbacks;
