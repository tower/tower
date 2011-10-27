(function() {
  var Lookup;
  Lookup = (function() {
    function Lookup() {}
    Lookup.digests = function() {
      var _ref;
      return (_ref = this._digests) != null ? _ref : this._digests = {};
    };
    Lookup.stylesheet_lookup = function() {
      var _ref;
      return (_ref = this._stylesheet_lookup) != null ? _ref : this._stylesheet_lookup = this._create_lookup(this.config.stylesheet_directory, this.config.stylesheet_extensions, this.config.stylesheet_aliases);
    };
    Lookup.javascript_lookup = function() {
      var _ref;
      return (_ref = this._javascript_lookup) != null ? _ref : this._javascript_lookup = this._create_lookup(this.config.javascript_directory, this.config.javascript_extensions, this.config.javascript_aliases);
    };
    Lookup.image_lookup = function() {
      var _ref;
      return (_ref = this._image_lookup) != null ? _ref : this._image_lookup = this._create_lookup(this.config.image_directory, this.config.image_extensions, this.config.image_aliases);
    };
    Lookup.font_lookup = function() {
      var _ref;
      return (_ref = this._font_lookup) != null ? _ref : this._font_lookup = this._create_lookup(this.config.font_directory, this.config.font_extensions, this.config.font_aliases);
    };
    Lookup._create_lookup = function(directory, extensions, aliases) {
      var path, paths, _i, _len, _ref;
      paths = [];
      _ref = this.config.load_paths;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        path = _ref[_i];
        path = this.join(path, directory);
        paths.push(path);
        paths = paths.concat(this.directories(path));
      }
      return new Metro.Support.Lookup({
        root: Metro.root,
        paths: paths,
        extensions: extensions,
        aliases: aliases
      });
    };
    Lookup.paths_for = function(extension) {
      return this.lookup_for(extension).paths;
    };
    Lookup.lookup_for = function(extension) {
      switch (extension) {
        case ".css":
          return this.stylesheet_lookup();
        case ".js":
          return this.javascript_lookup();
        default:
          return [];
      }
    };
    Lookup.digest_for = function(source) {
      return this.digests[source] || source;
    };
    Lookup.compute_public_path = function(source, options) {
      var extension;
      if (options == null) {
        options = {};
      }
      if (this.is_url(source)) {
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
    Lookup.compute_asset_host = function() {
      if (typeof this.config.host === "function") {
        return this.config.host.call(this);
      } else {
        return this.config.host;
      }
    };
    Lookup.normalize_extension = function(source, extension) {
      return this.basename(source, extension) + extension;
    };
    Lookup.normalize_asset_path = function(source, options) {
      if (options == null) {
        options = {};
      }
      if (this.is_absolute(source)) {
        return source;
      } else {
        source = this.join(options.directory, source);
        if (options.digest !== false) {
          source = this.digest_for(source);
        }
        if (!source.match(/^\//)) {
          source = "/" + source;
        }
        return source;
      }
    };
    Lookup.normalize_relative_url_root = function(source, relative_url_root) {
      if (relative_url_root && !source.match(new RegExp("^" + relative_url_root + "/"))) {
        return "" + relative_url_root + source;
      } else {
        return source;
      }
    };
    Lookup.normalize_host_and_protocol = function(source, protocol) {
      var host;
      host = this.compute_asset_host(source);
      if (host) {
        return "" + host + source;
      } else {
        return source;
      }
    };
    Lookup.find = function(source, options) {
      var lookup, paths, pattern, _ref;
      if (options == null) {
        options = {};
      }
      source = source.replace(this.path_pattern(), "");
      if ((_ref = options.extension) == null) {
        options.extension = this.extname(source);
      }
      if (options.extension === "") {
        Metro.raise("errors.missing_option", "extension", "Asset#find");
      }
      pattern = "(?:" + Metro.Support.Lookup.prototype.escape(options.extension) + ")?$";
      source = source.replace(new RegExp(pattern), options.extension);
      lookup = this.lookup_for(options.extension);
      if (lookup) {
        paths = lookup.find(source);
      }
      if (!(paths && paths.length > 0)) {
        return null;
      }
      return new Metro.Asset(paths[0], options.extension);
    };
    Lookup.match = function(path) {
      return !!path.match(this.path_pattern());
    };
    Lookup.path_pattern = function() {
      var _ref;
      return (_ref = this._path_pattern) != null ? _ref : this._path_pattern = new RegExp("^/(assets|" + this.config.stylesheet_directory + "|" + this.config.javascript_directory + "|" + this.config.image_directory + "|" + this.config.font_directory + ")/");
    };
    return Lookup;
  })();
  module.exports = Lookup;
}).call(this);
