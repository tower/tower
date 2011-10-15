(function() {
  var Support, exports, _;
  _ = require("underscore");
  _.mixin(require("underscore.string"));
  Support = {
    Class: require('./support/class'),
    Logger: require('./support/logger'),
    /*
      Metro.watch "./assets/javascripts", -> Metro.Asset.compile()
        
      Metro.watch "./app/models", (path) -> Metro.Spec.run(path)
      */
    watch: function(paths, callback) {
      return paths = Array(paths);
    },
    load_classes: function(directory) {
      var file, files, klass, _i, _len, _results;
      files = require('findit').sync(directory);
      _results = [];
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        klass = Metro.Assets.File.basename(file).split(".")[0];
        klass = _.camelize("_" + klass);
        _results.push(global[klass] = require(file));
      }
      return _results;
    }
  };
  exports = module.exports = Support;
}).call(this);
