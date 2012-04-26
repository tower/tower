(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Tower.HTTP.Test.Response = (function(_super) {

    __extends(Response, _super);

    function Response() {
      Response.__super__.constructor.apply(this, arguments);
      this.set("host", "test.host");
      this.set("remoteAddress", "0.0.0.0");
      this.set("userAgent", "Tower Testing");
    }

    Response.prototype.set = function(key, value) {
      return this[key](value);
    };

    Response.prototype.host = function(value) {
      if (arguments.length) this._host = value;
      return this._host;
    };

    Response.prototype.requestMethodGet = function(method) {
      if (arguments.length) {
        this.env['REQUEST_METHOD'] = method.toString().toUpperCase();
      }
      return this.env['REQUEST_METHOD'];
    };

    Response.prototype.host = function(host) {
      if (arguments.length) this.env['HTTP_HOST'] = host;
      return this.env['HTTP_HOST'];
    };

    Response.prototype.port = function(number) {
      if (arguments.length) this.env['SERVER_PORT'] = number;
      return this.env['SERVER_PORT'];
    };

    Response.prototype.requestUri = function(uri) {
      if (arguments.length) this.env['REQUEST_URI'] = uri;
      return this.env['REQUEST_URI'];
    };

    Response.prototype.path = function(path) {
      if (arguments.length) this.env['PATH_INFO'] = path;
      return this.env['PATH_INFO'];
    };

    Response.prototype.action = function(actionName) {
      return pathParameters["action"] = actionName.toString();
    };

    Response.prototype.ifModifiedSince = function(lastModified) {
      return this.env['HTTP_IF_MODIFIED_SINCE'] = lastModified;
    };

    Response.prototype.ifNoneMatch = function(etag) {
      return this.env['HTTP_IF_NONE_MATCH'] = etag;
    };

    Response.prototype.remoteAddr = function(addr) {
      return this.env['REMOTE_ADDR'] = addr;
    };

    Response.prototype.userAgent = function(userAgent) {
      return this.env['HTTP_USER_AGENT'] = userAgent;
    };

    Response.prototype.accept = function(mimeTypes) {
      return this.env['HTTP_ACCEPT'] = mimeTypes.join(',');
    };

    Response.prototype.cookies = function() {
      return this._cookies || (this._cookies = {});
    };

    return Response;

  })(Tower.HTTP.Response);

}).call(this);
