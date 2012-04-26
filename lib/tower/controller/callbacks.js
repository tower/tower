(function() {
  var __slice = Array.prototype.slice;

  Tower.Controller.Callbacks = {
    ClassMethods: {
      beforeAction: function() {
        return this.before.apply(this, ["action"].concat(__slice.call(arguments)));
      },
      afterAction: function() {
        return this.after.apply(this, ["action"].concat(__slice.call(arguments)));
      },
      callbacks: function() {
        return this.metadata().callbacks;
      }
    }
  };

  module.exports = Tower.Controller.Callbacks;

}).call(this);
