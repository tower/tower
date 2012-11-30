var __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
};

Tower.NetResponse = (function() {

  function NetResponse(data) {
    if (data == null) {
      data = {};
    }
    this.url = data.url;
    this.location = data.location;
    this.pathname = this.location.path;
    this.query = this.location.query;
    this.title = data.title;
    this.title || (this.title = typeof document !== "undefined" && document !== null ? document.title : void 0);
    this.body = data.body || {};
    this.headers = data.headers || {};
    this.headerSent = false;
    this.statusCode = 200;
    this.body = "";
  }

  __defineProperty(NetResponse,  "writeHead", function(statusCode, headers) {
    this.statusCode = statusCode;
    return this.headers = headers;
  });

  __defineProperty(NetResponse,  "setHeader", function(key, value) {
    if (this.headerSent) {
      throw new Error("Headers already sent");
    }
    return this.headers[key] = value;
  });

  __defineProperty(NetResponse,  "write", function(body) {
    if (body == null) {
      body = '';
    }
    return this.body += body;
  });

  __defineProperty(NetResponse,  "end", function(body) {
    if (body == null) {
      body = '';
    }
    this.body += body;
    this.sent = true;
    return this.headerSent = true;
  });

  __defineProperty(NetResponse,  "redirect", function(path, options) {
    if (options == null) {
      options = {};
    }
    if (global.History) {
      return global.History.push(options, null, path);
    }
  });

  return NetResponse;

})();

module.exports = Tower.NetResponse;
