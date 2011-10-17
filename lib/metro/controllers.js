(function() {
  var Controllers, exports;
  Controllers = {
    Base: require('./controllers/base'),
    bootstrap: function() {
      return Metro.Support.Dependencies.load("" + Metro.root + "/app/controllers");
    }
  };
  exports = module.exports = Controllers;
}).call(this);
