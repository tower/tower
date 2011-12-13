
  Metro.Support.Object.extend(Metro, {
    env: "development",
    port: 1597,
    version: "0.3.6",
    client: typeof window !== "undefined",
    root: "/",
    publicPath: "/",
    namespace: null,
    logger: typeof _console !== 'undefined' ? _console : console,
    raise: function() {
      throw new Error(Metro.t.apply(Metro, arguments));
    },
    configure: function() {},
    initialize: function() {
      return Metro.Application.initialize();
    },
    t: function() {
      var _ref;
      return (_ref = Metro.Support.I18n).t.apply(_ref, arguments);
    },
    "case": "camelcase",
    stringify: function() {
      var string;
      string = Metro.Support.Array.args(arguments).join("_");
      switch (Metro["case"]) {
        case "snakecase":
          return Metro.Support.String.underscore(string);
        default:
          return Metro.Support.String.camelcase(string);
      }
    },
    namespace: function() {
      return Metro.Application.instance().constructor.name;
    },
    accessors: true,
    constant: function(string) {
      var node, part, parts, _i, _len;
      node = global;
      try {
        parts = string.split(".");
        for (_i = 0, _len = parts.length; _i < _len; _i++) {
          part = parts[_i];
          node = node[part];
        }
      } catch (error) {
        throw new Error("Constant '" + string + "' wasn't found");
      }
      return node;
    },
    namespaced: function(string) {
      var namespace;
      namespace = Metro.namespace();
      if (namespace) {
        return "" + namespace + "." + string;
      } else {
        return string;
      }
    }
  });
