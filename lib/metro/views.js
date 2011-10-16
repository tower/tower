(function() {
  var Views;
  Views = {
    Base: require('./views/base'),
    Renderer: require('./views/renderer'),
    bootstrap: function() {
      return this;
    }
  };
  module.exports = Views;
}).call(this);
