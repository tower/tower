(function() {
  var Controller, exports, _;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  _ = require("underscore");
  _.mixin(require("underscore.string"));
  Controller = (function() {
    __extends(Controller, Class);
    Controller.Dispatcher = require('./controller/dispatcher');
    Controller.bootstrap = function() {
      var file, files, klass, _i, _len, _results;
      files = require('findit').sync("" + Metro.root + "/app/controllers");
      _results = [];
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        klass = Metro.Asset.File.basename(file).split(".")[0];
        klass = _.camelize("_" + klass);
        _results.push(global[klass] = require(file));
      }
      return _results;
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
    Controller.prototype.params = function() {
      var _ref;
      return (_ref = this._params) != null ? _ref : this._params = this.request.parameters();
    };
    Controller.prototype.controller_name = function() {
      return this.constructor.controller_name();
    };
    return Controller;
  })();
  exports = module.exports = Controller;
}).call(this);
