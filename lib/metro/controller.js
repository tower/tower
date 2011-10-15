(function() {
  var Controller, exports;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Controller = (function() {
    __extends(Controller, Class);
    Controller.bootstrap = function() {
      return Metro.Support.load_classes("" + Metro.root + "/app/controllers");
    };
    Controller.controller_name = function() {
      var _ref;
      return (_ref = this._controller_name) != null ? _ref : this._controller_name = _.underscore(this.name);
    };
    Controller.helpers = function() {};
    Controller.layout = function() {};
    function Controller() {
      this._headers = {
        "Content-Type": "text/html"
      };
      this._status = 200;
      this._request = null;
      this._response = null;
      this._routes = null;
    }
    Controller.prototype.params = {};
    Controller.prototype.request = null;
    Controller.prototype.response = null;
    Controller.prototype.controller_name = function() {
      return this.constructor.controller_name();
    };
    Controller.prototype.call = function(request, response, next) {
      this.request = request;
      this.response = response;
      return this.process(request.params.action);
    };
    Controller.prototype.process = function(action) {
      return this[action]();
    };
    return Controller;
  })();
  exports = module.exports = Controller;
}).call(this);
