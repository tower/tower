(function() {
  var Models;
  Models = {
    Base: require('./models/base'),
    bootstrap: function() {
      return Metro.Support.Dependencies.load("" + Metro.root + "/app/models");
    }
  };
  module.exports = Models;
}).call(this);
