(function() {
  var Metro, exports;
  Metro = {
    Support: {
      Class: require('./support/class')
    },
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
