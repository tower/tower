(function() {
  var Metro, exports;
  Metro = {
    Class: require('./support/class'),
    Logger: require('./support/logger'),
    /*
      Metro.watch "./assets/javascripts", -> Metro.Asset.compile()
        
      Metro.watch "./app/models", (path) -> Metro.Spec.run(path)
      */
    watch: function(paths, callback) {
      return paths = Array(paths);
    }
  };
  exports = module.exports = Metro;
}).call(this);
