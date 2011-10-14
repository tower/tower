(function() {
  var Mapper, exports;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Mapper = (function() {
    __extends(Mapper, Class);
    function Mapper(collection) {
      this.collection = collection;
    }
    Mapper.prototype.match = function() {
      var options, path;
      path = arguments[0];
      options = arguments[arguments.length - 1];
      return this.collection.add(path, options);
    };
    return Mapper;
  })();
  exports = module.exports = Mapper;
}).call(this);
