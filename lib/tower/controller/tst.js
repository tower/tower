var __slice = Array.prototype.slice;

Tower.start = function(port, callback) {
  if (typeof port === 'function') {
    callback = port;
    port = void 0;
  }
  Tower.port = port || 3001;
  return Tower.Application.instance().server.listen(Tower.port, callback);
};

Tower.stop = function() {
  Tower.port = 3000;
  delete Tower.Controller.testCase;
  return Tower.Application.instance().server.close();
};

Tower.modules.superagent.Request.prototype.make = function(callback) {
  return this.end(function(request) {
    var controller;
    controller = Tower.Controller.testCase;
    if (controller) {
      request.controller = controller;
      return callback.call(controller, request);
    } else {
      return callback.call(this, request);
    }
  });
};

_.get = function() {
  return _.request.apply(_, ["get"].concat(__slice.call(arguments)));
};

_.post = function() {
  return _.request.apply(_, ["post"].concat(__slice.call(arguments)));
};

_.head = function() {
  return _.request.apply(_, ["head"].concat(__slice.call(arguments)));
};

_.put = function() {
  return _.request.apply(_, ["put"].concat(__slice.call(arguments)));
};

_.destroy = function() {
  return _.request.apply(_, ["del"].concat(__slice.call(arguments)));
};

_.request = function(method, path, options, callback) {
  var auth, format, headers, newRequest, params, redirects;
  if (typeof options === "function") {
    callback = options;
    options = {};
  }
  options || (options = {});
  headers = options.headers || {};
  params = options.params || {};
  redirects = options.redirects || 5;
  auth = options.auth;
  format = options.format;
  newRequest = Tower.modules.superagent[method.toLowerCase()]("http://localhost:" + Tower.port + path).set(headers).send(params).redirects(redirects);
  if (auth) newRequest = newRequest.auth(auth.username, auth.password);
  if (format) newRequest = newRequest.type(format);
  if (callback) {
    return newRequest.make(callback);
  } else {
    return newRequest;
  }
};
