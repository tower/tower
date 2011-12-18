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

  Metro.Controller.Callbacks = {
    ClassMethods: {
      filters: function() {
        return this._filters || (this._filters = {
          before: [],
          after: []
        });
      },
      beforeFilter: function() {
        var args;
        args = Metro.Support.Array.args(arguments);
        this.filters().before.push({
          method: args.shift(),
          options: args.shift()
        });
        return this;
      },
      afterFilter: function() {}
    },
    runFilters: function(block, callback) {
      var afterFilters, beforeFilters, iterator, self;
      self = this;
      beforeFilters = this.constructor.filters().before;
      afterFilters = this.constructor.filters().after;
      iterator = function(filter, next) {
        var method, result;
        method = filter.method;
        if (typeof method === "string") {
          if (!self[method]) {
            throw new Error("Method '" + method + "' not defined on " + self.constructor.name);
          }
          method = self[method];
        }
        switch (method.length) {
          case 0:
            result = method.call(self);
            if (!result) return next(new Error("did not pass filter"));
            return next();
          default:
            return method.call(self, function(error, result) {
              if (error) return next(error);
              if (!result) return next(new Error("did not pass filter"));
              return next();
            });
        }
      };
      return require('async').forEachSeries(beforeFilters, iterator, function(error) {
        if (error) return callback(error);
        return block.call(self);
      });
    }
  };

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

  Metro.Controller.Params = {
    ClassMethods: {
      params: function(options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        if (options) {
          this._paramsOptions = Metro.Support.Object.extend(this._paramsOptions || {}, options);
          callback.call(this);
        }
        return this._params || (this._params = {});
      },
      param: function(key, options) {
        if (options == null) options = {};
        this._params || (this._params = {});
        return this._params[key] = Metro.Net.Param.create(key, Metro.Support.Object.extend({}, this._paramsOptions || {}, options));
      }
    },
    criteria: function() {
      var criteria, name, params, parser, parsers;
      if (this._criteria) return this._criteria;
      this._criteria = criteria = new Metro.Model.Criteria;
      parsers = this.constructor.params();
      params = this.params;
      for (name in parsers) {
        parser = parsers[name];
        if (params.hasOwnProperty(name)) {
          criteria.where(parser.toCriteria(params[name]));
        }
      }
      return criteria;
    },
    withParams: function(path, newParams) {
      var params, queryString;
      if (newParams == null) newParams = {};
      params = Metro.Support.Object.extend(this.query, newParams);
      if (Metro.Support.Object.blank(params)) return path;
      queryString = this.queryFor(params);
      return "" + path + "?" + query_string;
    },
    queryFor: function(params) {
      if (params == null) params = {};
    },
    paramOperators: function(key) {}
  };

  Metro.Controller.Processing = {
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
      var block;
      var _this = this;
      this.processQuery();
      block = function(callback) {
        return _this[_this.params.action].call(_this, callback);
      };
      return this.runFilters(block, function(error) {
        console.log("ERROR in callback!");
        return console.log(error);
      });
    },
    processQuery: function() {},
    clear: function() {
      this.request = null;
      this.response = null;
      return this.headers = null;
    }
  };

  Metro.Controller.Redirecting = {
    redirectTo: function() {}
  };

  Metro.Controller.Rendering = {
    render: function() {
      var args, callback, options, self, view, _base;
      args = Metro.Support.Array.args(arguments);
      if (args.length >= 2 && typeof args[args.length - 1] === "function") {
        callback = args.pop();
      } else {
        callback = null;
      }
      if (args.length > 1 && typeof args[args.length - 1] === "object") {
        options = args.pop();
      }
      if (typeof args[0] === "object") {
        options = args[0];
      } else {
        options || (options = {});
        options.template = args[0];
      }
      view = new Metro.View(this);
      (_base = this.headers)["Content-Type"] || (_base["Content-Type"] = this.contentType);
      self = this;
      return view.render.call(view, options, function(error, body) {
        if (error) {
          self.body = error.stack;
        } else {
          self.body = body;
        }
        if (callback) callback(error, body);
        if (self.callback) return self.callback();
      });
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

  Metro.Controller.Resources = {
    ClassMethods: {
      resource: function(options) {
        if (options) this._resource = options;
        return this._resource;
      }
    },
    _create: function(callback) {},
    resource: function() {},
    collection: function() {},
    resourceClass: function() {},
    buildResource: function() {},
    createResource: function() {},
    updateResource: function() {},
    destroyResource: function() {},
    parent: function() {},
    endOfAssociationChain: function() {},
    associationChain: function() {}
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
    }
  };

  Metro.Controller.Sockets = {
    broadcast: function() {},
    emit: function() {}
  };

  Metro.Controller.include(Metro.Controller.Callbacks);

  Metro.Controller.include(Metro.Controller.Helpers);

  Metro.Controller.include(Metro.Controller.HTTP);

  Metro.Controller.include(Metro.Controller.Layouts);

  Metro.Controller.include(Metro.Controller.Params);

  Metro.Controller.include(Metro.Controller.Processing);

  Metro.Controller.include(Metro.Controller.Redirecting);

  Metro.Controller.include(Metro.Controller.Rendering);

  Metro.Controller.include(Metro.Controller.Resources);

  Metro.Controller.include(Metro.Controller.Responding);

  Metro.Controller.include(Metro.Controller.Sockets);

}).call(this);
