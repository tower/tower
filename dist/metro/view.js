(function() {
  Metro.View = (function() {
    function View(controller) {
      this.controller = controller || (new Metro.Controller);
    }
    return View;
  })();
  Metro.View.Helpers = (function() {
    function Helpers() {}
    Helpers.prototype.stylesheetLinkTag = function(source) {
      return "<link href=\"" + (this.assetPath(source, {
        directory: Metro.Assets.stylesheetDirectory,
        ext: "css"
      })) + "\"></link>";
    };
    Helpers.prototype.assetPath = function(source, options) {
      if (options == null) {
        options = {};
      }
      if (options.digest === void 0) {
        options.digest = !!Metro.env.match(/(development|test)/);
      }
      return Metro.Application.assets().computePublicPath(source, options);
    };
    Helpers.prototype.javascriptIncludeTag = function(path) {};
    Helpers.prototype.titleTag = function(title) {
      return "<title>" + title + "</title>";
    };
    Helpers.prototype.metaTag = function(name, content) {};
    Helpers.prototype.tag = function(name, options) {};
    Helpers.prototype.linkTag = function(title, path, options) {};
    Helpers.prototype.imageTag = function(path, options) {};
    return Helpers;
  })();
  Metro.View.Lookup = (function() {
    function Lookup() {}
    Lookup.initialize = function() {
      this.resolveLoadPaths();
      this.resolveTemplatePaths();
      return Metro.Support.Dependencies.load("" + Metro.root + "/app/helpers");
    };
    Lookup.teardown = function() {};
    Lookup.resolveLoadPaths = function() {
      var file;
      file = Metro.Support.Path;
      return this.loadPaths = _.map(this.loadPaths, function(path) {
        return file.expandPath(path);
      });
    };
    Lookup.lookup = function(view) {
      var pathsByName, pattern, result, template, templates, _i, _len;
      pathsByName = Metro.View.pathsByName;
      result = pathsByName[view];
      if (result) {
        return result;
      }
      templates = Metro.View.paths;
      pattern = new RegExp(view + "$", "i");
      for (_i = 0, _len = templates.length; _i < _len; _i++) {
        template = templates[_i];
        if (template.split(".")[0].match(pattern)) {
          pathsByName[view] = template;
          return template;
        }
      }
      return null;
    };
    Lookup.resolveTemplatePaths = function() {
      var file, path, templatePaths, _i, _len, _ref;
      file = require("file");
      templatePaths = this.paths;
      _ref = Metro.View.loadPaths;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        path = _ref[_i];
        file.walkSync(path, function(_path, _directories, _files) {
          var template, _file, _j, _len2, _results;
          _results = [];
          for (_j = 0, _len2 = _files.length; _j < _len2; _j++) {
            _file = _files[_j];
            template = [_path, _file].join("/");
            _results.push(templatePaths.indexOf(template) === -1 ? templatePaths.push(template) : void 0);
          }
          return _results;
        });
      }
      return templatePaths;
    };
    Lookup.loadPaths = ["./spec/spec-app/app/views"];
    Lookup.paths = [];
    Lookup.pathsByName = {};
    Lookup.engine = "jade";
    Lookup.prettyPrint = false;
    return Lookup;
  })();
  Metro.View.Rendering = (function() {
    function Rendering() {}
    Rendering.prototype.render = function() {
      var args, callback, options, self, template;
      args = Array.prototype.slice.call(arguments, 0, arguments.length);
      if (!(args.length >= 2 && typeof args[args.length - 1] === "function")) {
        throw new Error("You must pass a callback to the render method");
      }
      callback = args.pop();
      if (args.length === 1) {
        if (typeof args[0] === "string") {
          options = {
            template: args[0]
          };
        } else {
          options = args[0];
        }
      } else {
        template = args[0];
        options = args[1];
        options.template = template;
      }
      options || (options = {});
      options.locals = this.context(options);
      options.type || (options.type = Metro.View.engine);
      options.engine = Metro.engine(options.type);
      if (options.hasOwnProperty("layout") && options.layout === false) {
        options.layout = false;
      } else {
        options.layout = options.layout || this.controller.layout();
      }
      self = this;
      return this._renderBody(options, function(error, body) {
        return self._renderLayout(body, options, callback);
      });
    };
    Rendering.prototype._renderBody = function(options, callback) {
      var template;
      if (options.text) {
        return callback(null, options.text);
      } else if (options.json) {
        return callback(null, typeof options.json === "string" ? options.json : JSON.stringify(options.json));
      } else {
        if (!options.inline) {
          template = Metro.View.lookup(options.template);
          template = Metro.Support.Path.read(template);
        }
        return options.engine.render(template, options.locals, callback);
      }
    };
    Rendering.prototype._renderLayout = function(body, options, callback) {
      var layout;
      if (options.layout) {
        layout = Metro.View.lookup("layouts/" + options.layout);
        layout = Metro.Support.Path.read(layout);
        options.locals.yield = body;
        return options.engine.render(layout, options.locals, callback);
      } else {
        return callback(null, body);
      }
    };
    Rendering.prototype.context = function(options) {
      var controller, key, locals;
      controller = this.controller;
      locals = {};
      for (key in controller) {
        if (key !== "constructor") {
          locals[key] = controller[key];
        }
      }
      locals = require("underscore").extend(locals, this.locals || {}, options.locals);
      if (Metro.View.prettyPrint) {
        locals.pretty = true;
      }
      return locals;
    };
    return Rendering;
  })();
  Metro.View.include(Metro.View.Lookup);
  Metro.View.include(Metro.View.Rendering);
}).call(this);
