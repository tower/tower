(function() {
  var Views, exports;
  Views = {
    Base: require('./views/base'),
    Renderer: require('./views/renderer'),
    bootstrap: function() {
      return this;
    }
  };
  exports = module.exports = Views;
}).call(this);
