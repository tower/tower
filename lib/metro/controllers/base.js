(function() {
  var Base;
  Base = (function() {
    Base.controller_name = function() {
      return Metro.Support.String.underscore(this.prototype.constructor.name);
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
    Base.theme = function(theme) {
      return this._theme = theme;
    };
    Base.respond_to = function() {
      var _ref;
      if ((_ref = this._respond_to) == null) {
        this._respond_to = [];
      }
      return this._respond_to = this._respond_to.concat(arguments);
    };
    function Base() {
      this.headers = {};
      this.status = 200;
      this.request = null;
      this.response = null;
      this.content_type = "text/html";
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
      this.format = this.params.format;
      this.headers = {};
      if (this.format && this.format !== "undefined") {
        this.content_type = Metro.Support.Path.content_type(this.format);
      } else {
        this.content_type = "text/html";
      }
      return this.process();
    };
    Base.prototype.process = function() {
      this.process_query();
      return this[this.params.action]();
    };
    Base.prototype.process_query = function() {};
    Base.prototype.render = function() {
      var body, view, _base, _ref;
      view = new Metro.Views.Base(this);
      body = view.render.apply(view, arguments);
      if (this.response) {
        if ((_ref = (_base = this.headers)["Content-Type"]) == null) {
          _base["Content-Type"] = this.content_type;
        }
        this.response.writeHead(200, this.headers);
        this.response.write(body);
        this.response.end();
        this.response = null;
        this.request = null;
      }
      return body;
    };
    Base.prototype.respond_with = function() {
      var callback, data;
      data = arguments[0];
      if (arguments.length > 1 && typeof arguments[arguments.length - 1] === "function") {
        callback = arguments[arguments.length - 1];
      }
      switch (this.format) {
        case "json":
          return this.render({
            json: data
          });
        case "xml":
          return this.render({
            xml: data
          });
        default:
          return this.render({
            action: this.action
          });
      }
    };
    Base.prototype.redirect_to = function() {};
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
