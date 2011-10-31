(function() {
  var crypto, fs, mime, util, _path;
  Metro.Support = {};
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
      var file, key, _ref, _results;
      _ref = this.keys;
      _results = [];
      for (key in _ref) {
        file = _ref[key];
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
      data || (data = this.read(path));
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
}).call(this);
