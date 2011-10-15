(function() {
  var Controllers, exports;
  Controllers = {
    Base: require('./controllers/base'),
    bootstrap: function() {
      return Metro.Support.load_classes("" + Metro.root + "/app/controllers");
    }
  };
  exports = module.exports = Controllers;
}).call(this);
