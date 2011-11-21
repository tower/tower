window.Metro = {};

  Metro.configuration = null;

  Metro.env = "development";

  Metro.port = 1597;

  Metro.cache = null;

  Metro.version = "0.2.0";

  Metro.client = false;

  Metro.configure = function(callback) {
    return callback.apply(this);
  };

  Metro.root = "/";

  Metro.publicPath = "/";

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

  Metro.initialize = function() {
    return Metro.Application.initialize();
  };

  Metro.teardown = function() {
    return Metro.Application.teardown();
  };

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

  Metro.application = function() {
    return Metro.Application.instance;
  };
