(function() {
  var Metro;
  global._ = require('underscore');
  _.mixin(require("underscore.string"));
  module.exports = global.Metro = Metro = {};
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
  Metro.configuration = null;
  Metro.logger = new (require("common-logger"))({
    colorized: true
  });
  Metro.root = process.cwd();
  Metro.publicPath = process.cwd() + "/public";
  Metro.env = "test";
  Metro.port = 1597;
  Metro.cache = null;
  Metro.version = "0.2.0";
  Metro.configure = function(callback) {
    return callback.apply(this);
  };
  Metro.application = Metro.Application.instance;
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
  Metro.raise = function() {
    var args, i, message, node, path, _i, _len;
    args = Array.prototype.slice.call(arguments);
    path = args.shift().split(".");
    message = Metro.locale.en;
    for (_i = 0, _len = path.length; _i < _len; _i++) {
      node = path[_i];
      message = message[node];
    }
    i = 0;
    message = message.replace(/%s/g, function() {
      return args[i++];
    });
    throw new Error(message);
  };
  Metro.initialize = Metro.Application.initialize;
  Metro.teardown = Metro.Application.teardown;
  Metro.get = function() {
    return Metro.application().client().get;
  };
  Metro.locale = {
    en: {
      errors: {
        missingCallback: "You must pass a callback to %s.",
        missingOption: "You must pass in the '%s' option to %s.",
        notFound: "%s not found.",
        store: {
          missingAttribute: "Missing %s in %s for '%s'"
        },
        asset: {
          notFound: "Asset not found: '%s'\n  Lookup paths: [\n%s\n  ]"
        }
      }
    }
  };
}).call(this);
