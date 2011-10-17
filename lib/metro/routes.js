(function() {
  var Routes;
  Routes = {
    Route: require('./routes/route'),
    Collection: require('./routes/collection'),
    Mapper: require('./routes/mapper'),
    bootstrap: function() {
      return require("" + Metro.root + "/config/routes");
    },
    reload: function() {
      delete require.cache["" + Metro.root + "/config/routes"];
      Metro.Application._routes = null;
      return this.bootstrap();
    }
  };
  module.exports = Routes;
}).call(this);
