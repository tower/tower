(function() {
  var Collection, exports;
  Collection = (function() {
    function Collection() {}
    Collection.prototype.set = [];
    Collection.prototype.named = {};
    Collection.prototype.draw = function(callback) {
      var mapper;
      mapper = new Metro.Route.Mapper(this).instance_eval(callback);
      return this;
    };
    Collection.prototype.add = function(path, conditions, defaults, name) {
      var route;
      route = Metro.Route["new"](path, conditions, defaults, name);
      this.set.push(route);
      if (name != null) {
        this.named[name] = route;
      }
      return route;
    };
    Collection.prototype.clear = function() {
      this.set = [];
      return this.named = {};
    };
    return Collection;
  })();
  exports = module.exports = Router;
}).call(this);
