(function() {
  var Base, _;
  _ = require("underscore");
  _.mixin(require("underscore.string"));
  Base = (function() {
    Base.controller_name = function() {
      var _ref;
      return (_ref = this._controller_name) != null ? _ref : this._controller_name = _.underscored(this.prototype.constructor.name);
    };
    Base.helper = function(object) {
      var _ref;
      if ((_ref = this._helpers) == null) {
        this._helpers = [];
      }
      return this._helpers.push(object);
    };
    Base.layout = function(layout) {
      return this._layout = layout;
    };
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
        this.response.writeHead(200, this.headers);
        this.response.write(body);
        this.response.end();
        this.response = null;
        this.request = null;
      }
      return body;
    };
    Base.prototype.layout = function() {
      var layout;
      layout = this.constructor._layout;
      if (typeof layout === "function") {
        return layout.apply(this);
      } else {
        return layout;
      }
    };
    return Base;
  })();
  module.exports = Base;
}).call(this);
