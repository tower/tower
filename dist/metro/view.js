(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Metro.View = (function() {

    __extends(View, Metro.Object);

    View.extend({
      engine: "jade",
      prettyPrint: false,
      loadPaths: ["app/views"],
      store: function(store) {
        if (store) this._store = store;
        return this._store || (this._store = new Metro.Store.Memory);
      }
    });

    function View(context) {
      if (context == null) context = {};
      this._context = context;
    }

    return View;

  })();

  Metro.View.Helpers = {
    titleTag: function(title) {
      return "<title>" + title + "</title>";
    },
    metaTag: function(name, content) {
      return "<meta name=\"" + name + "\" content=\"" + content + "\"/>";
    },
    tag: function(name, options) {},
    linkTag: function(title, path, options) {},
    imageTag: function(path, options) {},
    csrfMetaTag: function() {
      return this.metaTag("csrf-token", this.request.session._csrf);
    },
    contentTypeTag: function(type) {
      if (type == null) type = "UTF-8";
      return "<meta charset=\"" + type + "\" />";
    },
    javascriptTag: function(path) {
      return "<script type=\"text/javascript\" src=\"" + path + "\" ></script>";
    },
    stylesheetTag: function(path) {
      return "<link href=\"" + path + "\" media=\"screen\" rel=\"stylesheet\" type=\"text/css\"/>";
    },
    javascripts: function(source) {
      var manifest, path, paths, result, _i, _len;
      if (Metro.env === "production") {
        manifest = Metro.assetManifest;
        source = "" + source + ".js";
        if (manifest[source]) source = manifest[source];
        path = "/javascripts/" + source;
        if (Metro.assetHost) path = "" + Metro.assetHost + path;
        return this.javascriptTag(path);
      } else {
        paths = Metro.assets.javascripts[source];
        result = [];
        for (_i = 0, _len = paths.length; _i < _len; _i++) {
          path = paths[_i];
          result.push(this.javascriptTag("/javascripts" + path + ".js"));
        }
        return result.join("");
      }
    },
    stylesheets: function(source) {
      var manifest, path, paths, result, _i, _len;
      if (Metro.env === "production") {
        manifest = Metro.assetManifest;
        source = "" + source + ".css";
        if (manifest[source]) source = manifest[source];
        path = "/stylesheets/" + source;
        if (Metro.assetHost) path = "" + Metro.assetHost + path;
        return this.stylesheetTag(path);
      } else {
        paths = Metro.assets.stylesheets[source];
        result = [];
        for (_i = 0, _len = paths.length; _i < _len; _i++) {
          path = paths[_i];
          result.push(this.stylesheetTag("/stylesheets" + path + ".css"));
        }
        return result.join("");
      }
    },
    t: function(string) {
      return Metro.translate(string);
    },
    l: function(object) {
      return Metro.localize(string);
    }
  };

  Metro.View.Rendering = {
    render: function(options, callback) {
      var self;
      options.type || (options.type = this.constructor.engine);
      if (!options.hasOwnProperty("layout") && this._context.layout) {
        options.layout = this._context.layout();
      }
      options.locals = this._renderingContext(options);
      self = this;
      return this._renderBody(options, function(error, body) {
        return self._renderLayout(body, options, callback);
      });
    },
    _renderBody: function(options, callback) {
      if (options.text) {
        return callback(null, options.text);
      } else if (options.json) {
        return callback(null, typeof options.json === "string" ? options.json : JSON.stringify(options.json));
      } else {
        if (!options.inline) {
          options.template = this._readTemplate(options.template, options.type);
        }
        return this._renderString(options.template, options, callback);
      }
    },
    _renderLayout: function(body, options, callback) {
      var layout;
      if (options.layout) {
        layout = this._readTemplate("layouts/" + options.layout, options.type);
        options.locals.yield = body;
        return this._renderString(layout, options, callback);
      } else {
        return callback(null, body);
      }
    },
    _renderString: function(string, options, callback) {
      var engine;
      if (options == null) options = {};
      if (options.type) {
        engine = require("shift").engine(options.type);
        return engine.render(string, options.locals, callback);
      } else {
        engine = require("shift");
        options.locals.string = string;
        return engine.render(options.locals, callback);
      }
    },
    _renderingContext: function(options) {
      var key, locals, value, _ref;
      locals = this;
      _ref = this._context;
      for (key in _ref) {
        value = _ref[key];
        if (!key.match(/^(render|constructor)/)) this[key] = value;
      }
      locals = Metro.Support.Object.extend(locals, options.locals);
      if (this.constructor.prettyPrint) locals.pretty = true;
      return locals;
    },
    _readTemplate: function(path, ext) {
      var template;
      template = this.constructor.store().find({
        path: path,
        ext: ext
      });
      if (!template) throw new Error("Template '" + path + "' was not found.");
      return template;
    }
  };

  Metro.View.include(Metro.View.Rendering);

  Metro.View.include(Metro.View.Helpers);

}).call(this);
