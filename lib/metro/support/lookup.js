(function() {
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
      var _base;
      return (_base = this.patterns)[source] || (_base[source] = this.buildPattern(source));
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
}).call(this);
