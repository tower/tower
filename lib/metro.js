(function() {
  var Metro;
  module.exports = global.Metro = Metro = {};
  Metro.Support = require('./metro/support');
  Metro.Asset = require('./metro/asset');
  Metro.Application = require('./metro/application');
  Metro.Store = require('./metro/store');
  Metro.Model = require('./metro/model');
  Metro.View = require('./metro/view');
  Metro.Controller = require('./metro/controller');
  Metro.Route = require('./metro/route');
  Metro.Presenter = require('./metro/presenter');
  Metro.Middleware = require('./metro/middleware');
  Metro.Command = require('./metro/command');
  Metro.Generator = require('./metro/generator');
  Metro.Spec = require('./metro/spec');
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
  Metro.env = function() {
    return process.env();
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
  Metro.engine = function(extension) {
    var _base, _ref, _ref2;
    if ((_ref = this._engine) == null) {
      this._engine = {};
    }
    return (_ref2 = (_base = this._engine)[extension]) != null ? _ref2 : _base[extension] = (function() {
      switch (extension) {
        case "less":
          return new (require("shift").Less);
        case "styl":
        case "stylus":
          return new (require("shift").Stylus);
        case "coffee":
        case "coffee-script":
          return new (require("shift").CoffeeScript);
        case "jade":
          return new (require("shift").Jade);
        case "mustache":
          return new (require("shift").Mustache);
      }
    })();
  };
}).call(this);
