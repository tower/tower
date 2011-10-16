(function() {
  var Models;
  Models = {
    Base: require('./models/base'),
    bootstrap: function() {
      return Metro.Support.load_classes("" + Metro.root + "/app/models");
    }
  };
  module.exports = Models;
}).call(this);
