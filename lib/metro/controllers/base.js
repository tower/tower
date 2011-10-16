(function() {
  var Base;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Base = (function() {
    __extends(Base, Class);
    Base.controller_name = function() {
      var _ref;
      return (_ref = this._controller_name) != null ? _ref : this._controller_name = _.underscore(this.name);
    };
    Base.helpers = function() {};
    Base.layout = function() {};
    function Base() {
      this.headers = {
        "Content-Type": "text/html"
      };
      this.status = 200;
      this.request = null;
      this.response = null;
    }
    Base.prototype.params = {};
    Base.prototype.request = null;
    Base.prototype.response = null;
    Base.prototype.query = {};
    Base.prototype.controller_name = function() {
      return this.constructor.controller_name();
    };
    Base.prototype.call = function(request, response, next) {
      this.request = request;
      this.response = response;
      this.params = this.request.params || {};
      this.cookies = this.request.cookies || {};
      this.query = this.request.query || {};
      this.session = this.request.session || {};
      return this.process();
    };
    Base.prototype.process = function() {
      this.process_query();
      return this[this.params.action]();
    };
    Base.prototype.process_query = function() {};
    Base.prototype.render = function(context, options) {
      var body, view;
      view = new Metro.Views.Base(this);
      body = view.render(context, options);
      if (this.response) {
        this.response.setHeader(this.headers);
        this.response.end(body);
      }
      return body;
    };
    return Base;
  })();
  module.exports = Base;
}).call(this);
