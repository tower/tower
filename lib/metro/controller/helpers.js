
  Metro.Controller.Helpers = {
    ClassMethods: {
      helper: function(object) {
        this._helpers || (this._helpers = []);
        return this._helpers.push(object);
      },
      urlHelpers: function() {
        var result, route, routes, _i, _len;
        routes = Metro.Route.all();
        result = {};
        for (_i = 0, _len = routes.length; _i < _len; _i++) {
          route = routes[_i];
          if (!route.name) continue;
          result[route.name + "Path"] = function() {
            return route.urlFor.apply(route, arguments);
          };
        }
        return result;
      }
    },
    urlFor: function() {}
  };

  module.exports = Metro.Controller.Helpers;
