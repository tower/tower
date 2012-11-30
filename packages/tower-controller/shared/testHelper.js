var _,
  __slice = [].slice;

_ = Tower._;

global.testWith = function() {
  var args, fn, title;
  if (arguments.length > 2) {
    args = _.args(arguments);
    fn = typeof args[args.length - 1] === 'function' ? args.pop() : null;
    title = _.map(args, function(arg) {
      return JSON.stringify(arg);
    }).join(' ');
    args.shift();
    return test(title, function(done) {
      if (fn.length === (args.length + 1)) {
        args.push(done);
        return fn.apply(this, args);
      } else {
        fn.apply(this, args);
        return done();
      }
    });
  } else {
    return test.apply(null, arguments);
  }
};

Tower.start = function(port, callback) {
  if (typeof port === 'function') {
    callback = port;
    port = void 0;
  }
  Tower.port = parseInt(port || 3010);
  return Tower.Application.instance().server.listen(Tower.port, callback);
};

Tower.startWithSocket = function(port, callback) {
  var app;
  if (typeof port === 'function') {
    callback = port;
    port = void 0;
  }
  Tower.port = port || 3010;
  app = Tower.Application.instance();
  app.io = require('socket.io').listen(app.server, {
    log: false
  });
  app.io.set('client store expiration', 0);
  app.io.set('log level', -1);
  return app.server.listen(Tower.port, callback);
};

Tower.stop = function(callback) {
  Tower.port = 3010;
  delete Tower.Controller.testCase;
  Tower.Application.instance().server.close();
  if (callback) {
    return callback();
  }
};

Tower.module('superagent').Request.prototype.make = function(callback) {
  return this.end(function(response) {
    var controller;
    controller = Tower.Controller.testCase;
    if (controller) {
      response.controller = controller;
      return callback.call(controller, response);
    } else {
      return callback.call(this, response);
    }
  });
};

_.get = function() {
  return _.request.apply(_, ['get'].concat(__slice.call(arguments)));
};

_.post = function() {
  return _.request.apply(_, ['post'].concat(__slice.call(arguments)));
};

_.head = function() {
  return _.request.apply(_, ['head'].concat(__slice.call(arguments)));
};

_.put = function() {
  return _.request.apply(_, ['put'].concat(__slice.call(arguments)));
};

_.destroy = function() {
  return _.request.apply(_, ['del'].concat(__slice.call(arguments)));
};

_.request = function(method, path, options, callback) {
  var attachments, auth, format, headers, isBlank, key, newRequest, params, redirects, value;
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options || (options = {});
  headers = options.headers || {};
  params = options.params || {};
  redirects = options.redirects != null ? options.redirects : 5;
  auth = options.auth;
  format = options.format;
  method = method.toLowerCase();
  attachments = options.attachments;
  if (headers['content-type'] && method === 'get') {
    throw new Error('The "content-type" header is only valid for PUT/POST');
  }
  newRequest = Tower.module('superagent')[method]("http://localhost:" + Tower.port + path).set(headers).redirects(redirects);
  if (attachments) {
    for (key in attachments) {
      value = attachments[key];
      newRequest.attach(key, value);
    }
  }
  if (format) {
    params.format = format;
  }
  isBlank = _.isBlank(params);
  if (method === 'get') {
    if ((params.conditions != null) && typeof params.conditions === 'object') {
      params.conditions = JSON.stringify(params.conditions);
    }
    if (!isBlank) {
      newRequest.query(params);
    }
  } else {
    if (!isBlank) {
      newRequest = newRequest.send(params);
    }
  }
  if (auth) {
    newRequest = newRequest.auth(auth.username, auth.password);
  }
  if (format && method !== 'get') {
    newRequest = newRequest.type(format);
  }
  if (callback) {
    return newRequest.make(callback);
  } else {
    return newRequest;
  }
};

global.testIndex = global.testShow = function() {
  return testRequest.apply(null, ['get'].concat(__slice.call(arguments)));
};

global.testCreate = function() {
  return testRequest.apply(null, ['post'].concat(__slice.call(arguments)));
};

global.testUpdate = function() {
  return testRequest.apply(null, ['put'].concat(__slice.call(arguments)));
};

global.testDestroy = function() {
  return testRequest.apply(null, ['destroy'].concat(__slice.call(arguments)));
};

global.testRequest = function(method, url, params, block, other) {
  var description;
  description = url;
  if (typeof params === 'function') {
    if (block == null) {
      block = params;
      params = {};
    }
  } else if (typeof params === 'string') {
    url = params;
    if (typeof block === 'object') {
      params = block;
      block = other;
    } else {
      params = {};
    }
  }
  if (!!params && typeof params === 'object') {
    description += " " + (JSON.stringify(params));
  }
  return test(description, function(done) {
    if (typeof params === 'function') {
      params = params();
    }
    if (typeof params === 'string') {
      url = params;
      params = null;
    }
    if (typeof block === 'object') {
      params = block;
      block = other;
    }
    params || (params = {});
    return _[method](url, {
      params: params
    }, function(response) {
      if (block) {
        if (block.length) {
          return block.call(response, done);
        } else {
          block.call(response);
          return done();
        }
      } else {
        return done();
      }
    });
  });
};
