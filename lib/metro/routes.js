(function() {
  var Routes, exports;
  Routes = {
    Route: require('./routes/route'),
    Collection: require('./routes/collection'),
    Mapper: require('./routes/mapper'),
    bootstrap: function() {
      return require("" + Metro.root + "/config/routes");
    }
  };
  exports = module.exports = Routes;
}).call(this);
