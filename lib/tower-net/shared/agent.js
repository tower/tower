var __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __slice = [].slice;

Tower.NetAgent = (function() {

  function NetAgent(attributes) {
    if (attributes == null) {
      attributes = {};
    }
    _.extend(this, attributes);
  }

  __defineProperty(NetAgent,  "toJSON", function() {
    return {
      family: this.family,
      major: this.major,
      minor: this.minor,
      patch: this.patch,
      version: this.version,
      os: this.os,
      name: this.name
    };
  });

  __defineProperty(NetAgent,  "get", function() {
    return this.request.apply(this, ['get'].concat(__slice.call(arguments)));
  });

  __defineProperty(NetAgent,  "post", function() {
    return this.request.apply(this, ['post'].concat(__slice.call(arguments)));
  });

  __defineProperty(NetAgent,  "head", function() {
    return this.request.apply(this, ['head'].concat(__slice.call(arguments)));
  });

  __defineProperty(NetAgent,  "put", function() {
    return this.request.apply(this, ['put'].concat(__slice.call(arguments)));
  });

  __defineProperty(NetAgent,  "destroy", function() {
    return this.request.apply(this, ['del'].concat(__slice.call(arguments)));
  });

  __defineProperty(NetAgent,  "request", function(method, path, options, callback) {
    var auth, format, headers, newRequest, params, redirects;
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    options || (options = {});
    headers = options.headers || {};
    params = options.params || {};
    redirects = options.redirects || 5;
    auth = options.auth;
    format = options.format;
    newRequest = Tower.module('superagent')[method.toLowerCase()]("http://localhost:" + Tower.port + path).set(headers).send(params).redirects(redirects);
    if (auth) {
      newRequest = newRequest.auth(auth.username, auth.password);
    }
    if (format) {
      newRequest = newRequest.type(format);
    }
    if (callback) {
      return newRequest.make(callback);
    } else {
      return newRequest;
    }
  });

  return NetAgent;

})();

module.exports = Tower.NetAgent;
