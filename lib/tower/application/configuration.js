
  Tower.Support.Object.extend(Tower, {
    env: "development",
    port: 1597,
    version: "0.3.6",
    client: typeof window !== "undefined",
    root: "/",
    publicPath: "/",
    namespace: null,
    logger: typeof _console !== 'undefined' ? _console : console,
    stack: function() {
      try {
        throw new Error;
      } catch (error) {
        return error.stack;
      }
    },
    raise: function() {
      throw new Error(Tower.t.apply(Tower, arguments));
    },
    configure: function() {},
    initialize: function() {
      return Tower.Application.initialize();
    },
    t: function() {
      var _ref;
      return (_ref = Tower.Support.I18n).t.apply(_ref, arguments);
    },
    "case": "camelcase",
    urlFor: function() {
      var _ref;
      return (_ref = Tower.Route).urlFor.apply(_ref, arguments);
    },
    stringify: function() {
      var string;
      string = Tower.Support.Array.args(arguments).join("_");
      switch (Tower["case"]) {
        case "snakecase":
          return Tower.Support.String.underscore(string);
        default:
          return Tower.Support.String.camelcase(string);
      }
    },
    namespace: function() {
      return Tower.Application.instance().constructor.name;
    },
    accessors: true,
    constant: function(string) {
      var namespace, node, part, parts, _i, _len;
      node = global;
      parts = string.split(".");
      try {
        for (_i = 0, _len = parts.length; _i < _len; _i++) {
          part = parts[_i];
          node = node[part];
        }
      } catch (error) {
        namespace = Tower.namespace();
        if (namespace && parts[0] !== namespace) {
          Tower.constant("" + namespace + "." + string);
        } else {
          throw new Error("Constant '" + string + "' wasn't found");
        }
      }
      return node;
    },
    namespaced: function(string) {
      var namespace;
      namespace = Tower.namespace();
      if (namespace) {
        return "" + namespace + "." + string;
      } else {
        return string;
      }
    }
  });
