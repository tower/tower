(function() {
  var Models, exports;
  Models = {
    Base: require('./models/base'),
    bootstrap: function() {
      return Metro.Support.load_classes("" + Metro.root + "/app/models");
    }
  };
  exports = module.exports = Models;
}).call(this);
