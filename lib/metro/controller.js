(function() {
  var Controller;
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
      return this;
    };
    function Controller() {
      this._headers = {
        "Content-Type": "text/html"
      };
      this._status = 200;
      this._request = null;
      this._response = null;
      this._routes = null;
    }
    Controller.prototype.params = function() {
      var _ref;
      return (_ref = this._params) != null ? _ref : this._params = this.request.parameters();
    };
    Controller.controller_name = function() {
      return _.underscore(this.name);
    };
    Controller.prototype.controller_name = function() {
      return this.constructor.controller_name();
    };
    return Controller;
  })();
}).call(this);
