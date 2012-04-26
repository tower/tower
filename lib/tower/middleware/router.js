(function() {

  Tower.Middleware.Router = function(request, response, callback) {
    Tower.Middleware.Router.find(request, response, function(controller) {
      if (controller) {
        if (Tower.env === "test") Tower.Controller.testCase = controller;
        if (response.statusCode !== 302) {
          response.controller = controller;
          response.writeHead(controller.status, controller.headers);
          response.write(controller.body);
          response.end();
          return controller.clear();
        }
      } else {
        return Tower.Middleware.Router.error(request, response);
      }
    });
    return response;
  };

  _.extend(Tower.Middleware.Router, {
    find: function(request, response, callback) {
      this.processHost(request, response);
      this.processAgent(request, response);
      return Tower.HTTP.Route.findController(request, response, callback);
    },
    processHost: function(request, response) {
      return request.location || (request.location = new Tower.HTTP.Url(request.url));
    },
    processAgent: function(request, response) {
      if (request.headers) {
        return request.userAgent || (request.userAgent = request.headers["user-agent"]);
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

  module.exports = Tower.Middleware.Router;

}).call(this);
