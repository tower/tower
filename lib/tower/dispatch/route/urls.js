
Tower.Dispatch.Route.Urls = {
  ClassMethods: {
    urlFor: function(options) {
      var action, anchor, controller, host, port;
      switch (typeof options) {
        case "string":
          return options;
        default:
          return controller = options.controller, action = options.action, host = options.host, port = options.port, anchor = options.anchor, options;
      }
    }
  }
};

module.exports = Tower.Dispatch.Route.Urls;
