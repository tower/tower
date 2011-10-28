(function() {
  var String, _;
  _ = require("underscore");
  _.mixin(require("underscore.string"));
  String = (function() {
    function String() {}
    String.camelize = function() {
      return _.camelize("_" + (arguments[0] || this));
    };
    String.constantize = function() {
      return global[this.camelize.apply(this, arguments)];
    };
    String.underscore = function() {
      return _.underscored(arguments[0] || this);
    };
    String.titleize = function() {
      return _.titleize(arguments[0] || this);
    };
    return String;
  })();
  module.exports = String;
}).call(this);
