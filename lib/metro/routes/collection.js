(function() {
  var Collection, exports;
  Collection = (function() {
    function Collection() {}
    Collection.prototype.set = [];
    Collection.prototype.named = {};
    Collection.prototype.draw = function(callback) {
      var mapper;
      mapper = new Metro.Routes.Mapper(this).instance_eval(callback);
      return this;
    };
    Collection.prototype.add = function(route) {
      this.set.push(route);
      if (route.name != null) {
        this.named[route.name] = route;
      }
      return route;
    };
    Collection.prototype.clear = function() {
      this.set = [];
      return this.named = {};
    };
    return Collection;
  })();
  exports = module.exports = Collection;
}).call(this);
