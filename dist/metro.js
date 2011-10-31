var Application, Asset, Cassandra, Client, Compiler, Controller, Cookies, Digest, Field, Flash, Form, Helpers, History, Http, IE, Input, Link, Local, Lookup, Metro, Neo4j, PostgreSQL, Redirecting, Redis, Rendering, Responding, Server, Session, async, connect, crypto, en, fs, key, lingo, mime, moduleKeywords, qs, url, util, value, _, _path, _ref, _url;
var __slice = Array.prototype.slice, __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
}, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
Client = (function() {
  function Client() {}
  Client.prototype.request = function(method, url, options) {
    if (options == null) {
      options = {};
    }
  };
  return Client;
})();
History = (function() {
  function History() {}
  return History;
})();
module.exports = History;
connect = require('connect');
Server = (function() {
  function Server() {}
  Server.prototype.stack = function() {
    this.server.use(connect.favicon(Metro.publicPath + "/favicon.ico"));
    this.server.use(Metro.Middleware.Static.middleware);
    this.server.use(Metro.Middleware.Query.middleware);
    this.server.use(Metro.Middleware.Assets.middleware);
    this.server.use(connect.bodyParser());
    this.server.use(Metro.Middleware.Dependencies.middleware);
    this.server.use(Metro.Middleware.Cookies.middleware);
    this.server.use(Metro.Middleware.Router.middleware);
    return this.server;
  };
  Server.prototype.listen = function() {
    if (Metro.env !== "test") {
      this.server.listen(Metro.port);
      return console.log("Metro server listening on port " + Metro.port);
    }
  };
  Server.run = function() {
    Metro.Application.instance().stack();
    return Metro.Application.instance().listen();
  };
  return Server;
})();
module.exports = Server;
Application = (function() {
  Application.Server = require('./application/server');
  Application.include(Application.Server);
  function Application() {
    var _ref;
    if ((_ref = this.server) == null) {
      this.server = require('connect')();
    }
  }
  Application.instance = function() {
    var _ref;
    return (_ref = this._instance) != null ? _ref : this._instance = new Metro.Application;
  };
  Application.initialize = function() {
    if (Metro.Asset) {
      Metro.Asset.initialize();
    }
    Metro.Route.initialize();
    Metro.Model.initialize();
    Metro.View.initialize();
    Metro.Controller.initialize();
    require("" + Metro.root + "/config/application");
    return this.instance();
  };
  Application.teardown = function() {
    Metro.Route.teardown();
    Metro.Model.teardown();
    Metro.View.teardown();
    Metro.Controller.teardown();
    return delete this._instance;
  };
  return Application;
})();
module.exports = Application;
async = require('async');
_ = require('underscore');
Compiler = (function() {
  function Compiler() {}
  Compiler.HEADER_PATTERN = /^(\/\*\s*(?:(?!\*\/).|\n)*\*\/)|(?:\#\#\#\s*(?:(?!\#\#\#).|\n)*\#\#\#)|(?:\/\/\s*.*\s*?)+|(?:#\s*.*\s*?)/g;
  Compiler.DIRECTIVE_PATTERN = /(?:\/\/|#| *)\s*=\s*(require)\s*['"]?([^'"]+)['"]?[\s]*?\n?/;
  Compiler.prototype.render = function(options, callback) {
    var result, self, terminator;
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    if (options == null) {
      options = {};
    }
    result = "";
    terminator = "\n";
    self = this;
    return this.parse(options, function(parts) {
      var part, _i, _len;
      for (_i = 0, _len = parts.length; _i < _len; _i++) {
        part = parts[_i];
        result += part.content;
      }
      result += terminator;
      return callback.call(self, result);
    });
  };
  Compiler.prototype.parse = function(options, callback) {
    var extension, result, self, terminator;
    if (!(callback && typeof callback === "function")) {
      Metro.raise("errors.missingCallback", "Asset#parse");
    }
    self = this;
    extension = this.extension;
    result = [];
    terminator = "\n";
    return this.parts(options, function(parts) {
      var iterate;
      iterate = function(part, next) {
        var child;
        if (part.hasOwnProperty("content")) {
          return self.compile(part.content, _.extend({}, options), function(data) {
            part.content = data;
            result.push(part);
            return next();
          });
        } else {
          child = Metro.Asset.find(part.path, {
            extension: extension
          });
          if (child) {
            return child.render(_.extend({}, options), function(data) {
              part.content = data;
              result.push(part);
              return next();
            });
          } else {
            console.log("Dependency '" + part.path + "' not found in " + self.path);
            return next();
          }
        }
      };
      return async.forEachSeries(parts, iterate, function() {
        return callback.call(self, result);
      });
    });
  };
  Compiler.prototype.parts = function(options, callback) {
    var data, extension, requireDirectives, self;
    if (!this.path) {
      Metro.raise("errors.missingOption", "path", "Asset#parse");
    }
    self = this;
    extension = this.extension;
    requireDirectives = options.hasOwnProperty("require") ? options.require : true;
    data = this.read();
    if (requireDirectives) {
      return callback.call(self, self.parseDirectives(data, self.path));
    } else {
      return callback.call(self, [
        {
          content: data,
          path: self.path
        }
      ]);
    }
  };
  Compiler.prototype.parseDirectives = function(string, path) {
    var directive, directivePattern, directivesString, last, line, lines, parts, self, _i, _len;
    self = this;
    directivePattern = this.constructor.DIRECTIVE_PATTERN;
    lines = string.match(this.constructor.HEADER_PATTERN);
    directivesString = '';
    parts = [];
    if (lines && lines.length > 0) {
      last = lines[lines.length - 1];
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        line = lines[_i];
        directive = line.match(directivePattern);
        if (directive) {
          parts.push({
            path: directive[2]
          });
        }
      }
    }
    parts.push({
      path: path,
      content: string
    });
    return parts;
  };
  Compiler.prototype.compile = function(data, options, callback) {
    var iterate, self;
    if (options == null) {
      options = {};
    }
    self = this;
    iterate = function(engine, next) {
      return engine.render(data, _.extend({}, options), function(error, result) {
        data = result;
        return next();
      });
    };
    return async.forEachSeries(this.engines(), iterate, function() {
      return callback.call(self, data);
    });
  };
  Compiler.prototype.paths = function(options, callback) {
    var self;
    self = this;
    return this.parts(options, function(parts) {
      var part, paths, _i, _len;
      paths = [];
      for (_i = 0, _len = parts.length; _i < _len; _i++) {
        part = parts[_i];
        paths.push(part.path);
      }
      return callback.call(self, paths);
    });
  };
  Compiler.prototype.engines = function() {
    var engine, extension, extensions, result, _i, _len;
    if (!this._engines) {
      extensions = this.extensions();
      result = [];
      for (_i = 0, _len = extensions.length; _i < _len; _i++) {
        extension = extensions[_i];
        engine = Metro.engine(extension.slice(1));
        if (engine) {
          result.push(engine);
        }
      }
      this._engines = result;
    }
    return this._engines;
  };
  return Compiler;
})();
module.exports = Compiler;
Digest = (function() {
  function Digest() {}
  Digest.include(Metro.Support.Concern);
  Digest.digestPath = function(path) {
    return this.pathWithFingerprint(path, this.digest(path));
  };
  Digest.pathFingerprint = function(path) {
    var result;
    result = Metro.Support.Path.basename(path).match(/-([0-9a-f]{32})\.?/);
    if (result != null) {
      return result[1];
    } else {
      return null;
    }
  };
  Digest.pathWithFingerprint = function(path, digest) {
    var oldDigest;
    if (oldDigest = this.pathFingerprint(path)) {
      return path.replace(oldDigest, digest);
    } else {
      return path.replace(/\.(\w+)$/, "-" + digest + ".\$1");
    }
  };
  Digest.prototype.digestPath = function() {
    return this.constructor.digestPath(this.path);
  };
  Digest.prototype.pathFingerprint = function() {
    return this.constructor.pathFingerprint(this.path);
  };
  Digest.prototype.pathWithFingerprint = function(digest) {
    return this.constructor.pathWithFingerprint(this.path, digest);
  };
  return Digest;
})();
module.exports = Digest;
Lookup = (function() {
  function Lookup() {}
  Lookup.digests = function() {
    var _ref;
    return (_ref = this._digests) != null ? _ref : this._digests = {};
  };
  Lookup.stylesheetLookup = function() {
    var _ref;
    return (_ref = this._stylesheetLookup) != null ? _ref : this._stylesheetLookup = this._createLookup(this.config.stylesheetDirectory, this.config.stylesheetExtensions, this.config.stylesheetAliases);
  };
  Lookup.javascriptLookup = function() {
    var _ref;
    return (_ref = this._javascriptLookup) != null ? _ref : this._javascriptLookup = this._createLookup(this.config.javascriptDirectory, this.config.javascriptExtensions, this.config.javascriptAliases);
  };
  Lookup.imageLookup = function() {
    var _ref;
    return (_ref = this._imageLookup) != null ? _ref : this._imageLookup = this._createLookup(this.config.imageDirectory, this.config.imageExtensions, this.config.imageAliases);
  };
  Lookup.fontLookup = function() {
    var _ref;
    return (_ref = this._fontLookup) != null ? _ref : this._fontLookup = this._createLookup(this.config.fontDirectory, this.config.fontExtensions, this.config.fontAliases);
  };
  Lookup._createLookup = function(directory, extensions, aliases) {
    var path, paths, root, _i, _len, _ref;
    paths = [];
    _ref = this.config.loadPaths;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      path = _ref[_i];
      path = this.join(path, directory);
      paths.push(path);
      paths = paths.concat(this.directories(path));
    }
    root = Metro.root;
    return new Metro.Support.Lookup({
      root: root,
      paths: paths,
      extensions: extensions,
      aliases: aliases
    });
  };
  Lookup.pathsFor = function(extension) {
    return this.lookupFor(extension).paths;
  };
  Lookup.lookupFor = function(extension) {
    switch (extension) {
      case ".css":
        return this.stylesheetLookup();
      case ".js":
        return this.javascriptLookup();
      default:
        return [];
    }
  };
  Lookup.digestFor = function(source) {
    return this.digests[source] || source;
  };
  Lookup.computePublicPath = function(source, options) {
    var extension;
    if (options == null) {
      options = {};
    }
    if (this.isUrl(source)) {
      return source;
    }
    extension = options.extension;
    if (extension) {
      source = this.normalizeExtension(source, extension);
    }
    source = this.normalizeAssetPath(source, options);
    source = this.normalizeRelativeUrlRoot(source, this.relativeUrlRoot);
    source = this.normalizeHostAndProtocol(source, options.protocol);
    return source;
  };
  Lookup.computeAssetHost = function() {
    if (typeof this.config.host === "function") {
      return this.config.host.call(this);
    } else {
      return this.config.host;
    }
  };
  Lookup.normalizeExtension = function(source, extension) {
    return this.basename(source, extension) + extension;
  };
  Lookup.normalizeAssetPath = function(source, options) {
    if (options == null) {
      options = {};
    }
    if (this.isAbsolute(source)) {
      return source;
    } else {
      source = this.join(options.directory, source);
      if (options.digest !== false) {
        source = this.digestFor(source);
      }
      if (!source.match(/^\//)) {
        source = "/" + source;
      }
      return source;
    }
  };
  Lookup.normalizeRelativeUrlRoot = function(source, relativeUrlRoot) {
    if (relativeUrlRoot && !source.match(new RegExp("^" + relativeUrlRoot + "/"))) {
      return "" + relativeUrlRoot + source;
    } else {
      return source;
    }
  };
  Lookup.normalizeHostAndProtocol = function(source, protocol) {
    var host;
    host = this.computeAssetHost(source);
    if (host) {
      return "" + host + source;
    } else {
      return source;
    }
  };
  Lookup.find = function(source, options) {
    var paths;
    if (options == null) {
      options = {};
    }
    paths = this.lookup(source, options);
    if (!(paths && paths.length > 0)) {
      Metro.raise("errors.asset.notFound", source, paths);
    }
    return new Metro.Asset(paths[0], options.extension);
  };
  Lookup.lookup = function(source, options) {
    var lookup, pattern, _ref;
    if (options == null) {
      options = {};
    }
    source = this.normalizeSource(source);
    if ((_ref = options.extension) == null) {
      options.extension = this.extname(source);
    }
    if (options.extension === "") {
      Metro.raise("errors.missingOption", "extension", "Asset#find");
    }
    pattern = "(?:" + Metro.Support.RegExp.escape(options.extension) + ")?$";
    source = source.replace(new RegExp(pattern), options.extension);
    lookup = this.lookupFor(options.extension);
    if (lookup) {
      return lookup.find(source);
    } else {
      return [];
    }
  };
  Lookup.match = function(path) {
    return !!path.match(this.pathPattern());
  };
  Lookup.normalizeSource = function(source) {
    return source.replace(this.pathPattern(), "");
  };
  Lookup.pathPattern = function() {
    var _ref;
    return (_ref = this._pathPattern) != null ? _ref : this._pathPattern = new RegExp("^/(assets|" + this.config.stylesheetDirectory + "|" + this.config.javascriptDirectory + "|" + this.config.imageDirectory + "|" + this.config.fontDirectory + ")/");
  };
  return Lookup;
})();
module.exports = Lookup;
Asset = (function() {
  Asset.Compiler = require('./asset/compiler');
  Asset.Digest = require('./asset/digest');
  Asset.Lookup = require('./asset/lookup');
  Asset.include(Metro.Support.Path);
  Asset.include(Asset.Digest);
  Asset.include(Asset.Lookup);
  Asset.include(Asset.Compiler);
  Asset.initialize = function() {
    return this.config = {
      publicPath: "" + Metro.root + "/public",
      loadPaths: ["" + Metro.root + "/app/assets", "" + Metro.root + "/lib/assets", "" + Metro.root + "/vendor/assets"],
      stylesheetDirectory: "stylesheets",
      stylesheetExtensions: ["css", "styl", "scss", "less"],
      stylesheetAliases: {
        css: ["styl", "less", "scss", "sass"]
      },
      javascriptDirectory: "javascripts",
      javascriptExtensions: ["js", "coffee", "ejs"],
      javascriptAliases: {
        js: ["coffee", "coffeescript"],
        coffee: ["coffeescript"]
      },
      imageDirectory: "images",
      imageExtensions: ["png", "jpg", "gif"],
      imageAliases: {
        jpg: ["jpeg"]
      },
      fontDirectory: "fonts",
      fontExtensions: ["eot", "svg", "tff", "woff"],
      fontAliases: {},
      host: null,
      relativeRootUrl: null,
      precompile: [],
      jsCompressor: null,
      cssCompressor: null,
      enabled: true,
      manifest: "/public/assets",
      compile: true,
      prefix: "assets"
    };
  };
  Asset.teardown = function() {
    delete this._javascriptLookup;
    delete this._stylesheetLookup;
    delete this._imageLookup;
    delete this._fontLookup;
    delete this._pathPattern;
    delete this._cssCompressor;
    delete this._jsCompressor;
    delete this._parser;
    delete this._compiler;
    return delete this._digests;
  };
  Asset.configure = function(options) {
    var key, value, _results;
    _results = [];
    for (key in options) {
      value = options[key];
      _results.push(this.config[key] = value);
    }
    return _results;
  };
  Asset.cssCompressor = function() {
    var _ref;
    return (_ref = this._cssCompressor) != null ? _ref : this._cssCompressor = new (require('shift').YuiCompressor);
  };
  Asset.jsCompressor = function() {
    var _ref;
    return (_ref = this._jsCompressor) != null ? _ref : this._jsCompressor = new (require('shift').UglifyJS);
  };
  function Asset(path, extension) {
    this.path = this.constructor.expandPath(path);
    this.extension = extension || this.extensions()[0];
  }
  Asset.prototype.compiler = function() {
    return this.constructor.compiler();
  };
  return Asset;
})();
module.exports = Asset;
Server = (function() {
  function Server() {}
  return Server;
})();
module.exports = Server;
Metro.Command = {};
require('./command/server');
module.exports = Metro.Command;
Flash = (function() {
  function Flash() {
    Flash.__super__.constructor.apply(this, arguments);
  }
  return Flash;
})();
module.exports = Flash;
Redirecting = (function() {
  function Redirecting() {}
  Redirecting.prototype.redirectTo = function() {};
  return Redirecting;
})();
module.exports = Redirecting;
Rendering = (function() {
  function Rendering() {
    Rendering.__super__.constructor.apply(this, arguments);
  }
  Rendering.prototype.render = function() {
    var args, callback, finish, self, view, _base, _ref;
    args = Array.prototype.slice.call(arguments, 0, arguments.length);
    if (args.length >= 2 && typeof args[args.length - 1] === "function") {
      callback = args.pop();
    }
    view = new Metro.View(this);
    if ((_ref = (_base = this.headers)["Content-Type"]) == null) {
      _base["Content-Type"] = this.contentType;
    }
    self = this;
    args.push(finish = function(error, body) {
      var _ref2;
      self.body = body;
      if ((_ref2 = self.body) == null) {
        self.body = error.toString();
      }
      if (callback) {
        callback(error, body);
      }
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
module.exports = Rendering;
Responding = (function() {
  Responding.respondTo = function() {
    var _ref;
    if ((_ref = this._respondTo) == null) {
      this._respondTo = [];
    }
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
module.exports = Responding;
Controller = (function() {
  function Controller() {
    Controller.__super__.constructor.apply(this, arguments);
  }
  Controller.Flash = require('./controller/flash');
  Controller.Redirecting = require('./controller/redirecting');
  Controller.Rendering = require('./controller/rendering');
  Controller.Responding = require('./controller/responding');
  Controller.include(Controller.Flash);
  Controller.include(Controller.Redirecting);
  Controller.include(Controller.Rendering);
  Controller.include(Controller.Responding);
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
    var _ref;
    if ((_ref = this._helpers) == null) {
      this._helpers = [];
    }
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
module.exports = Controller;
Application = (function() {
  function Application() {}
  return Application;
})();
module.exports = Application;
Metro.Generator.DSL = (function() {
  function DSL() {}
  DSL.prototype.injectIntoFile = function(file, options, callback) {};
  DSL.prototype.readFile = function(file) {};
  DSL.prototype.createFile = function(file, data) {};
  DSL.prototype.removeFile = function(file) {};
  DSL.prototype.createDirectory = function(name) {};
  DSL.prototype.removeDirectory = function(name) {};
  return DSL;
})();
module.exports = Metro.Generator.DSL;
Metro.Generator = {};
require('./generator/application');
module.exports = Metro.Generator;
Metro.Middleware.Assets = (function() {
  function Assets() {}
  Assets.middleware = function(request, response, next) {
    return (new Metro.Middleware.Assets).call(request, response, next);
  };
  Assets.prototype.call = function(request, response, next) {
    var asset, respond;
    if (!Metro.Asset.match(request.uri.pathname)) {
      return next();
    }
    asset = Metro.Asset.find(request.uri.pathname);
    respond = function(status, headers, body) {
      response.writeHead(status, headers);
      response.write(body);
      return response.end();
    };
    if (!asset) {
      return this.notFoundResponse(respond);
    } else {
      return this.okResponse(asset, respond);
    }
  };
  Assets.prototype.forbiddenRequest = function(request) {
    return !!request.url.match(/\.{2}/);
  };
  Assets.prototype.notModified = function(asset) {
    return env["HTTP_IF_MODIFIED_SINCE"] === asset.mtime.httpdate;
  };
  Assets.prototype.notModifiedResponse = function(asset, callback) {
    return callback(304, {}, []);
  };
  Assets.prototype.forbiddenResponse = function(callback) {
    return callback(403, {
      "Content-Type": "text/plain",
      "Content-Length": "9"
    }, "Forbidden");
  };
  Assets.prototype.notFoundResponse = function(callback) {
    return callback(404, {
      "Content-Type": "text/plain",
      "Content-Length": "9",
      "X-Cascade": "pass"
    }, "Not found");
  };
  Assets.prototype.okResponse = function(asset, callback) {
    var paths, self;
    paths = Metro.Asset.pathsFor(asset.extension);
    self = this;
    return asset.render({
      paths: paths,
      require: Metro.env !== "production"
    }, function(body) {
      return callback(200, self.headers(asset, asset.size()), body);
    });
  };
  Assets.prototype.headers = function(asset, length) {
    var headers;
    headers = {};
    headers["Content-Type"] = Metro.Support.Path.contentType("text/" + asset.extension.slice(1));
    headers["Cache-Control"] = "public";
    headers["Last-Modified"] = asset.mtime();
    headers["ETag"] = this.etag(asset);
    if (asset.pathFingerprint) {
      headers["Cache-Control"] += ", max-age=31536000";
    } else {
      headers["Cache-Control"] += ", must-revalidate";
    }
    return headers;
  };
  Assets.prototype.etag = function(asset) {
    return "" + (asset.digest());
  };
  return Assets;
})();
module.exports = Metro.Middleware.Assets;
Cookies = (function() {
  function Cookies() {}
  Cookies.middleware = require("connect").cookieParser('keyboard cat');
  return Cookies;
})();
module.exports = Cookies;
Metro.Middleware.Dependencies = (function() {
  function Dependencies() {}
  Dependencies.middleware = function(request, result, next) {
    return (new Dependencies).call(request, result, next);
  };
  Dependencies.prototype.call = function(request, result, next) {
    Metro.Support.Dependencies.reloadModified();
    Metro.Route.reload();
    if (next != null) {
      return next();
    }
  };
  return Dependencies;
})();
module.exports = Metro.Middleware.Dependencies;
Metro.Middleware.Headers = (function() {
  function Headers() {}
  return Headers;
})();
module.exports = Metro.Middleware.Headers;
url = require('url');
qs = require('qs');
Metro.Middleware.Query = (function() {
  function Query() {}
  Query.middleware = function(request, result, next) {
    return (new Metro.Middleware.Query).call(request, result, next);
  };
  Query.prototype.call = function(request, response, next) {
    request.uri = url.parse(request.url);
    request.query = ~request.url.indexOf('?') ? qs.parse(request.uri.query) : {};
    if (next != null) {
      return next();
    }
  };
  return Query;
})();
module.exports = Metro.Middleware.Query;
_url = require('url');
_ = require('underscore');
Metro.Middleware.Router = (function() {
  function Router() {}
  Router.middleware = function(request, result, next) {
    return (new Metro.Middleware.Router).call(request, result, next);
  };
  Router.prototype.call = function(request, response, next) {
    var self;
    self = this;
    this.find(request, response, function(controller) {
      if (controller) {
        response.writeHead(200, controller.headers);
        response.write(controller.body);
        response.end();
        return controller.clear();
      } else {
        return self.error(request, response);
      }
    });
    return response;
  };
  Router.prototype.find = function(request, response, callback) {
    var controller, route, routes, _i, _len;
    routes = Metro.Route.all();
    for (_i = 0, _len = routes.length; _i < _len; _i++) {
      route = routes[_i];
      controller = this.processRoute(route, request, response);
      if (controller) {
        break;
      }
    }
    if (controller) {
      controller.call(request, response, function() {
        return callback(controller);
      });
    } else {
      callback(null);
    }
    return controller;
  };
  Router.prototype.processRoute = function(route, request, response) {
    var capture, controller, i, keys, match, method, params, path, _len;
    url = _url.parse(request.url);
    path = url.pathname;
    match = route.match(path);
    if (!match) {
      return null;
    }
    method = request.method.toLowerCase();
    keys = route.keys;
    params = _.extend({}, route.defaults, request.query || {}, request.body || {});
    match = match.slice(1);
    for (i = 0, _len = match.length; i < _len; i++) {
      capture = match[i];
      params[keys[i].name] = capture ? decodeURIComponent(capture) : null;
    }
    controller = route.controller;
    if (controller) {
      params.action = controller.action;
    }
    request.params = params;
    if (controller) {
      try {
        controller = new global[route.controller.className];
      } catch (error) {
        throw new Error("" + route.controller.className + " wasn't found");
      }
    }
    return controller;
  };
  Router.prototype.error = function(request, response) {
    if (response) {
      response.statusCode = 404;
      response.setHeader('Content-Type', 'text/plain');
      return response.end("No path matches " + request.url);
    }
  };
  return Router;
})();
module.exports = Metro.Middleware.Router;
Session = (function() {
  function Session() {}
  Session.middleware = require("connect").session({
    cookie: {
      maxAge: 60000
    }
  });
  return Session;
})();
module.exports = Session;
Metro.Middleware.Static = (function() {
  function Static() {}
  Static.middleware = function(request, result, next) {
    var _ref;
    if ((_ref = this._middleware) == null) {
      this._middleware = require("connect").static(Metro.publicPath, {
        maxAge: 0
      });
    }
    return this._middleware(request, result, next);
  };
  return Static;
})();
module.exports = Metro.Middleware.Static;
Metro.Middleware = {};
require('./middleware/dependencies');
require('./middleware/router');
require('./middleware/cookies');
require('./middleware/static');
require('./middleware/query');
require('./middleware/assets');
module.exports = Metro.Middleware;
Metro.Model.Association = (function() {
  Association.include(Metro.Model.Scope);
  function Association(owner, reflection) {
    this.owner = owner;
    this.reflection = reflection;
  }
  Association.prototype.targetClass = function() {
    return global[this.reflection.targetClassName];
  };
  Association.prototype.scoped = function() {
    return (new Metro.Model.Scope(this.reflection.targetClassName)).where(this.conditions());
  };
  Association.prototype.conditions = function() {
    var result;
    result = {};
    if (this.owner.id && this.reflection.foreignKey) {
      result[this.reflection.foreignKey] = this.owner.id;
    }
    return result;
  };
  Association.delegates("where", "find", "all", "first", "last", "store", {
    to: "scoped"
  });
  return Association;
})();
module.exports = Metro.Model.Association;
Metro.Model.Associations = (function() {
  function Associations() {}
  Associations.hasOne = function(name, options) {
    if (options == null) {
      options = {};
    }
  };
  Associations.hasMany = function(name, options) {
    var reflection;
    if (options == null) {
      options = {};
    }
    options.foreignKey = "" + (Metro.Support.String.underscore(this.name)) + "Id";
    this.reflections()[name] = reflection = new Metro.Model.Reflection("hasMany", this.name, name, options);
    Object.defineProperty(this.prototype, name, {
      enumerable: true,
      configurable: true,
      get: function() {
        return this._getHasManyAssociation(name);
      },
      set: function(value) {
        return this._setHasManyAssociation(name, value);
      }
    });
    return reflection;
  };
  Associations.belongsTo = function(name, options) {
    var reflection;
    if (options == null) {
      options = {};
    }
    this.reflections()[name] = reflection = new Metro.Model.Association("belongsTo", this.name, name, options);
    Object.defineProperty(this.prototype, name, {
      enumerable: true,
      configurable: true,
      get: function() {
        return this._getBelongsToAssocation(name);
      },
      set: function(value) {
        return this._setBelongsToAssocation(name, value);
      }
    });
    this.keys()["" + name + "Id"] = new Metro.Model.Attribute("" + name + "Id", options);
    Object.defineProperty(this.prototype, "" + name + "Id", {
      enumerable: true,
      configurable: true,
      get: function() {
        return this._getBelongsToAssocationId("" + name + "Id");
      },
      set: function(value) {
        return this._setBelongsToAssocationId("" + name + "Id", value);
      }
    });
    return reflection;
  };
  Associations.reflections = function() {
    var _ref;
    return (_ref = this._reflections) != null ? _ref : this._reflections = {};
  };
  Associations.prototype._getHasManyAssociation = function(name) {
    return this.constructor.reflections()[name].association(this.id);
  };
  Associations.prototype._setHasManyAssociation = function(name, value) {
    return this.constructor.reflections()[name].association(this.id).destroyAll();
  };
  Associations.prototype._getBelongsToAssocationId = function(name) {
    return this.attributes[name];
  };
  Associations.prototype._setBelongsToAssocationId = function(name, value) {
    return this.attributes[name] = value;
  };
  Associations.prototype._getBelongsToAssocation = function(name) {
    var id;
    id = this._getBelongsToAssocationId(name);
    if (!id) {
      return null;
    }
    return global[this.reflections()[name].targetClassName].where({
      id: this.id
    }).first();
  };
  Associations.prototype._setBelongsToAssocation = function(name, value) {
    var id;
    id = this._getBelongsToAssocationId(name);
    if (!id) {
      return null;
    }
    return global[this.reflections()[name].targetClassName].where({
      id: this.id
    }).first();
  };
  return Associations;
})();
module.exports = Metro.Model.Associations;
Metro.Model.Attribute = (function() {
  function Attribute(name, options) {
    if (options == null) {
      options = {};
    }
    this.name = name;
    this.type = options.type || "string";
    this._default = options["default"];
    this.typecastMethod = (function() {
      switch (this.type) {
        case Array:
        case "array":
          return this._typecastArray;
        case Date:
        case "date":
        case "time":
          return this._typecastDate;
        case Number:
        case "number":
        case "integer":
          return this._typecastInteger;
        case "float":
          return this._typecastFloat;
        default:
          return this._typecastString;
      }
    }).call(this);
  }
  Attribute.prototype.typecast = function(value) {
    return this.typecastMethod.call(this, value);
  };
  Attribute.prototype._typecastArray = function(value) {
    return value;
  };
  Attribute.prototype._typecastString = function(value) {
    return value;
  };
  Attribute.prototype._typecastDate = function(value) {
    return value;
  };
  Attribute.prototype._typecastInteger = function(value) {
    if (value === null || value === void 0) {
      return null;
    }
    return parseInt(value);
  };
  Attribute.prototype._typecastFloat = function(value) {
    if (value === null || value === void 0) {
      return null;
    }
    return parseFloat(value);
  };
  Attribute.prototype.defaultValue = function(record) {
    var _default;
    _default = this._default;
    switch (typeof _default) {
      case 'function':
        return _default.call(record);
      default:
        return _default;
    }
  };
  return Attribute;
})();
module.exports = Metro.Model.Attribute;
Metro.Model.Attributes = (function() {
  function Attributes() {}
  Attributes.key = function(key, options) {
    if (options == null) {
      options = {};
    }
    this.keys()[key] = new Metro.Model.Attribute(key, options);
    Object.defineProperty(this.prototype, key, {
      enumerable: true,
      configurable: true,
      get: function() {
        return this.getAttribute(key);
      },
      set: function(value) {
        return this.setAttribute(key, value);
      }
    });
    return this;
  };
  Attributes.keys = function() {
    var _ref;
    return (_ref = this._keys) != null ? _ref : this._keys = {};
  };
  Attributes.attributeDefinition = function(name) {
    var definition;
    definition = this.keys()[name];
    if (!definition) {
      throw new Error("Attribute '" + name + "' does not exist on '" + this.name + "'");
    }
    return definition;
  };
  Attributes.prototype.typeCast = function(name, value) {
    return this.constructor.attributeDefinition(name).typecast(value);
  };
  Attributes.prototype.typeCastAttributes = function(attributes) {
    var key, value;
    for (key in attributes) {
      value = attributes[key];
      attributes[key] = this.typeCast(key, value);
    }
    return attributes;
  };
  Attributes.prototype.getAttribute = function(name) {
    var _base, _ref;
    return (_ref = (_base = this.attributes)[name]) != null ? _ref : _base[name] = this.constructor.keys()[name].defaultValue(this);
  };
  if (!Attributes.hasOwnProperty("get")) {
    Attributes.alias("get", "getAttribute");
  }
  Attributes.prototype.setAttribute = function(name, value) {
    var beforeValue;
    beforeValue = this._trackChangedAttribute(name, value);
    return this.attributes[name] = value;
  };
  if (!Attributes.hasOwnProperty("set")) {
    Attributes.alias("set", "setAttribute");
  }
  return Attributes;
})();
module.exports = Metro.Model.Attributes;
Metro.Model.Callbacks = (function() {
  function Callbacks() {}
  Callbacks.CALLBACKS = ["afterInitialize", "afterFind", "afterTouch", "beforeValidation", "afterValidation", "beforeSave", "aroundSave", "afterSave", "beforeCreate", "aroundCreate", "afterCreate", "beforeUpdate", "aroundUpdate", "afterUpdate", "beforeDestroy", "aroundDestroy", "afterDestroy", "afterCommit", "afterRollback"];
  Callbacks.defineCallbacks = function() {
    var callback, callbacks, options, type, types, _i, _len, _ref, _ref2, _ref3, _results;
    callbacks = Metro.Support.Array.extractArgsAndOptions(arguments);
    options = callbacks.pop();
    if ((_ref = options.terminator) == null) {
      options.terminator = "result == false";
    }
    if ((_ref2 = options.scope) == null) {
      options.scope = ["kind", "name"];
    }
    if ((_ref3 = options.only) == null) {
      options.only = ["before", "around", "after"];
    }
    types = options.only.map(function(type) {
      return Metro.Support.String.camelize("_" + type);
    });
    _results = [];
    for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
      callback = callbacks[_i];
      _results.push((function() {
        var _j, _len2, _results2;
        _results2 = [];
        for (_j = 0, _len2 = types.length; _j < _len2; _j++) {
          type = types[_j];
          _results2.push(this["_define" + type + "Callback"](callback));
        }
        return _results2;
      }).call(this));
    }
    return _results;
  };
  Callbacks._defineBeforeCallback = function(name) {
    return this["before" + (Metro.Support.String.camelize("_" + name))] = function() {
      return this.setCallback.apply(this, [name, "before"].concat(__slice.call(arguments)));
    };
  };
  Callbacks._defineAroundCallback = function(name) {
    return this["around" + (Metro.Support.String.camelize("_" + name))] = function() {
      return this.setCallback.apply(this, [name, "around"].concat(__slice.call(arguments)));
    };
  };
  Callbacks._defineAfterCallback = function(name) {
    return this["after" + (Metro.Support.String.camelize("_" + name))] = function() {
      return this.setCallback.apply(this, [name, "after"].concat(__slice.call(arguments)));
    };
  };
  Callbacks.prototype.createOrUpdate = function() {
    return this.runCallbacks("save", function() {
      return this["super"];
    });
  };
  Callbacks.prototype.create = function() {
    return this.runCallbacks("create", function() {
      return this["super"];
    });
  };
  Callbacks.prototype.update = function() {
    return this.runCallbacks("update", function() {
      return this["super"];
    });
  };
  Callbacks.prototype.destroy = function() {
    return this.runCallbacks("destroy", function() {
      return this["super"];
    });
  };
  return Callbacks;
})();
module.exports = Metro.Model.Callbacks;
Metro.Model.Dirty = (function() {
  function Dirty() {}
  Dirty.prototype.isDirty = function() {
    var change, changes;
    changes = this.changes();
    for (change in changes) {
      return true;
    }
    return false;
  };
  Dirty.prototype.changes = function() {
    var _ref;
    return (_ref = this._changes) != null ? _ref : this._changes = {};
  };
  Dirty.prototype._trackChangedAttribute = function(attribute, value) {
    var array, beforeValue, _base, _ref, _ref2;
    array = (_ref = (_base = this.changes)[attribute]) != null ? _ref : _base[attribute] = [];
    beforeValue = (_ref2 = array[0]) != null ? _ref2 : array[0] = this.attributes[attribute];
    array[1] = value;
    if (array[0] === array[1]) {
      array = null;
    }
    if (array) {
      this.changes[attribute] = array;
    } else {
      delete this.changes[attribute];
    }
    return beforeValue;
  };
  return Dirty;
})();
module.exports = Metro.Model.Dirty;
Metro.Model.Factory = (function() {
  function Factory() {}
  Factory.store = function() {
    var _ref;
    return (_ref = this._store) != null ? _ref : this._store = new Metro.Store.Memory;
  };
  Factory.define = function(name, options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    if (options == null) {
      options = {};
    }
    return this.store()[name] = [options, callback];
  };
  Factory.build = function(name, overrides) {
    var attributes, key, value;
    attributes = this.store()[name][1]();
    for (key in overrides) {
      value = overrides[key];
      attributes[key] = value;
    }
    return new (global[name](attributes));
  };
  Factory.create = function(name, overrides) {
    var record;
    record = this.build(name, overrides);
    record.save();
    return record;
  };
  return Factory;
})();
({
  en: {
    metro: {
      model: {
        errors: {
          validation: {
            presence: "{{attribute}} can't be blank",
            minimum: "{{attribute}} must be a minimum of {{value}}"
          }
        }
      }
    }
  }
});
Metro.Model.Persistence = (function() {
  function Persistence() {}
  Persistence.create = function(attrs) {
    var record;
    record = new this(attrs);
    this.store().create(record);
    return record;
  };
  Persistence.update = function() {};
  Persistence.deleteAll = function() {
    return this.store().clear();
  };
  Persistence.prototype.isNew = function() {
    return !!!attributes.id;
  };
  Persistence.prototype.save = function(options) {
    return runCallbacks(function() {});
  };
  Persistence.prototype.update = function(options) {};
  Persistence.prototype.reset = function() {};
  Persistence.alias("reload", "reset");
  Persistence.prototype.updateAttribute = function(name, value) {};
  Persistence.prototype.updateAttributes = function(attributes) {};
  Persistence.prototype.increment = function(attribute, amount) {
    if (amount == null) {
      amount = 1;
    }
  };
  Persistence.prototype.decrement = function(attribute, amount) {
    if (amount == null) {
      amount = 1;
    }
  };
  Persistence.prototype.reload = function() {};
  Persistence.prototype["delete"] = function() {};
  Persistence.prototype.destroy = function() {};
  Persistence.prototype.createOrUpdate = function() {};
  Persistence.prototype.isDestroyed = function() {};
  Persistence.prototype.isPersisted = function() {};
  return Persistence;
})();
module.exports = Metro.Model.Persistence;
Metro.Model.Reflection = (function() {
  function Reflection(type, sourceClassName, name, options) {
    if (options == null) {
      options = {};
    }
    this.type = type;
    this.sourceClassName = sourceClassName;
    this.targetClassName = options.className || Metro.Support.String.camelize(Metro.Support.String.singularize(name));
    this.foreignKey = options.foreignKey;
  }
  Reflection.prototype.targetClass = function() {
    return global[this.targetClassName];
  };
  Reflection.prototype.association = function(owner) {
    return new Metro.Model.Association(owner, this);
  };
  return Reflection;
})();
module.exports = Metro.Model.Reflection;
Metro.Model.Scope = (function() {
  function Scope(sourceClassName) {
    this.sourceClassName = sourceClassName;
    this.conditions = [];
  }
  Scope.prototype.where = function() {
    this.conditions.push(["where", arguments]);
    return this;
  };
  Scope.prototype.order = function() {
    this.conditions.push(["order", arguments]);
    return this;
  };
  Scope.prototype.limit = function() {
    this.conditions.push(["limit", arguments]);
    return this;
  };
  Scope.prototype.select = function() {
    this.conditions.push(["select", arguments]);
    return this;
  };
  Scope.prototype.joins = function() {
    this.conditions.push(["joins", arguments]);
    return this;
  };
  Scope.prototype.includes = function() {
    this.conditions.push(["includes", arguments]);
    return this;
  };
  Scope.prototype.within = function() {
    this.conditions.push(["within", arguments]);
    return this;
  };
  Scope.prototype.all = function(callback) {
    return this.store().all(this.query(), callback);
  };
  Scope.prototype.first = function(callback) {
    return this.store().first(this.query(), callback);
  };
  Scope.prototype.last = function(callback) {
    return this.store().last(this.query(), callback);
  };
  Scope.prototype.sourceClass = function() {
    return global[this.sourceClassName];
  };
  Scope.prototype.store = function() {
    return global[this.sourceClassName].store();
  };
  Scope.prototype.query = function() {
    var condition, conditions, item, key, result, value, _i, _len;
    conditions = this.conditions;
    result = {};
    for (_i = 0, _len = conditions.length; _i < _len; _i++) {
      condition = conditions[_i];
      switch (condition[0]) {
        case "where":
          item = condition[1][0];
          for (key in item) {
            value = item[key];
            result[key] = value;
          }
          break;
        case "order":
          result._sort = condition[1][0];
      }
    }
    return result;
  };
  return Scope;
})();
module.exports = Metro.Model.Scope;
Metro.Model.Scopes = (function() {
  function Scopes() {}
  Scopes.scope = function(name, scope) {
    return this[name] = scope instanceof Metro.Model.Scope ? scope : this.where(scope);
  };
  Scopes.where = function() {
    var _ref;
    return (_ref = this.scoped()).where.apply(_ref, arguments);
  };
  Scopes.order = function() {
    var _ref;
    return (_ref = this.scoped()).order.apply(_ref, arguments);
  };
  Scopes.limit = function() {
    var _ref;
    return (_ref = this.scoped()).limit.apply(_ref, arguments);
  };
  Scopes.select = function() {
    var _ref;
    return (_ref = this.scoped()).select.apply(_ref, arguments);
  };
  Scopes.joins = function() {
    var _ref;
    return (_ref = this.scoped()).joins.apply(_ref, arguments);
  };
  Scopes.includes = function() {
    var _ref;
    return (_ref = this.scoped()).includes.apply(_ref, arguments);
  };
  Scopes.within = function() {
    var _ref;
    return (_ref = this.scoped()).within.apply(_ref, arguments);
  };
  Scopes.scoped = function() {
    return new Metro.Model.Scope(this.name);
  };
  Scopes.all = function(callback) {
    return this.store().all(callback);
  };
  Scopes.first = function(callback) {
    return this.store().first(callback);
  };
  Scopes.last = function(callback) {
    return this.store().last(callback);
  };
  Scopes.find = function(id, callback) {
    return this.store().find(id, callback);
  };
  Scopes.count = function(callback) {
    return this.store().count(callback);
  };
  Scopes.exists = function(callback) {
    return this.store().exists(callback);
  };
  return Scopes;
})();
module.exports = Metro.Model.Scopes;
Metro.Model.Serialization = (function() {
  function Serialization() {}
  Serialization.prototype.toXML = function() {};
  Serialization.prototype.toJSON = function() {
    return JSON.stringify(this.attributes);
  };
  Serialization.prototype.toObject = function() {};
  Serialization.prototype.clone = function() {};
  Serialization.fromJSON = function(data) {
    var i, record, records, _len;
    records = JSON.parse(data);
    if (!(records instanceof Array)) {
      records = [records];
    }
    for (i = 0, _len = records.length; i < _len; i++) {
      record = records[i];
      records[i] = new this(record);
    }
    return records;
  };
  return Serialization;
})();
module.exports = Metro.Model.Serialization;
Metro.Model.Validation = (function() {
  function Validation(name, value) {
    this.name = name;
    this.value = value;
    this.attributes = Array.prototype.slice.call(arguments, 2, arguments.length);
    this.validationMethod = (function() {
      switch (name) {
        case "presence":
          return this.validatePresence;
        case "min":
          return this.validateMinimum;
        case "max":
          return this.validateMaximum;
        case "count":
        case "length":
          return this.validateLength;
        case "format":
          if (typeof this.value === 'string') {
            this.value = new RegExp(this.value);
          }
          return this.validateFormat;
      }
    }).call(this);
  }
  Validation.prototype.validate = function(record) {
    var attribute, success, _i, _len, _ref;
    success = true;
    _ref = this.attributes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      attribute = _ref[_i];
      if (!this.validationMethod(record, attribute)) {
        success = false;
      }
    }
    return success;
  };
  Validation.prototype.validatePresence = function(record, attribute) {
    if (!record[attribute]) {
      record.errors().push({
        attribute: attribute,
        message: Metro.Support.I18n.t("metro.model.errors.validation.presence", {
          attribute: attribute
        })
      });
      return false;
    }
    return true;
  };
  Validation.prototype.validateMinimum = function(record, attribute) {
    var value;
    value = record[attribute];
    if (!(typeof value === 'number' && value >= this.value)) {
      record.errors().push({
        attribute: attribute,
        message: Metro.Support.I18n.t("metro.model.errors.validation.minimum", {
          attribute: attribute,
          value: value
        })
      });
      return false;
    }
    return true;
  };
  Validation.prototype.validateMaximum = function(record, attribute) {
    var value;
    value = record[attribute];
    if (!(typeof value === 'number' && value <= this.value)) {
      record.errors().push({
        attribute: attribute,
        message: "" + attribute + " must be a maximum of " + this.value
      });
      return false;
    }
    return true;
  };
  Validation.prototype.validateLength = function(record, attribute) {
    var value;
    value = record[attribute];
    if (!(typeof value === 'number' && value === this.value)) {
      record.errors().push({
        attribute: attribute,
        message: "" + attribute + " must be equal to " + this.value
      });
      return false;
    }
    return true;
  };
  Validation.prototype.validateFormat = function(record, attribute) {
    var value;
    value = record[attribute];
    if (!this.value.exec(value)) {
      record.errors().push({
        attribute: attribute,
        message: "" + attribute + " must be match the format " + (this.value.toString())
      });
      return false;
    }
    return true;
  };
  return Validation;
})();
module.exports = Metro.Model.Validation;
Metro.Model.Validations = (function() {
  function Validations() {
    Validations.__super__.constructor.apply(this, arguments);
  }
  Validations.validates = function() {
    var attributes, key, options, validators, value, _results;
    attributes = Array.prototype.slice.call(arguments, 0, arguments.length);
    options = attributes.pop();
    if (typeof options !== "object") {
      Metro.throw_error("missing_options", "" + this.name + ".validates");
    }
    validators = this.validators();
    _results = [];
    for (key in options) {
      value = options[key];
      _results.push(validators.push((function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return typeof result === "object" ? result : child;
      })(Metro.Model.Validation, [key, value].concat(__slice.call(attributes)), function() {})));
    }
    return _results;
  };
  Validations.validators = function() {
    var _ref;
    return (_ref = this._validators) != null ? _ref : this._validators = [];
  };
  Validations.prototype.validate = function() {
    var self, success, validator, validators, _i, _len;
    self = this;
    validators = this.constructor.validators();
    success = true;
    this.errors().length = 0;
    for (_i = 0, _len = validators.length; _i < _len; _i++) {
      validator = validators[_i];
      if (!validator.validate(self)) {
        success = false;
      }
    }
    return success;
  };
  Validations.prototype.errors = function() {
    var _ref;
    return (_ref = this._errors) != null ? _ref : this._errors = [];
  };
  return Validations;
})();
module.exports = Metro.Model.Validations;
Metro.Model = (function() {
  Model.initialize = function() {
    return Metro.Support.Dependencies.load("" + Metro.root + "/app/models");
  };
  Model.teardown = function() {
    return delete this._store;
  };
  Model.store = function() {
    var _ref;
    return (_ref = this._store) != null ? _ref : this._store = new Metro.Store.Memory;
  };
  function Model(attrs) {
    var attributes, definition, definitions, key, name, value;
    if (attrs == null) {
      attrs = {};
    }
    attributes = {};
    definitions = this.constructor.keys();
    for (key in attrs) {
      value = attrs[key];
      attributes[key] = value;
    }
    for (name in definitions) {
      definition = definitions[name];
      if (!attrs.hasOwnProperty(name)) {
        attributes[name] || (attributes[name] = definition.defaultValue(this));
      }
    }
    this.attributes = this.typeCastAttributes(attributes);
    this.changes = {};
  }
  return Model;
})();
require('./model/scope');
require('./model/association');
require('./model/associations');
require('./model/attribute');
require('./model/attributes');
require('./model/dirty');
require('./model/observing');
require('./model/persistence');
require('./model/reflection');
require('./model/scopes');
require('./model/serialization');
require('./model/validation');
require('./model/validations');
Metro.Model.include(Metro.Model.Persistence);
Metro.Model.include(Metro.Model.Scopes);
Metro.Model.include(Metro.Model.Serialization);
Metro.Model.include(Metro.Model.Associations);
Metro.Model.include(Metro.Model.Validations);
Metro.Model.include(Metro.Model.Dirty);
Metro.Model.include(Metro.Model.Attributes);
module.exports = Model;
Metro.Observer.Binding = (function() {
  function Binding() {}
  return Binding;
})();
module.exports = Metro.Observer.Binding;
Metro.Observer = (function() {
  function Observer() {}
  return Observer;
})();
require('./observer/binding');
module.exports = Metro.Observer;
Metro.Presenter = (function() {
  function Presenter() {}
  return Presenter;
})();
module.exports = Metro.Presenter;
Metro.Route.DSL = (function() {
  function DSL() {}
  DSL.prototype.match = function() {
    var _ref;
    if ((_ref = this.scope) == null) {
      this.scope = {};
    }
    return Metro.Route.create(new Metro.Route(this._extractOptions.apply(this, arguments)));
  };
  DSL.prototype.get = function() {
    return this.matchMethod.apply(this, ["get"].concat(__slice.call(arguments)));
  };
  DSL.prototype.post = function() {
    return this.matchMethod.apply(this, ["post"].concat(__slice.call(arguments)));
  };
  DSL.prototype.put = function() {
    return this.matchMethod.apply(this, ["put"].concat(__slice.call(arguments)));
  };
  DSL.prototype["delete"] = function() {
    return this.matchMethod.apply(this, ["delete"].concat(__slice.call(arguments)));
  };
  DSL.prototype.matchMethod = function(method) {
    var options;
    options = arguments.pop();
    options.via = method;
    arguments.push(options);
    this.match(options);
    return this;
  };
  DSL.prototype.scope = function() {};
  DSL.prototype.controller = function(controller, options, block) {
    options.controller = controller;
    return this.scope(options, block);
  };
  DSL.prototype.namespace = function(path, options, block) {
    options = _.extend({
      path: path,
      as: path,
      module: path,
      shallowPath: path,
      shallowPrefix: path
    }, options);
    return this.scope(options, block);
  };
  DSL.prototype.constraints = function(options, block) {
    return this.scope({
      constraints: options
    }, block);
  };
  DSL.prototype.defaults = function(options, block) {
    return this.scope({
      defaults: options
    }, block);
  };
  DSL.prototype.resource = function() {};
  DSL.prototype.resources = function() {};
  DSL.prototype.collection = function() {};
  DSL.prototype.member = function() {};
  DSL.prototype.root = function(options) {
    return this.match('/', _.extend({
      as: "root"
    }, options));
  };
  DSL.prototype._extractOptions = function() {
    var anchor, constraints, controller, defaults, format, method, name, options, path;
    path = Metro.Route.normalizePath(arguments[0]);
    options = arguments[arguments.length - 1] || {};
    options.path = path;
    format = this._extractFormat(options);
    options.path = this._extractPath(options);
    method = this._extractRequestMethod(options);
    constraints = this._extractConstraints(options);
    defaults = this._extractDefaults(options);
    controller = this._extractController(options);
    anchor = this._extractAnchor(options);
    name = this._extractName(options);
    options = _.extend(options, {
      method: method,
      constraints: constraints,
      defaults: defaults,
      name: name,
      format: format,
      controller: controller,
      anchor: anchor,
      ip: options.ip
    });
    return options;
  };
  DSL.prototype._extractFormat = function(options) {};
  DSL.prototype._extractName = function(options) {
    return options.as;
  };
  DSL.prototype._extractConstraints = function(options) {
    return options.constraints || {};
  };
  DSL.prototype._extractDefaults = function(options) {
    return options.defaults || {};
  };
  DSL.prototype._extractPath = function(options) {
    return "" + options.path + ".:format?";
  };
  DSL.prototype._extractRequestMethod = function(options) {
    return options.via || options.requestMethod;
  };
  DSL.prototype._extractAnchor = function(options) {
    return options.anchor;
  };
  DSL.prototype._extractController = function(options) {
    var action, controller, to;
    to = options.to.split('#');
    if (to.length === 1) {
      action = to[0];
    } else {
      controller = to[0];
      action = to[1];
    }
    if (controller == null) {
      controller = options.controller || this.scope.controller;
    }
    if (action == null) {
      action = options.action || this.scope.action;
    }
    controller = controller.toLowerCase().replace(/(?:Controller)?$/, "Controller");
    action = action.toLowerCase();
    return {
      name: controller,
      action: action,
      className: _.camelize("_" + controller)
    };
  };
  return DSL;
})();
module.exports = Metro.Route.DSL;
Metro.Route = (function() {
  Route.include(Metro.Model.Scopes);
  Route.store = function() {
    var _ref;
    return (_ref = this._store) != null ? _ref : this._store = new Metro.Store.Memory;
  };
  Route.create = function(route) {
    return this.store().create(route);
  };
  Route.normalizePath = function(path) {
    return "/" + path.replace(/^\/|\/$/, "");
  };
  Route.initialize = function() {
    return require("" + Metro.root + "/config/routes");
  };
  Route.teardown = function() {
    this.store().clear();
    delete require.cache[require.resolve("" + Metro.root + "/config/routes")];
    return delete this._store;
  };
  Route.reload = function() {
    this.teardown();
    return this.initialize();
  };
  Route.draw = function(callback) {
    callback.apply(new Metro.Route.DSL(this));
    return this;
  };
  function Route(options) {
    if (options == null) {
      options = options;
    }
    this.path = options.path;
    this.name = options.name;
    this.method = options.method;
    this.ip = options.ip;
    this.defaults = options.defaults || {};
    this.constraints = options.constraints;
    this.options = options;
    this.controller = options.controller;
    this.keys = [];
    this.pattern = this.extractPattern(this.path);
    this.id = this.path;
    if (this.controller) {
      this.id += this.controller.name + this.controller.action;
    }
  }
  Route.prototype.match = function(path) {
    return this.pattern.exec(path);
  };
  Route.prototype.extractPattern = function(path, caseSensitive, strict) {
    var self, _ref;
    if (path instanceof RegExp) {
      return path;
    }
    self = this;
    if (path === "/") {
      return new RegExp('^' + path + '$');
    }
    path = path.replace(/(\(?)(\/)?(\.)?([:\*])(\w+)(\))?(\?)?/g, function(_, open, slash, format, symbol, key, close, optional) {
      var result, splat;
      optional = (!!optional) || (open + close === "()");
      splat = symbol === "*";
      self.keys.push({
        name: key,
        optional: !!optional,
        splat: splat
      });
      if (slash == null) {
        slash = "";
      }
      result = "";
      if (!optional || !splat) {
        result += slash;
      }
      result += "(?:";
      if (format != null) {
        result += splat ? "\\.([^.]+?)" : "\\.([^/.]+?)";
      } else {
        result += splat ? "/?(.+)" : "([^/\\.]+)";
      }
      result += ")";
      if (optional) {
        result += "?";
      }
      return result;
    });
    return new RegExp('^' + path + '$', (_ref = !!caseSensitive) != null ? _ref : {
      '': 'i'
    });
  };
  return Route;
})();
require('./route/dsl');
module.exports = Metro.Route;
Http = (function() {
  function Http() {}
  Http.prototype.response = function(server, req, res, msg) {
    var callback, check, issue, test, token;
    check = function() {
      try {
        server.__port = server.address().port;
        server.__listening = true;
      } catch (err) {
        process.nextTick(check);
        return;
      }
      if (server.__deferred) {
        server.__deferred.forEach(function(fn) {
          return fn();
        });
        return server.__deferred = null;
      }
    };
    issue = function() {
      var data, encoding, method, request, requestTimeout, status, timer;
      timer = void 0;
      method = req.method || "GET";
      status = res.status || res.statusCode;
      data = req.data || req.body;
      requestTimeout = req.timeout || 0;
      encoding = req.encoding || "utf8";
      request = http.request({
        host: "127.0.0.1",
        port: server.__port,
        path: req.url,
        method: method,
        headers: req.headers
      });
      check = function() {
        if (--server.__pending === 0) {
          server.close();
          return server.__listening = false;
        }
      };
      if (requestTimeout) {
        timer = setTimeout(function() {
          check();
          delete req.timeout;
          return test.failure(new Error(msg + "Request timed out after " + requestTimeout + "ms."));
        }, requestTimeout);
      }
      if (data) {
        request.write(data);
      }
      request.on("response", function(response) {
        response.body = "";
        response.setEncoding(encoding);
        response.on("data", function(chunk) {
          return response.body += chunk;
        });
        return response.on("end", function() {
          var actual, eql, expected, i, idx, keys, len, name;
          if (timer) {
            clearTimeout(timer);
          }
          try {
            if (res.body !== undefined) {
              eql = (res.body instanceof RegExp ? res.body.test(response.body) : res.body === response.body);
              assert.ok(eql, msg + "Invalid response body.\n" + "    Expected: " + util.inspect(res.body) + "\n" + "    Got: " + util.inspect(response.body));
            }
            if (typeof status === "number") {
              assert.equal(response.statusCode, status, msg + colorize("Invalid response status code.\n" + "    Expected: [green]{" + status + "}\n" + "    Got: [red]{" + response.statusCode + "}"));
            }
            if (res.headers) {
              keys = Object.keys(res.headers);
              i = 0;
              len = keys.length;
              while (i < len) {
                name = keys[i];
                actual = response.headers[name.toLowerCase()];
                expected = res.headers[name];
                eql = (expected instanceof RegExp ? expected.test(actual) : expected === actual);
                assert.ok(eql, msg + colorize("Invalid response header [bold]{" + name + "}.\n" + "    Expected: [green]{" + expected + "}\n" + "    Got: [red]{" + actual + "}"));
                ++i;
              }
            }
            callback(response);
            return test.success(msg);
          } catch (err) {
            test.failure(err);
            return test.callback();
          } finally {
            idx = test._pending.indexOf(token);
            if (idx >= 0) {
              test._pending.splice(idx, 1);
            } else {
              test.failure(new Error("Request succeeded, but token vanished: " + msg));
            }
            check();
          }
        });
      });
      return request.end();
    };
    test = assert._test;
    callback = (typeof res === "function" ? res : (typeof msg === "function" ? msg : function() {}));
    if (typeof msg === "function") {
      msg = null;
    }
    msg = msg || test.title;
    msg += ". ";
    token = new Error("Response not completed: " + msg);
    test._pending.push(token);
    server.__pending = server.__pending || 0;
    server.__pending++;
    if (!server.fd) {
      server.__deferred = server.__deferred || [];
      server.listen(server.__port = port++, "127.0.0.1", check);
    } else if (!server.__port) {
      server.__deferred = server.__deferred || [];
      process.nextTick(check);
    }
    if (!server.__listening) {
      server.__deferred.push(issue);
    } else {
      return issue();
    }
  };
  return Http;
})();
module.exports = Http;
Metro.Spec = {};
require('./spec/http');
module.exports = Metro.Spec;
Cassandra = (function() {
  function Cassandra() {}
  return Cassandra;
})();
module.exports = Cassandra;
Local = (function() {
  function Local() {}
  return Local;
})();
module.exports = Local;
Metro.Store.Memory = (function() {
  function Memory() {
    this.records = {};
    this.lastId = 0;
  }
  Memory.prototype.addIndex = function() {
    var attributes;
    attributes = Array.prototype.slice.call(arguments, 0, arguments.length);
    this.index[attributes] = key;
    return this;
  };
  Memory.prototype.removeIndex = function() {
    var attributes;
    attributes = Array.prototype.slice.call(arguments, 0, arguments.length);
    delete this.index[attributes];
    return this;
  };
  Memory.prototype.find = function(query, callback) {
    var key, limit, record, records, result, sort;
    result = [];
    records = this.records;
    if (Metro.Support.isPresent(query)) {
      sort = query._sort;
      limit = query._limit || Metro.Store.defaultLimit;
      for (key in records) {
        record = records[key];
        if (this.matches(record, query)) {
          result.push(record);
        }
      }
      if (sort) {
        result = this.sort(result, query._sort);
      }
      if (limit) {
        result = result.slice(0, (limit - 1 + 1) || 9e9);
      }
    } else {
      for (key in records) {
        record = records[key];
        result.push(record);
      }
    }
    if (callback) {
      callback(result);
    }
    return result;
  };
  Memory.alias("select", "find");
  Memory.prototype.first = function(query, callback) {
    var result;
    result = this.find(query, function(records) {
      if (callback) {
        return callback(records[0]);
      }
    });
    return result[0];
  };
  Memory.prototype.last = function(query, callback) {
    var result;
    result = this.find(query, function(records) {
      if (callback) {
        return callback(records[records.length - 1]);
      }
    });
    return result[result.length - 1];
  };
  Memory.prototype.all = function(query, callback) {
    return this.find(query, callback);
  };
  Memory.prototype.length = function(query, callback) {
    return this.find(query, function(records) {
      if (callback) {
        return callback(records.length);
      }
    }).length;
  };
  Memory.alias("count", "length");
  Memory.prototype.remove = function(query, callback) {
    var _records;
    _records = this.records;
    return this.select(query, function(records) {
      var record, _i, _len;
      for (_i = 0, _len = records.length; _i < _len; _i++) {
        record = records[_i];
        _records.splice(_records.indexOf(record), 1);
      }
      if (callback) {
        return callback(records);
      }
    });
  };
  Memory.prototype.clear = function() {
    return this.records = [];
  };
  Memory.prototype.toArray = function() {
    return this.records;
  };
  Memory.prototype.create = function(record) {
    var _ref;
    if (!record.id) {
      Metro.raise("errors.store.missingAttribute", "id", "Store#create", record);
    }
    if ((_ref = record.id) == null) {
      record.id = this.generateId();
    }
    return this.records[record.id] = record;
  };
  Memory.prototype.update = function(record) {
    if (!record.id) {
      Metro.raise("errors.store.missingAttribute", "id", "Store#update", record);
    }
    return this.records[record.id] = record;
  };
  Memory.prototype.destroy = function(record) {
    return this.find(id).destroy();
  };
  Memory.prototype.sort = function() {
    var _ref;
    return (_ref = Metro.Support.Array).sortBy.apply(_ref, arguments);
  };
  Memory.prototype.matches = function(record, query) {
    var key, recordValue, self, success, value;
    self = this;
    success = true;
    for (key in query) {
      value = query[key];
      if (!!Metro.Store.reservedOperators[key]) {
        continue;
      }
      recordValue = record[key];
      if (typeof value === 'object') {
        success = self._matchesOperators(record, recordValue, value);
      } else {
        if (typeof value === "function") {
          value = value.call(record);
        }
        success = recordValue === value;
      }
      if (!success) {
        return false;
      }
    }
    return true;
  };
  Memory.prototype.generateId = function() {
    return this.lastId++;
  };
  Memory.prototype._matchesOperators = function(record, recordValue, operators) {
    var key, operator, self, success, value;
    success = true;
    self = this;
    for (key in operators) {
      value = operators[key];
      if (operator = Metro.Store.queryOperators[key]) {
        if (typeof value === "function") {
          value = value.call(record);
        }
        switch (operator) {
          case "gt":
            success = self._isGreaterThan(recordValue, value);
            break;
          case "gte":
            success = self._isGreaterThanOrEqualTo(recordValue, value);
            break;
          case "lt":
            success = self._isLessThan(recordValue, value);
            break;
          case "lte":
            success = self._isLessThanOrEqualTo(recordValue, value);
            break;
          case "eq":
            success = self._isEqualTo(recordValue, value);
            break;
          case "neq":
            success = self._isNotEqualTo(recordValue, value);
            break;
          case "m":
            success = self._isMatchOf(recordValue, value);
            break;
          case "nm":
            success = self._isNotMatchOf(recordValue, value);
            break;
          case "any":
            success = self._anyIn(recordValue, value);
            break;
          case "all":
            success = self._allIn(recordValue, value);
        }
        if (!success) {
          return false;
        }
      } else {
        return recordValue === operators;
      }
    }
    return true;
  };
  Memory.prototype._isGreaterThan = function(recordValue, value) {
    return recordValue && recordValue > value;
  };
  Memory.prototype._isGreaterThanOrEqualTo = function(recordValue, value) {
    return recordValue && recordValue >= value;
  };
  Memory.prototype._isLessThan = function(recordValue, value) {
    return recordValue && recordValue < value;
  };
  Memory.prototype._isLessThanOrEqualTo = function(recordValue, value) {
    return recordValue && recordValue <= value;
  };
  Memory.prototype._isEqualTo = function(recordValue, value) {
    return recordValue === value;
  };
  Memory.prototype._isNotEqualTo = function(recordValue, value) {
    return recordValue !== value;
  };
  Memory.prototype._isMatchOf = function(recordValue, value) {
    return !!(typeof recordValue === "string" ? recordValue.match(value) : recordValue.exec(value));
  };
  Memory.prototype._isNotMatchOf = function(recordValue, value) {
    return !!!(typeof recordValue === "string" ? recordValue.match(value) : recordValue.exec(value));
  };
  Memory.prototype._anyIn = function(recordValue, array) {
    var value, _i, _len;
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      value = array[_i];
      if (recordValue.indexOf(value) > -1) {
        return true;
      }
    }
    return false;
  };
  Memory.prototype._allIn = function(recordValue, value) {
    var _i, _len;
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      value = array[_i];
      if (recordValue.indexOf(value) === -1) {
        return false;
      }
    }
    return true;
  };
  Memory.prototype.toString = function() {
    return this.constructor.name;
  };
  return Memory;
})();
module.exports = Metro.Store.Memory;
Metro.Store.Mongo = (function() {
  Mongo.config = {
    development: {
      name: "metro-development",
      port: 27017,
      host: "127.0.0.1"
    },
    test: {
      name: "metro-test",
      port: 27017,
      host: "127.0.0.1"
    },
    staging: {
      name: "metro-staging",
      port: 27017,
      host: "127.0.0.1"
    },
    production: {
      name: "metro-production",
      port: 27017,
      host: "127.0.0.1"
    }
  };
  Mongo.configure = function(options) {
    return _.extend(this.config, options);
  };
  Mongo.env = function() {
    return this.config[Metro.env];
  };
  Mongo.lib = function() {
    return require('mongodb');
  };
  Mongo.initialize = function(callback) {
    var env, mongo, self;
    self = this;
    if (!this.database) {
      env = this.env();
      mongo = this.lib();
      new mongo.Db(env.name, new mongo.Server(env.host, env.port, {})).open(function(error, client) {
        return self.database = client;
      });
    }
    return this.database;
  };
  function Mongo(collectionName, options) {
    if (options == null) {
      options = {};
    }
    this.collectionName = collectionName;
  }
  Mongo.prototype.collection = function() {
    var _ref;
    return (_ref = this._collection) != null ? _ref : this._collection = new this.lib().Collection(this.database, this.collectionName);
  };
  Mongo.prototype.find = function(query, callback) {};
  Mongo.alias("select", "find");
  Mongo.prototype.first = function(query, callback) {};
  Mongo.prototype.last = function(query, callback) {};
  Mongo.prototype.all = function(query, callback) {};
  Mongo.prototype.length = function(query, callback) {};
  Mongo.alias("count", "length");
  Mongo.prototype.remove = function(query, callback) {};
  Mongo.prototype.clear = function() {};
  Mongo.prototype.toArray = function() {};
  Mongo.prototype.create = function(record, callback) {
    return this.collection().insert(record, callback);
  };
  Mongo.prototype.update = function(record) {};
  Mongo.prototype.destroy = function(record) {};
  Mongo.prototype.sort = function() {};
  return Mongo;
})();
module.exports = Metro.Store.Mongo;
Neo4j = (function() {
  function Neo4j() {}
  return Neo4j;
})();
module.exports = Neo4j;
PostgreSQL = (function() {
  function PostgreSQL() {}
  return PostgreSQL;
})();
module.exports = PostgreSQL;
Redis = (function() {
  function Redis() {}
  Redis.lib = function() {
    return require("redis");
  };
  Redis.client = function() {
    var _ref;
    return (_ref = this._client) != null ? _ref : this._client = this.lib().createClient();
  };
  Redis.prototype.find = function(query, callback) {};
  Redis.alias("select", "find");
  Redis.prototype.first = function(query, callback) {};
  Redis.prototype.last = function(query, callback) {};
  Redis.prototype.all = function(query, callback) {};
  Redis.prototype.length = function(query, callback) {};
  Redis.alias("count", "length");
  Redis.prototype.remove = function(query, callback) {};
  Redis.prototype.clear = function() {};
  Redis.prototype.toArray = function() {};
  Redis.prototype.create = function(record) {};
  Redis.prototype.update = function(record) {};
  Redis.prototype.destroy = function(record) {};
  Redis.prototype.sort = function() {};
  return Redis;
})();
module.exports = Redis;
Metro.Store = {
  defaultLimit: 100,
  reservedOperators: {
    "_sort": "_sort",
    "_limit": "_limit"
  },
  queryOperators: {
    ">=": "gte",
    "gte": "gte",
    ">": "gt",
    "gt": "gt",
    "<=": "lte",
    "lte": "lte",
    "<": "lt",
    "lt": "lt",
    "in": "in",
    "nin": "nin",
    "any": "any",
    "all": "all",
    "=~": "m",
    "m": "m",
    "!~": "nm",
    "nm": "nm",
    "=": "eq",
    "eq": "eq",
    "!=": "neq",
    "neq": "neq",
    "null": "null",
    "notNull": "notNull"
  }
};
require('./store/cassandra');
require('./store/local');
require('./store/memory');
require('./store/mongo');
require('./store/postgresql');
require('./store/redis');
module.exports = Metro.Store;
Metro.Support.Array = {
  extractArgs: function(args) {
    return Array.prototype.slice.call(args, 0, args.length);
  },
  extractArgsAndOptions: function(args) {
    args = Array.prototype.slice.call(args, 0, args.length);
    if (typeof args[args.length - 1] !== 'object') {
      args.push({});
    }
    return args;
  },
  argsOptionsAndCallback: function() {
    var args, callback, last, options;
    args = Array.prototype.slice.call(arguments);
    last = args.length - 1;
    if (typeof args[last] === "function") {
      callback = args[last];
      if (args.length >= 3) {
        if (typeof args[last - 1] === "object") {
          options = args[last - 1];
          args = args.slice(0, (last - 2 + 1) || 9e9);
        } else {
          options = {};
          args = args.slice(0, (last - 1 + 1) || 9e9);
        }
      } else {
        options = {};
      }
    } else if (args.length >= 2 && typeof args[last] === "object") {
      args = args.slice(0, (last - 1 + 1) || 9e9);
      options = args[last];
      callback = null;
    } else {
      options = {};
      callback = null;
    }
    return [args, options, callback];
  },
  sortBy: function(objects) {
    var arrayComparator, callbacks, sortings, valueComparator;
    sortings = Array.prototype.slice.call(arguments, 1, arguments.length);
    callbacks = sortings[sortings.length - 1] instanceof Array ? {} : sortings.pop();
    valueComparator = function(x, y) {
      if (x > y) {
        return 1;
      } else {
        if (x < y) {
          return -1;
        } else {
          return 0;
        }
      }
    };
    arrayComparator = function(a, b) {
      var x, y;
      x = [];
      y = [];
      sortings.forEach(function(sorting) {
        var aValue, attribute, bValue, direction;
        attribute = sorting[0];
        direction = sorting[1];
        aValue = a[attribute];
        bValue = b[attribute];
        if (typeof callbacks[attribute] !== "undefined") {
          aValue = callbacks[attribute](aValue);
          bValue = callbacks[attribute](bValue);
        }
        x.push(direction * valueComparator(aValue, bValue));
        return y.push(direction * valueComparator(bValue, aValue));
      });
      if (x < y) {
        return -1;
      } else {
        return 1;
      }
    };
    sortings = sortings.map(function(sorting) {
      if (!(sorting instanceof Array)) {
        sorting = [sorting, "asc"];
      }
      if (sorting[1] === "desc") {
        sorting[1] = -1;
      } else {
        sorting[1] = 1;
      }
      return sorting;
    });
    return objects.sort(function(a, b) {
      return arrayComparator(a, b);
    });
  }
};
module.exports = Metro.Support.Array;
Metro.Support.Callbacks = (function() {
  function Callbacks() {}
  return Callbacks;
})();
module.exports = Metro.Support.Callbacks;
moduleKeywords = ['included', 'extended', 'prototype'];
Metro.Support.Class = (function() {
  function Class() {}
  Class.alias = function(to, from) {
    return this.prototype[to] = this.prototype[from];
  };
  Class.alias_method = function(to, from) {
    return this.prototype[to] = this.prototype[from];
  };
  Class.accessor = function(key, self, callback) {
    var _ref;
    if ((_ref = this._accessors) == null) {
      this._accessors = [];
    }
    this._accessors.push(key);
    this.getter(key, self, callback);
    this.setter(key, self);
    return this;
  };
  Class.getter = function(key, self, callback) {
    var _ref;
    if (self == null) {
      self = this.prototype;
    }
    if (!self.hasOwnProperty("_getAttribute")) {
      Object.defineProperty(self, "_getAttribute", {
        enumerable: false,
        configurable: true,
        value: function(key) {
          return this["_" + key];
        }
      });
    }
    if ((_ref = this._getters) == null) {
      this._getters = [];
    }
    this._getters.push(key);
    Object.defineProperty(self, "_" + key, {
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(self, key, {
      enumerable: true,
      configurable: true
    }, {
      get: function() {
        return this["_getAttribute"](key) || (callback ? this["_" + key] = callback.apply(this) : void 0);
      }
    });
    return this;
  };
  Class.setter = function(key, self) {
    var _ref;
    if (self == null) {
      self = this.prototype;
    }
    if (!self.hasOwnProperty("_setAttribute")) {
      Object.defineProperty(self, method, {
        enumerable: false,
        configurable: true,
        value: function(key, value) {
          return this["_" + key] = value;
        }
      });
    }
    if ((_ref = this._setters) == null) {
      this._setters = [];
    }
    this._setters.push(key);
    Object.defineProperty(self, "_" + key, {
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(self, key, {
      enumerable: true,
      configurable: true,
      set: function(value) {
        return this["_setAttribute"](key, value);
      }
    });
    return this;
  };
  Class.classEval = function(block) {
    return block.call(this);
  };
  Class.delegate = function(key, options) {
    var to;
    if (options == null) {
      options = {};
    }
    to = options.to;
    if (typeof this.prototype[to] === "function") {
      return this.prototype[key] = function() {
        var _ref;
        return (_ref = this[to]())[key].apply(_ref, arguments);
      };
    } else {
      return Object.defineProperty(this.prototype, key, {
        enumerable: true,
        configurable: true,
        get: function() {
          return this[to]()[key];
        }
      });
    }
  };
  Class.delegates = function() {
    var args, key, options, _i, _len, _results;
    args = Array.prototype.slice.call(arguments, 0, arguments.length);
    options = args.pop();
    _results = [];
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      key = args[_i];
      _results.push(this.delegate(key, options));
    }
    return _results;
  };
  Class.include = function(obj) {
    var c, child, clone, cloned, included, key, newproto, oldproto, parent, value, _ref;
    if (!obj) {
      throw new Error('include(obj) requires obj');
    }
    this.extend(obj);
    c = this;
    child = this;
    parent = obj;
    clone = function(fct) {
      var clone_, property;
      clone_ = function() {
        return fct.apply(this, arguments);
      };
      clone_.prototype = fct.prototype;
      for (property in fct) {
        if (fct.hasOwnProperty(property) && property !== "prototype") {
          clone_[property] = fct[property];
        }
      }
      return clone_;
    };
    if (child.__super__) {
      oldproto = child.__super__;
    }
    cloned = clone(parent);
    newproto = cloned.prototype;
    _ref = cloned.prototype;
    for (key in _ref) {
      value = _ref[key];
      if (__indexOf.call(moduleKeywords, key) < 0) {
        this.prototype[key] = value;
      }
    }
    if (oldproto) {
      cloned.prototype = oldproto;
    }
    child.__super__ = newproto;
    included = obj.included;
    if (included) {
      included.apply(obj.prototype);
    }
    return this;
  };
  Class.extend = function(obj) {
    var extended, key, value;
    if (!obj) {
      throw new Error('extend(obj) requires obj');
    }
    for (key in obj) {
      value = obj[key];
      if (__indexOf.call(moduleKeywords, key) < 0) {
        this[key] = value;
      }
    }
    extended = obj.extended;
    if (extended) {
      extended.apply(obj);
    }
    return this;
  };
  Class["new"] = function() {
    return (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return typeof result === "object" ? result : child;
    })(this, arguments, function() {});
  };
  Class.instanceMethods = function() {
    var key, result;
    result = [];
    for (key in this.prototype) {
      result.push(key);
    }
    return result;
  };
  Class.classMethods = function() {
    var key, result;
    result = [];
    for (key in this) {
      result.push(key);
    }
    return result;
  };
  Class.prototype.instanceExec = function() {
    var _ref;
    return (_ref = arguments[0]).apply.apply(_ref, [this].concat(__slice.call(arguments.slice(1))));
  };
  Class.prototype.instanceEval = function(block) {
    return block.apply(this);
  };
  Class.prototype.send = function(method) {
    var _ref;
    if (this[method]) {
      return (_ref = this[method]).apply.apply(_ref, arguments);
    } else {
      if (this.methodMissing) {
        return this.methodMissing.apply(this, arguments);
      }
    }
  };
  Class.prototype.methodMissing = function(method) {};
  return Class;
})();
module.exports = Metro.Support.Class;
_ref = Metro.Support.Class;
for (key in _ref) {
  value = _ref[key];
  Function.prototype[key] = value;
}
Metro.Support.Concern = (function() {
  function Concern() {
    Concern.__super__.constructor.apply(this, arguments);
  }
  Concern.included = function() {
    var _ref2;
    if ((_ref2 = this._dependencies) == null) {
      this._dependencies = [];
    }
    if (this.hasOwnProperty("ClassMethods")) {
      this.extend(this.ClassMethods);
    }
    if (this.hasOwnProperty("InstanceMethods")) {
      return this.include(this.InstanceMethods);
    }
  };
  Concern._appendFeatures = function() {};
  return Concern;
})();
module.exports = Metro.Support.Concern;
fs = require('fs');
Metro.Support.Dependencies = (function() {
  function Dependencies() {}
  Dependencies.load = function(directory) {
    var path, paths, _i, _len, _results;
    paths = require('findit').sync(directory);
    _results = [];
    for (_i = 0, _len = paths.length; _i < _len; _i++) {
      path = paths[_i];
      _results.push(this.loadPath(path));
    }
    return _results;
  };
  Dependencies.loadPath = function(path) {
    var keys, klass, self;
    self = this;
    keys = this.keys;
    klass = Metro.Support.Path.basename(path).split(".")[0];
    klass = Metro.Support.String.camelize("_" + klass);
    if (!keys[klass]) {
      keys[klass] = new Metro.Support.Path(path);
      return global[klass] = require(path);
    }
  };
  Dependencies.clear = function() {
    var file, key, _ref2, _results;
    _ref2 = this.keys;
    _results = [];
    for (key in _ref2) {
      file = _ref2[key];
      _results.push(this.clearDependency(key));
    }
    return _results;
  };
  Dependencies.clearDependency = function(key) {
    var file;
    file = this.keys[key];
    delete require.cache[require.resolve(file.path)];
    global[key] = null;
    delete global[key];
    this.keys[key] = null;
    return delete this.keys[key];
  };
  Dependencies.reloadModified = function() {
    var file, key, keys, self, _results;
    self = this;
    keys = this.keys;
    _results = [];
    for (key in keys) {
      file = keys[key];
      _results.push(file.stale() ? (self.clearDependency(key), keys[key] = file, global[key] = require(file.path)) : void 0);
    }
    return _results;
  };
  Dependencies.keys = {};
  return Dependencies;
})();
module.exports = Metro.Support.Dependencies;
Metro.Support.I18n = (function() {
  function I18n() {}
  I18n.defaultLanguage = "en";
  I18n.translate = function(key, options) {
    if (options == null) {
      options = {};
    }
    if (options.hasOwnProperty("tense")) {
      key += "." + options.tense;
    }
    if (options.hasOwnProperty("count")) {
      switch (options.count) {
        case 0:
          key += ".none";
          break;
        case 1:
          key += ".one";
          break;
        default:
          key += ".other";
      }
    }
    return this.interpolator().render(this.lookup(key, options.language), {
      locals: options
    });
  };
  I18n.t = I18n.translate;
  I18n.lookup = function(key, language) {
    var part, parts, result, _i, _len;
    if (language == null) {
      language = this.defaultLanguage;
    }
    parts = key.split(".");
    result = this.store[language];
    try {
      for (_i = 0, _len = parts.length; _i < _len; _i++) {
        part = parts[_i];
        result = result[part];
      }
    } catch (error) {
      result = null;
    }
    if (result == null) {
      throw new Error("Translation doesn't exist for '" + key + "'");
    }
    return result;
  };
  I18n.store = {};
  I18n.interpolator = function() {
    var _ref2;
    return (_ref2 = this._interpolator) != null ? _ref2 : this._interpolator = new (require('shift').Mustache);
  };
  return I18n;
})();
module.exports = Metro.Support.I18n;
IE = (function() {
  function IE() {}
  return IE;
})();
module.exports = IE;
en = {
  date: {
    formats: {
      "default": "%Y-%m-%d",
      short: "%b %d",
      long: "%B %d, %Y"
    },
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    abbrDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    monthNames: [null, "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    abbrMonthNames: [null, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    order: ["year", "month", "day"]
  },
  time: {
    formats: {
      "default": "%a, %d %b %Y %H:%M:%S %z",
      short: "%d %b %H:%M",
      long: "%B %d, %Y %H:%M"
    },
    am: "am",
    pm: "pm"
  },
  support: {
    array: {
      wordsConnector: ", ",
      twoWordsConnector: " and ",
      lastWordConnector: ", and "
    }
  }
};
Metro.Support.Lookup = (function() {
  function Lookup(options) {
    if (options == null) {
      options = {};
    }
    this.root = options.root;
    this.extensions = this._normalizeExtensions(options.extensions);
    this.aliases = this._normalizeAliases(options.aliases || {});
    this.paths = this._normalizePaths(options.paths);
    this.patterns = {};
    this._entries = {};
  }
  Lookup.prototype.find = function(source) {
    var basename, directory, path, paths, result, root, _i, _len;
    source = source.replace(/(?:\/\.{2}\/|^\/)/g, "");
    result = [];
    root = this.root;
    paths = source[0] === "." ? [Metro.Support.Path.absolutePath(source, root)] : this.paths.map(function(path) {
      return Metro.Support.Path.join(path, source);
    });
    for (_i = 0, _len = paths.length; _i < _len; _i++) {
      path = paths[_i];
      directory = Metro.Support.Path.dirname(path);
      basename = Metro.Support.Path.basename(path);
      if (this.pathsInclude(directory)) {
        result = result.concat(this.match(directory, basename));
      }
    }
    return result;
  };
  Lookup.prototype.pathsInclude = function(directory) {
    var path, _i, _len, _ref2;
    _ref2 = this.paths;
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      path = _ref2[_i];
      if (path.substr(0, directory.length) === directory) {
        return true;
      }
    }
    return false;
  };
  Lookup.prototype.match = function(directory, basename) {
    var entries, entry, i, match, matches, pattern, _i, _len, _len2;
    entries = this.entries(directory);
    pattern = this.pattern(basename);
    matches = [];
    for (_i = 0, _len = entries.length; _i < _len; _i++) {
      entry = entries[_i];
      if (Metro.Support.Path.isFile(Metro.Support.Path.join(directory, entry)) && !!entry.match(pattern)) {
        matches.push(entry);
      }
    }
    matches = this.sort(matches, basename);
    for (i = 0, _len2 = matches.length; i < _len2; i++) {
      match = matches[i];
      matches[i] = Metro.Support.Path.join(directory, match);
    }
    return matches;
  };
  Lookup.prototype.sort = function(matches, basename) {
    return matches;
  };
  Lookup.prototype._normalizePaths = function(paths) {
    var path, result, _i, _len;
    result = [];
    for (_i = 0, _len = paths.length; _i < _len; _i++) {
      path = paths[_i];
      if (path !== ".." && path !== ".") {
        result.push(Metro.Support.Path.absolutePath(path, this.root));
      }
    }
    return result;
  };
  Lookup.prototype._normalizeExtension = function(extension) {
    return extension.replace(/^\.?/, ".");
  };
  Lookup.prototype._normalizeExtensions = function(extensions) {
    var extension, result, _i, _len;
    result = [];
    for (_i = 0, _len = extensions.length; _i < _len; _i++) {
      extension = extensions[_i];
      result.push(this._normalizeExtension(extension));
    }
    return result;
  };
  Lookup.prototype._normalizeAliases = function(aliases) {
    var key, result, value;
    if (!aliases) {
      return null;
    }
    result = {};
    for (key in aliases) {
      value = aliases[key];
      result[this._normalizeExtension(key)] = this._normalizeExtensions(value);
    }
    return result;
  };
  Lookup.prototype.escape = function(string) {
    return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };
  Lookup.prototype.escapeEach = function() {
    var args, i, item, result, _len;
    result = [];
    args = arguments[0];
    for (i = 0, _len = args.length; i < _len; i++) {
      item = args[i];
      result[i] = this.escape(item);
    }
    return result;
  };
  Lookup.prototype.entries = function(path) {
    var entries, entry, result, _i, _len;
    if (!this._entries[path]) {
      result = [];
      if (Metro.Support.Path.exists(path)) {
        entries = Metro.Support.Path.entries(path);
      } else {
        entries = [];
      }
      for (_i = 0, _len = entries.length; _i < _len; _i++) {
        entry = entries[_i];
        if (!entry.match(/^\.|~$|^\#.*\#$/)) {
          result.push(entry);
        }
      }
      this._entries[path] = result.sort();
    }
    return this._entries[path];
  };
  Lookup.prototype.pattern = function(source) {
    var _base, _ref2;
    return (_ref2 = (_base = this.patterns)[source]) != null ? _ref2 : _base[source] = this.buildPattern(source);
  };
  Lookup.prototype.buildPattern = function(source) {
    var extension, extensions, slug;
    extension = Metro.Support.Path.extname(source);
    slug = Metro.Support.Path.basename(source, extension);
    extensions = [extension];
    if (this.aliases[extension]) {
      extensions = extensions.concat(this.aliases[extension]);
    }
    return new RegExp("^" + this.escape(slug) + "(?:" + this.escapeEach(extensions).join("|") + ").*");
  };
  return Lookup;
})();
module.exports = Metro.Support.Lookup;
Metro.Support.Naming = (function() {
  function Naming() {}
  return Naming;
})();
module.exports = Metro.Support.Naming;
Metro.Support.Number = {
  isInt: function(n) {
    return n === +n && n === (n | 0);
  },
  isFloat: function(n) {
    return n === +n && n !== (n | 0);
  }
};
module.exports = Metro.Support.Number;
_ = require('underscore');
Metro.Support.Object = {
  isA: function(object, isa) {},
  isHash: function() {
    var object;
    object = arguments[0] || this;
    return _.isObject(object) && !(_.isFunction(object) || _.isArray(object));
  },
  isPresent: function(object) {
    var key, value;
    for (key in object) {
      value = object[key];
      return true;
    }
    return false;
  },
  isBlank: function(object) {
    var key, value;
    for (key in object) {
      value = object[key];
      return false;
    }
    return true;
  }
};
module.exports = Metro.Support.Object;
fs = require('fs');
crypto = require('crypto');
mime = require('mime');
_path = require('path');
util = require('util');
Metro.Support.Path = (function() {
  Path.stat = function(path) {
    return fs.statSync(path);
  };
  Path.digestHash = function() {
    return crypto.createHash('md5');
  };
  Path.digest = function(path, data) {
    var stat;
    stat = this.stat(path);
    if (stat == null) {
      return;
    }
    if (data == null) {
      data = this.read(path);
    }
    if (data == null) {
      return;
    }
    return this.digestHash().update(data).digest("hex");
  };
  Path.read = function(path) {
    return fs.readFileSync(path, "utf-8");
  };
  Path.readAsync = function(path, callback) {
    return fs.readFile(path, "utf-8", callback);
  };
  Path.slug = function(path) {
    return this.basename(path).replace(new RegExp(this.extname(path) + "$"), "");
  };
  Path.contentType = function(path) {
    return mime.lookup(path);
  };
  Path.mtime = function(path) {
    return this.stat(path).mtime;
  };
  Path.size = function(path) {
    return this.stat(path).size;
  };
  Path.expandPath = function(path) {
    return _path.normalize(path);
  };
  Path.absolutePath = function(path, root) {
    if (root == null) {
      root = this.pwd();
    }
    if (path.charAt(0) !== "/") {
      path = root + "/" + path;
    }
    return _path.normalize(path);
  };
  Path.relativePath = function(path, root) {
    if (root == null) {
      root = this.pwd();
    }
    if (path[0] === ".") {
      path = this.join(root, path);
    }
    return _path.normalize(path.replace(new RegExp("^" + Metro.Support.RegExp.escape(root + "/")), ""));
  };
  Path.pwd = function() {
    return process.cwd();
  };
  Path.basename = function() {
    return _path.basename.apply(_path, arguments);
  };
  Path.extname = function(path) {
    return _path.extname(path);
  };
  Path.exists = function(path) {
    return _path.existsSync(path);
  };
  Path.existsAsync = function(path, callback) {
    return _path.exists(path, callback);
  };
  Path.extensions = function(path) {
    return this.basename(path).match(/(\.\w+)/g);
  };
  Path.join = function() {
    return Array.prototype.slice.call(arguments, 0, arguments.length).join("/").replace(/\/+/, "/");
  };
  Path.isUrl = function(path) {
    return !!path.match(/^[-a-z]+:\/\/|^cid:|^\/\//);
  };
  Path.isAbsolute = function(path) {
    return path.charAt(0) === "/";
  };
  Path.glob = function() {
    var path, paths, result, _i, _len;
    paths = Metro.Support.Array.extractArgs(arguments);
    result = [];
    for (_i = 0, _len = paths.length; _i < _len; _i++) {
      path = paths[_i];
      if (this.exists(path)) {
        result = result.concat(require('findit').sync(path));
      }
    }
    return result;
  };
  Path.files = function() {
    var path, paths, result, self, _i, _len;
    paths = this.glob.apply(this, arguments);
    result = [];
    self = this;
    for (_i = 0, _len = paths.length; _i < _len; _i++) {
      path = paths[_i];
      if (self.isFile(path)) {
        result.push(path);
      }
    }
    return result;
  };
  Path.directories = function() {
    var path, paths, result, self, _i, _len;
    paths = this.glob.apply(this, arguments);
    result = [];
    self = this;
    for (_i = 0, _len = paths.length; _i < _len; _i++) {
      path = paths[_i];
      if (self.isDirectory(path)) {
        result.push(path);
      }
    }
    return result;
  };
  Path.entries = function(path) {
    return fs.readdirSync(path);
  };
  Path.dirname = function(path) {
    return _path.dirname(path);
  };
  Path.isDirectory = function(path) {
    return this.stat(path).isDirectory();
  };
  Path.isFile = function(path) {
    return !this.isDirectory(path);
  };
  Path.copy = function(from, to) {
    var newFile, oldFile;
    oldFile = fs.createReadStream(from);
    newFile = fs.createWriteStream(to);
    return newFile.once('open', function(data) {
      return util.pump(oldFile, newFile);
    });
  };
  Path.watch = function() {};
  function Path(path) {
    this.path = path;
    this.previousMtime = this.mtime();
  }
  Path.prototype.stale = function() {
    var newMtime, oldMtime, result;
    oldMtime = this.previousMtime;
    newMtime = this.mtime();
    result = oldMtime.getTime() !== newMtime.getTime();
    this.previousMtime = newMtime;
    return result;
  };
  Path.prototype.stat = function() {
    return this.constructor.stat(this.path);
  };
  Path.prototype.contentType = function() {
    return this.constructor.contentType(this.path);
  };
  Path.prototype.mtime = function() {
    return this.constructor.mtime(this.path);
  };
  Path.prototype.size = function() {
    return this.constructor.size(this.path);
  };
  Path.prototype.digest = function() {
    return this.constructor.digest(this.path);
  };
  Path.prototype.extensions = function() {
    return this.constructor.extensions(this.path);
  };
  Path.prototype.extension = function() {
    return this.constructor.extname(this.path);
  };
  Path.prototype.read = function() {
    return this.constructor.read(this.path);
  };
  Path.prototype.readAsync = function(callback) {
    return this.constructor.readAsync(this.path, callback);
  };
  Path.prototype.absolutePath = function() {
    return this.constructor.absolutePath(this.path);
  };
  Path.prototype.relativePath = function() {
    return this.constructor.relativePath(this.path);
  };
  return Path;
})();
module.exports = Metro.Support.Path;
Metro.Support.RegExp = {
  escape: function(string) {
    return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  },
  escapeEach: function() {
    var args, i, item, result, _len;
    result = [];
    args = arguments[0];
    for (i = 0, _len = args.length; i < _len; i++) {
      item = args[i];
      result[i] = this.escape(item);
    }
    return result;
  }
};
module.exports = Metro.Support.RegExp;
_ = require("underscore");
_.mixin(require("underscore.string"));
lingo = require("lingo").en;
Metro.Support.String = {
  camelize: function() {
    return _.camelize("_" + (arguments[0] || this));
  },
  constantize: function() {
    return global[this.camelize.apply(this, arguments)];
  },
  underscore: function() {
    return _.underscored(arguments[0] || this);
  },
  titleize: function() {
    return _.titleize(arguments[0] || this);
  }
};
module.exports = String;
Metro.Support.Time = (function() {
  Time._lib = function() {
    return require('moment');
  };
  Time.zone = function() {
    return this;
  };
  Time.now = function() {
    return new this();
  };
  function Time() {
    this.moment = this.constructor._lib()();
  }
  Time.prototype.toString = function() {
    return this._date.toString();
  };
  Time.prototype.beginningOfWeek = function() {};
  Time.prototype.week = function() {
    return parseInt(this.moment.format("w"));
  };
  Time.prototype.dayOfWeek = function() {
    return this.moment.day();
  };
  Time.prototype.dayOfMonth = function() {
    return parseInt(this.moment.format("D"));
  };
  Time.prototype.dayOfYear = function() {
    return parseInt(this.moment.format("DDD"));
  };
  Time.prototype.meridiem = function() {
    return this.moment.format("a");
  };
  Time.prototype.zoneName = function() {
    return this.moment.format("z");
  };
  Time.prototype.strftime = function(format) {
    return this.moment.format(format);
  };
  Time.prototype.beginningOfDay = function() {
    this.moment.seconds(0);
    return this;
  };
  Time.prototype.beginningOfWeek = function() {
    this.moment.seconds(0);
    this.moment.subtract('days', 6 - this.dayOfWeek());
    return this;
  };
  Time.prototype.beginningOfMonth = function() {
    this.moment.seconds(0);
    this.moment.subtract('days', 6 - this.dayOfMonth());
    return this;
  };
  Time.prototype.beginningOfYear = function() {
    this.moment.seconds(0);
    return this.moment.subtract('days', 6 - this.dayOfMonth());
  };
  Time.prototype.toDate = function() {
    return this.moment._d;
  };
  return Time;
})();
Metro.Support.Time.TimeWithZone = (function() {
  __extends(TimeWithZone, Metro.Support.Time);
  function TimeWithZone() {
    TimeWithZone.__super__.constructor.apply(this, arguments);
  }
  return TimeWithZone;
})();
module.exports = Metro.Support.Time;
Metro.Support = {};
require('./support/array');
require('./support/class');
require('./support/callbacks');
require('./support/concern');
require('./support/dependencies');
require('./support/ie');
require('./support/i18n');
require('./support/lookup');
require('./support/number');
require('./support/object');
require('./support/path');
require('./support/string');
require('./support/regexp');
require('./support/time');
module.exports = Metro.Support;
Field = (function() {
  function Field() {}
  return Field;
})();
Form = (function() {
  function Form() {}
  return Form;
})();
Input = (function() {
  function Input() {}
  return Input;
})();
Link = (function() {
  __extends(Link, Metro.Components.Base);
  function Link() {
    Link.__super__.constructor.apply(this, arguments);
  }
  Link.prototype.render = function() {};
  return Link;
})();
Helpers = (function() {
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
module.exports = Helpers;
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
    var file, path, templatePaths, _i, _len, _ref2;
    file = require("file");
    templatePaths = this.paths;
    _ref2 = Metro.View.loadPaths;
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      path = _ref2[_i];
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
module.exports = Metro.View.Lookup;
Rendering = (function() {
  function Rendering() {}
  Rendering.prototype.render = function() {
    var args, callback, options, self, template, _ref2;
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
    if (options == null) {
      options = {};
    }
    options.locals = this.context(options);
    if ((_ref2 = options.type) == null) {
      options.type = Metro.View.engine;
    }
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
module.exports = Rendering;
Metro.View = (function() {
  function View(controller) {
    this.controller = controller || (new Metro.Controller);
  }
  return View;
})();
require('./view/helpers');
require('./view/lookup');
require('./view/rendering');
Metro.View.include(Metro.View.Lookup);
Metro.View.include(Metro.View.Rendering);
module.exports = View;
global._ = require('underscore');
_.mixin(require("underscore.string"));
module.exports = global.Metro = Metro = {};
require('./metro/support');
require('./metro/asset');
require('./metro/application');
require('./metro/store');
require('./metro/model');
require('./metro/view');
require('./metro/controller');
require('./metro/route');
require('./metro/presenter');
require('./metro/middleware');
require('./metro/command');
require('./metro/generator');
require('./metro/spec');
Metro.configuration = null;
Metro.logger = new (require("common-logger"))({
  colorized: true
});
Metro.root = process.cwd();
Metro.publicPath = process.cwd() + "/public";
Metro.env = "test";
Metro.port = 1597;
Metro.cache = null;
Metro.version = "0.2.0";
Metro.configure = function(callback) {
  return callback.apply(this);
};
Metro.env = function() {
  return process.env();
};
Metro.application = Metro.Application.instance;
Metro.globalize = function() {
  var key, value, _ref2, _results;
  _ref2 = Metro.Support.Class;
  _results = [];
  for (key in _ref2) {
    value = _ref2[key];
    _results.push(Function.prototype[key] = value);
  }
  return _results;
};
Metro.raise = function() {
  var args, i, message, node, path, _i, _len;
  args = Array.prototype.slice.call(arguments);
  path = args.shift().split(".");
  message = Metro.locale.en;
  for (_i = 0, _len = path.length; _i < _len; _i++) {
    node = path[_i];
    message = message[node];
  }
  i = 0;
  message = message.replace(/%s/g, function() {
    return args[i++];
  });
  throw new Error(message);
};
Metro.initialize = Metro.Application.initialize;
Metro.teardown = Metro.Application.teardown;
Metro.get = function() {
  return Metro.application().client().get;
};
Metro.locale = {
  en: {
    errors: {
      missingCallback: "You must pass a callback to %s.",
      missingOption: "You must pass in the '%s' option to %s.",
      notFound: "%s not found.",
      store: {
        missingAttribute: "Missing %s in %s for '%s'"
      },
      asset: {
        notFound: "Asset not found: '%s'\n  Lookup paths: [\n%s\n  ]"
      }
    }
  }
};
Metro.engine = function(extension) {
  var _base, _ref2, _ref3;
  if ((_ref2 = this._engine) == null) {
    this._engine = {};
  }
  return (_ref3 = (_base = this._engine)[extension]) != null ? _ref3 : _base[extension] = (function() {
    switch (extension) {
      case "less":
        return new (require("shift").Less);
      case "styl":
      case "stylus":
        return new (require("shift").Stylus);
      case "coffee":
      case "coffee-script":
        return new (require("shift").CoffeeScript);
      case "jade":
        return new (require("shift").Jade);
      case "mustache":
        return new (require("shift").Mustache);
    }
  })();
};