(function() {
  var lingo, _;
  _ = require("underscore");
  _.mixin(require("underscore.string"));
  lingo = require("lingo").en;
  Metro.Support.String = {
    camelize: function() {
      return _.camelize("_" + (arguments[0] || this));
    },
    constantize: function() {
      return global[this.camelize.apply(this, arguments)];
    },
    underscore: function() {
      return _.underscored(arguments[0] || this);
    },
    titleize: function() {
      return _.titleize(arguments[0] || this);
    }
  };
  module.exports = String;
}).call(this);
