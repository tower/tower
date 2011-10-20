(function() {
  var Environment, _;
  _ = require('underscore');
  Environment = (function() {
    function Environment() {}
    Environment.prototype.public_path = "./public";
    Environment.prototype.load_paths = ["./app/assets"];
    Environment.prototype.asset_directory = "assets";
    Environment.prototype.stylesheet_directory = "stylesheets";
    Environment.prototype.stylesheet_extensions = ["css", "styl", "scss", "less"];
    Environment.prototype.javascript_directory = "javascripts";
    Environment.prototype.javascript_extensions = ["js", "coffee", "ejs"];
    Environment.prototype.asset_host = null;
    Environment.prototype.relative_root_url = null;
    Environment.prototype.stylesheet_lookup = function() {
      var directory, extensions, paths, _ref;
      directory = this.stylesheet_directory;
      extensions = this.stylesheet_extensions;
      paths = _.map(this.load_paths, function(path) {
        return Metro.Support.Path.join(path, directory);
      });
      return (_ref = this._stylesheet_lookup) != null ? _ref : this._stylesheet_lookup = new Metro.Support.Lookup({
        root: Metro.root,
        paths: paths,
        extensions: extensions
      });
    };
    Environment.prototype.javascript_lookup = function() {
      var directory, extensions, paths, _ref;
      directory = this.javascript_directory;
      extensions = this.javascript_extensions;
      paths = _.map(this.load_paths, function(path) {
        return Metro.Support.Path.join(path, directory);
      });
      return (_ref = this._javascript_lookup) != null ? _ref : this._javascript_lookup = new Metro.Support.Lookup({
        root: Metro.root,
        paths: paths,
        extensions: extensions
      });
    };
    Environment.prototype.digest = function(source) {
      return this.digests[source] || source;
    };
    Environment.prototype.compute_public_path = function(source, options) {
      var extension;
      if (options == null) {
        options = {};
      }
      if (Metro.Support.Path.is_url(source)) {
        return source;
      }
      extension = options.extension;
      if (extension) {
        source = this.normalize_extension(source, extension);
      }
      source = this.normalize_asset_path(source, options);
      source = this.normalize_relative_url_root(source, this.relative_url_root);
      source = this.normalize_host_and_protocol(source, options.protocol);
      return source;
    };
    Environment.prototype.compute_asset_host = function() {
      if (typeof this.asset_host === "function") {
        return this.asset_host.call(this);
      } else {
        return this.asset_host;
      }
    };
    Environment.prototype.normalize_extension = function(source, extension) {
      return Metro.Support.Path.slug(source) + ("." + extension);
    };
    Environment.prototype.normalize_asset_path = function(source, options) {
      if (options == null) {
        options = {};
      }
      if (Metro.Support.Path.is_absolute(source)) {
        return source;
      } else {
        source = Metro.Support.Path.join(options.directory, source);
        if (options.digest !== false) {
          source = this.digest(source);
        }
        if (!source.match(/^\//)) {
          source = "/" + source;
        }
        return source;
      }
    };
    Environment.prototype.normalize_relative_url_root = function(source, relative_url_root) {
      if (relative_url_root && !source.match(new RegExp("^" + relative_url_root + "/"))) {
        return "" + relative_url_root + source;
      } else {
        return source;
      }
    };
    Environment.prototype.normalize_host_and_protocol = function(source, protocol) {
      var host;
      host = this.compute_asset_host(source);
      if (host) {
        return "" + host + source;
      } else {
        return source;
      }
    };
    Environment.prototype.read = function(source, options) {
      if (options == null) {
        options = {};
      }
    };
    Environment.prototype.find = function(source, options) {
      var paths;
      if (options == null) {
        options = {};
      }
      paths = this.lookup(source, options);
      if (!(paths && paths.length > 0)) {
        return null;
      }
      return new Metro.Assets.Asset(paths[0]);
    };
    Environment.prototype.lookup = function(source, options) {
      var _ref;
      if (options == null) {
        options = {};
      }
      source = source.replace(this.path_pattern(), "");
      if ((_ref = options.extension) == null) {
        options.extension = Metro.Support.Path.extname(source).slice(1);
      }
      if (options.extension === "css") {
        return this.stylesheet_lookup().find(source);
      } else if (options.extension === "js") {
        return this.javascript_lookup().find(source);
      } else {
        return [];
      }
    };
    Environment.prototype.match = function(path) {
      return !!path.match(this.path_pattern());
    };
    Environment.prototype.path_pattern = function() {
      var _ref;
      return (_ref = this._path_pattern) != null ? _ref : this._path_pattern = new RegExp("^/(" + this.asset_directory + "|" + this.stylesheet_directory + "|" + this.javascript_directory + ")/");
    };
    return Environment;
  })();
  module.exports = Environment;
}).call(this);
