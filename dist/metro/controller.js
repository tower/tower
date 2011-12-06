(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Metro.Controller = (function() {

    __extends(Controller, Metro.Object);

    function Controller() {
      this.headers = {};
      this.status = 200;
      this.request = null;
      this.response = null;
      this.contentType = "text/html";
      this.params = {};
      this.query = {};
    }

    return Controller;

  })();

  Metro.Controller.Caching = {};

  Metro.Controller.Helpers = {
    ClassMethods: {
      helper: function(object) {
        this._helpers || (this._helpers = []);
        return this._helpers.push(object);
      }
    },
    urlFor: function() {}
  };

  Metro.Controller.HTTP = {};

  Metro.Controller.Layouts = {
    ClassMethods: {
      layout: function(layout) {
        return this._layout = layout;
      },
      theme: function(theme) {
        return this._theme = theme;
      }
    },
    layout: function() {
      var layout;
      layout = this.constructor._layout;
      if (typeof layout === "function") {
        return layout.apply(this);
      } else {
        return layout;
      }
    }
  };

  Metro.Controller.Redirecting = {
    redirectTo: function() {}
  };

  Metro.Controller.Rendering = {
    render: function() {
      var args, callback, finish, self, view, _base;
      args = Metro.Support.Array.args(arguments);
      if (args.length >= 2 && typeof args[args.length - 1] === "function") {
        callback = args.pop();
      }
      view = new Metro.View(this);
      (_base = this.headers)["Content-Type"] || (_base["Content-Type"] = this.contentType);
      self = this;
      args.push(finish = function(error, body) {
        if (error) {
          self.body = error.stack;
        } else {
          self.body = body;
        }
        if (callback) callback(error, body);
        return self.callback();
      });
      return view.render.apply(view, args);
    },
    renderToBody: function(options) {
      this._processOptions(options);
      return this._renderTemplate(options);
    },
    renderToString: function() {
      var options;
      options = this._normalizeRender.apply(this, arguments);
      return this.renderToBody(options);
    },
    _renderTemplate: function(options) {
      return this.template.render(viewContext, options);
    }
  };

  Metro.Controller.Responding = {
    ClassMethods: {
      respondTo: function() {
        this._respondTo || (this._respondTo = []);
        return this._respondTo = this._respondTo.concat(Metro.Support.Array.args(arguments));
      }
    },
    respondWith: function() {
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
    },
    call: function(request, response, next) {
      this.request = request;
      this.response = response;
      this.params = this.request.params || {};
      this.cookies = this.request.cookies || {};
      this.query = this.request.query || {};
      this.session = this.request.session || {};
      this.format = this.params.format;
      this.headers = {};
      this.callback = next;
      if (this.format && this.format !== "undefined") {
        this.contentType = Metro.Support.Path.contentType(this.format);
      } else {
        this.contentType = "text/html";
      }
      return this.process();
    },
    process: function() {
      this.processQuery();
      return this[this.params.action]();
    },
    processQuery: function() {},
    clear: function() {
      this.request = null;
      this.response = null;
      return this.headers = null;
    }
  };

  Metro.Controller.include(Metro.Controller.Caching);

  Metro.Controller.include(Metro.Controller.Helpers);

  Metro.Controller.include(Metro.Controller.HTTP);

  Metro.Controller.include(Metro.Controller.Layouts);

  Metro.Controller.include(Metro.Controller.Redirecting);

  Metro.Controller.include(Metro.Controller.Rendering);

  Metro.Controller.include(Metro.Controller.Responding);

}).call(this);
