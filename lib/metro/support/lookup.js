(function() {
  var Lookup;
  Lookup = (function() {
    Lookup.prototype.root = null;
    Lookup.prototype.extensions = null;
    Lookup.prototype.aliases = null;
    Lookup.prototype.paths = null;
    Lookup.prototype.patterns = null;
    function Lookup(options) {
      if (options == null) {
        options = {};
      }
      this.root = options.root;
      this.extensions = this._normalize_extensions(options.extensions);
      this.aliases = this._normalize_aliases(options.aliases);
      this.paths = this._normalize_paths(options.paths);
      this.patterns = {};
      this._entries = {};
    }
    Lookup.prototype.find = function(source) {
      var basename, directory, full_path, path, result, _i, _len, _ref;
      source = this._normalize_source(source);
      result = [];
      _ref = this.paths;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        path = _ref[_i];
        full_path = Metro.Support.File.join(path, source);
        directory = Metro.Support.File.dirname(full_path);
        basename = Metro.Support.File.basename(full_path);
        if (this.paths_include(directory)) {
          result = result.concat(this.match(directory, basename));
        }
      }
      return result;
    };
    Lookup.prototype.paths_include = function(directory) {
      var path, _i, _len, _ref;
      _ref = this.paths;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        path = _ref[_i];
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
        if (!!entry.match(pattern)) {
          matches.push(entry);
        }
      }
      matches = this.sort(matches, basename);
      for (i = 0, _len2 = matches.length; i < _len2; i++) {
        match = matches[i];
        matches[i] = Metro.Support.File.join(directory, match);
      }
      return matches;
    };
    Lookup.prototype.sort = function(matches, basename) {
      return matches;
    };
    Lookup.prototype._normalize_paths = function(paths) {
      var path, result, _i, _len;
      result = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        result.push(Metro.Support.File.expand_path(path));
      }
      return result;
    };
    Lookup.prototype._normalize_source = function(source) {
      return source.replace(/^\/?/, "");
    };
    Lookup.prototype._normalize_extension = function(extension) {
      return extension.replace(/^\.?/, ".");
    };
    Lookup.prototype._normalize_extensions = function(extensions) {
      var extension, result, _i, _len;
      result = [];
      for (_i = 0, _len = extensions.length; _i < _len; _i++) {
        extension = extensions[_i];
        result.push(this._normalize_extension(extension));
      }
      return result;
    };
    Lookup.prototype._normalize_aliases = function(aliases) {
      var key, result, value;
      if (!aliases) {
        return null;
      }
      result = {};
      for (key in aliases) {
        value = aliases[key];
        result[this._normalize_extension(key)] = this._normalize_extensions(value);
      }
      return result;
    };
    Lookup.prototype.escape = function(string) {
      return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };
    Lookup.prototype.escape_each = function() {
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
        entries = Metro.Support.File.entries(path);
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
      var _base, _ref;
      return (_ref = (_base = this.patterns)[source]) != null ? _ref : _base[source] = this.build_pattern(source);
    };
    Lookup.prototype.build_pattern = function(source) {
      var extension, extensions, slug;
      extension = Metro.Support.File.extname(source);
      slug = Metro.Support.File.basename(source, extension);
      extensions = [extension];
      if (this.aliases[extension]) {
        extensions = extensions.concat(this.aliases[extension]);
      }
      return new RegExp("^" + this.escape(slug) + "(?:" + this.escape_each(extensions).join("|") + ").*");
    };
    return Lookup;
  })();
  module.exports = Lookup;
}).call(this);
