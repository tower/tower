var _;

_ = Tower._;

Tower.MiddlewareRouter = function(request, response, callback) {
  var _this = this;
  if (Tower.isInitialized) {
    return Tower.MiddlewareRouter.render(request, response, callback);
  } else {
    return Tower.Application.instance()._loadApp(function() {
      return Tower.MiddlewareRouter.render(request, response, callback);
    });
  }
};

_.extend(Tower.MiddlewareRouter, {
  find: function(request, response, callback) {
    this.processHost(request, response);
    this.processAgent(request, response);
    return Tower.NetRoute.findController(request, response, callback);
  },
  render: function(request, response, callback) {
    Tower.MiddlewareRouter.find(request, response, function(controller) {
      if (controller) {
        if (Tower.env === 'test') {
          Tower.Controller.testCase = controller;
        }
        if (response.statusCode !== 302) {
          response.controller = controller;
          response.writeHead(controller.status, controller.headers);
          response.write(controller.body);
          response.end();
          return controller.clear();
        }
      } else {
        return Tower.MiddlewareRouter.error(request, response);
      }
    });
    return response;
  },
  processHost: function(request, response) {
    return request.location || (request.location = new Tower.NetUrl(request.url));
  },
  processAgent: function(request, response) {
    if (request.headers) {
      return request.userAgent || (request.userAgent = request.headers['user-agent']);
    }
  },
  error: function(request, response) {
    if (response) {
      response.statusCode = 404;
      response.setHeader('Content-Type', 'text/plain');
      return response.end("No path matches " + request.url);
    }
  }
});
