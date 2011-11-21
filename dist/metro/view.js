(function() {
  var File, Shift;

  Metro.View = (function() {

    function View(controller) {
      this.controller = controller || (new Metro.Controller);
    }

    return View;

  })();

  Metro.View.Helpers = (function() {

    function Helpers() {}

    Helpers.prototype.contentTypeTag = function(type) {
      if (type == null) type = "UTF-8";
      return "\n    <meta charset=\"" + type + "\" />";
    };

    Helpers.prototype.t = function(string) {
      var _ref;
      if ((_ref = this._t) == null) {
        this._t = require("" + Metro.root + "/config/locales/en");
      }
      return this._t[string];
    };

    Helpers.prototype.stylesheetTag = function(source) {
      var path, paths, result, _i, _len;
      paths = this.assetPaths(source, {
        directory: Metro.Asset.config.stylesheetDirectory,
        extension: ".css"
      });
      result = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        result.push("\n    <link href=\"" + path + "\" media=\"screen\" rel=\"stylesheet\" type=\"text/css\"/>");
      }
      return result.join("");
    };

    Helpers.prototype.javascriptTag = function(source) {
      var path, paths, result, _i, _len;
      paths = this.assetPaths(source, {
        directory: Metro.Asset.config.javascriptDirectory,
        extension: ".js"
      });
      result = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        result.push("\n    <script type=\"text/javascript\" src=\"" + path + "\" ></script>");
      }
      return result.join("");
    };

    Helpers.prototype.assetPaths = function(source, options) {
      var asset, env, publicPath, result, self;
      if (options == null) options = {};
      options.digest = false;
      env = Metro.Asset;
      publicPath = env.computePublicPath(source, options);
      if (Metro.env === "production" || Metro.Support.Path.isUrl(publicPath)) {
        return [publicPath];
      }
      self = this;
      asset = env.find(publicPath);
      result = [];
      asset.paths({
        paths: env.pathsFor(asset.extension),
        require: Metro.env !== "production"
      }, function(paths) {
        var i, path, _len, _results;
        _results = [];
        for (i = 0, _len = paths.length; i < _len; i++) {
          path = paths[i];
          if (i === paths.length - 1) path = source;
          _results.push(result.push(env.computePublicPath(path, options)));
        }
        return _results;
      });
      return result;
    };

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
      file = Path;
      return this.loadPaths = _.map(this.loadPaths, function(path) {
        return Path.relativePath(path);
      });
    };

    Lookup.lookup = function(view) {
      var basename, dirname, key, pathsByName, pattern, result, template, templates, _i, _len;
      pathsByName = Metro.View.pathsByName;
      result = pathsByName[view];
      if (result) return result;
      templates = Metro.View.paths;
      pattern = new RegExp(view + "$", "i");
      for (_i = 0, _len = templates.length; _i < _len; _i++) {
        template = templates[_i];
        dirname = Path.dirname(template);
        basename = Path.basename(template).split(".")[0];
        key = "" + dirname + "/" + basename;
        if (key.match(pattern)) {
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
            if (templatePaths.indexOf(template) === -1) {
              _results.push(templatePaths.push(template));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        });
      }
      return templatePaths;
    };

    Lookup.loadPaths = ["./app/views"];

    Lookup.paths = [];

    Lookup.pathsByName = {};

    Lookup.engine = "jade";

    Lookup.prettyPrint = false;

    return Lookup;

  })();

  Shift = require('shift');

  File = require('pathfinder').File;

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
      options.engine = Shift.engine(options.type);
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
          template = File.read(template);
        }
        return options.engine.render(template, options.locals, callback);
      }
    };

    Rendering.prototype._renderLayout = function(body, options, callback) {
      var layout;
      if (options.layout) {
        layout = Metro.View.lookup("layouts/" + options.layout);
        layout = File.read(layout);
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
        if (key !== "constructor") locals[key] = controller[key];
      }
      locals = require("underscore").extend(locals, this.locals || {}, options.locals);
      if (Metro.View.prettyPrint) locals.pretty = true;
      return locals;
    };

    return Rendering;

  })();

  Metro.View.include(Metro.View.Lookup);

  Metro.View.include(Metro.View.Rendering);

}).call(this);
