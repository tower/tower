
  Metro.Controller = (function() {

    function Controller() {
      Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.initialize = function() {
      return Metro.Support.Dependencies.load("" + Metro.root + "/app/controllers");
    };

    Controller.teardown = function() {
      delete this._helpers;
      delete this._layout;
      return delete this._theme;
    };

    Controller.reload = function() {
      this.teardown();
      return this.initialize();
    };

    Controller.helper = function(object) {
      this._helpers || (this._helpers = []);
      return this._helpers.push(object);
    };

    Controller.layout = function(layout) {
      return this._layout = layout;
    };

    Controller.theme = function(theme) {
      return this._theme = theme;
    };

    Controller.prototype.layout = function() {
      var layout;
      layout = this.constructor._layout;
      if (typeof layout === "function") {
        return layout.apply(this);
      } else {
        return layout;
      }
    };

    Controller.getter("controllerName", Controller, function() {
      return Metro.Support.String.camelize(this.name);
    });

    Controller.getter("controllerName", Controller.prototype, function() {
      return this.constructor.controllerName;
    });

    Controller.prototype.clear = function() {
      this.request = null;
      this.response = null;
      return this.headers = null;
    };

    return Controller;

  })();

  Metro.Controller.Flash = (function() {

    function Flash() {
      Flash.__super__.constructor.apply(this, arguments);
    }

    return Flash;

  })();

  Metro.Controller.Redirecting = (function() {

    function Redirecting() {}

    Redirecting.prototype.redirectTo = function() {};

    return Redirecting;

  })();

  Metro.Controller.Rendering = (function() {

    function Rendering() {
      Rendering.__super__.constructor.apply(this, arguments);
    }

    Rendering.prototype.render = function() {
      var args, callback, finish, self, view, _base;
      args = Array.prototype.slice.call(arguments, 0, arguments.length);
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
    };

    Rendering.prototype.renderToBody = function(options) {
      this._processOptions(options);
      return this._renderTemplate(options);
    };

    Rendering.prototype.renderToString = function() {
      var options;
      options = this._normalizeRender.apply(this, arguments);
      return this.renderToBody(options);
    };

    Rendering.prototype._renderTemplate = function(options) {
      return this.template.render(viewContext, options);
    };

    return Rendering;

  })();

  Metro.Controller.Responding = (function() {

    Responding.respondTo = function() {
      this._respondTo || (this._respondTo = []);
      return this._respondTo = this._respondTo.concat(arguments);
    };

    Responding.prototype.respondWith = function() {
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

    Responding.prototype.call = function(request, response, next) {
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
    };

    Responding.prototype.process = function() {
      this.processQuery();
      return this[this.params.action]();
    };

    Responding.prototype.processQuery = function() {};

    function Responding() {
      this.headers = {};
      this.status = 200;
      this.request = null;
      this.response = null;
      this.contentType = "text/html";
      this.params = {};
      this.query = {};
    }

    return Responding;

  })();

  Metro.Controller.include(Metro.Controller.Flash);

  Metro.Controller.include(Metro.Controller.Redirecting);

  Metro.Controller.include(Metro.Controller.Rendering);

  Metro.Controller.include(Metro.Controller.Responding);
