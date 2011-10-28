(function() {
  var Object, _;
  _ = require('underscore');
  Object = (function() {
    function Object() {}
    Object.isA = function(object, isa) {};
    Object.isHash = function() {
      var object;
      object = arguments[0] || this;
      return _.isObject(object) && !(_.isFunction(object) || _.isArray(object));
    };
    return Object;
  })();
  module.exports = Object;
}).call(this);
