
  Coach.Support.Object.extend(Coach, {
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
      throw new Error(Coach.t.apply(Coach, arguments));
    },
    configure: function() {},
    initialize: function() {
      return Coach.Application.initialize();
    },
    t: function() {
      var _ref;
      return (_ref = Coach.Support.I18n).t.apply(_ref, arguments);
    },
    "case": "camelcase",
    urlFor: function() {
      var _ref;
      return (_ref = Coach.Route).urlFor.apply(_ref, arguments);
    },
    stringify: function() {
      var string;
      string = Coach.Support.Array.args(arguments).join("_");
      switch (Coach["case"]) {
        case "snakecase":
          return Coach.Support.String.underscore(string);
        default:
          return Coach.Support.String.camelcase(string);
      }
    },
    namespace: function() {
      return Coach.Application.instance().constructor.name;
    },
    accessors: true,
    constant: function(string) {
      var namespace, node, part, parts, _i, _len;
      node = global;
      try {
        parts = string.split(".");
        for (_i = 0, _len = parts.length; _i < _len; _i++) {
          part = parts[_i];
          node = node[part];
        }
      } catch (error) {
        namespace = Coach.namespace();
        if (namespace && parts[0] !== namespace) {
          Coach.constant("" + namespace + "." + string);
        } else {
          throw new Error("Constant '" + string + "' wasn't found");
        }
      }
      return node;
    },
    namespaced: function(string) {
      var namespace;
      namespace = Coach.namespace();
      if (namespace) {
        return "" + namespace + "." + string;
      } else {
        return string;
      }
    }
  });
