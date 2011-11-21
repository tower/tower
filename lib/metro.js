(function() {
  var Metro;

  global._ = require('underscore');

  _.mixin(require("underscore.string"));

  require('underscore.logger');

  module.exports = global.Metro = Metro = {};

  Metro.logger = _console;

  require('./metro/support');

  require('./metro/application');

  require('./metro/store');

  require('./metro/model');

  require('./metro/view');

  require('./metro/controller');

  require('./metro/route');

  require('./metro/middleware');

  require('./metro/command');

  require('./metro/generator');

  require('./metro/spec');

  require('./metro/configuration');

  Metro.root = process.cwd();

  Metro.publicPath = process.cwd() + "/public";

  Metro.run = function(argv) {
    return (new Metro.Command.Server(argv)).run();
  };

  Metro.globalize = function() {
    var key, value, _ref, _results;
    _ref = Metro.Support.Class;
    _results = [];
    for (key in _ref) {
      value = _ref[key];
      _results.push(Function.prototype[key] = value);
    }
    return _results;
  };

}).call(this);
