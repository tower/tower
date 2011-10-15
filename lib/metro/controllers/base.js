(function() {
  var Base, exports, fs;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  fs = require('fs');
  Base = (function() {
    __extends(Base, Class);
    Base.controller_name = function() {
      var _ref;
      return (_ref = this._controller_name) != null ? _ref : this._controller_name = _.underscore(this.name);
    };
    Base.helpers = function() {};
    Base.layout = function() {};
    function Base() {
      this._headers = {
        "Content-Type": "text/html"
      };
      this._status = 200;
      this._request = null;
      this._response = null;
      this._routes = null;
    }
    Base.prototype.params = {};
    Base.prototype.request = null;
    Base.prototype.response = null;
    Base.prototype.controller_name = function() {
      return this.constructor.controller_name();
    };
    Base.prototype.call = function(request, response, next) {
      this.request = request;
      this.response = response;
      return this.process(request.params.action);
    };
    Base.prototype.process = function(action) {
      return this[action]();
    };
    Base.prototype.render = function(context, options) {
      var body, engine, path, type;
      type = options.type || Metro.Templates.engine;
      path = "" + context + "." + type;
      engine = Metro.Templates.engines[type];
      body = template.compile(fs.readFileSync(), options);
      this.response.setHeader('Content-Length', body.length);
      return this.response.end(body);
    };
    return Base;
  })();
  exports = module.exports = Base;
}).call(this);
