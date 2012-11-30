var fs, _path;

fs = require('fs');

_path = require('path');

Tower.hashingAlgorithm = 'md5';

Tower._.extend(Tower, {
  PATHS: {},
  statSync: function(path) {
    return fs.statSync(path);
  },
  stat: function(path, callback) {
    return fs.stat(path, callback);
  },
  readFile: function() {
    return fs.readFile.apply(fs, arguments);
  },
  readFileSync: function() {
    return fs.readFileSync.apply(fs, arguments);
  },
  writeFile: function(path, data, callback) {
    this.createDirectorySync(this.dirname(path));
    return fs.writeFile(path, data, callback);
  },
  writeFileSync: function(path) {
    this.createDirectorySync(this.dirname(path));
    return fs.writeFileSync.apply(fs, arguments);
  },
  removeFile: function(path, callback) {
    return fs.unlink(path, callback);
  },
  removeFileSync: function(path) {
    return fs.unlinkSync(path);
  },
  createDirectorySync: function(path, mode) {
    return Tower.module('wrench').mkdirSyncRecursive(path, mode);
  },
  removeDirectorySync: function(path) {
    return Tower.module('wrench').rmdirSyncRecursive(path, true);
  },
  copyDirectorySync: function(from, to, options) {
    if (options == null) {
      options = {};
    }
    return Tower.module('wrench').copyDirSyncRecursive(from, to, options);
  },
  copyFile: function(from, to) {
    var newFile, oldFile;
    oldFile = fs.createReadStream(from);
    newFile = fs.createWriteStream(to);
    return newFile.once('open', function(data) {
      return util.pump(oldFile, newFile);
    });
  },
  mkdirpSync: function(dir) {
    dir = _path.resolve(_path.normalize(dir));
    try {
      return fs.mkdirSync(dir, parseInt('0755'));
    } catch (e) {
      switch (e.errno) {
        case 47:
          break;
        case 34:
          this.mkdirpSync(_path.dirname(dir));
          return this.mkdirpSync(dir);
        default:
          throw e;
      }
    }
  },
  entries: function(path, callback) {
    return fs.readdir(path, callback);
  },
  entriesSync: function(path) {
    return fs.readdirSync(path);
  },
  contentType: function(path) {
    return Tower.module('mime').lookup(path);
  },
  mtime: function(path, callback) {
    return this._statProperty(path, 'mtime', callback);
  },
  mtimeSync: function(path) {
    return this.statSync(path).mtime;
  },
  size: function(path, callback) {
    return this._statProperty(path, 'size', callback);
  },
  sizeSync: function(path) {
    return this.statSync(path).size;
  },
  exists: function(path, callback) {
    return fs.exists(path, callback);
  },
  existsSync: function(path) {
    return fs.existsSync(path);
  },
  glob: function() {
    var found, index, item, path, paths, result, wrench, _i, _j, _len, _len1;
    paths = _.flatten(_.args(arguments));
    wrench = Tower.module('wrench');
    result = [];
    for (_i = 0, _len = paths.length; _i < _len; _i++) {
      path = paths[_i];
      if (this.existsSync(path)) {
        found = wrench.readdirSyncRecursive(path);
        for (index = _j = 0, _len1 = found.length; _j < _len1; index = ++_j) {
          item = found[index];
          result.push(path + _path.sep + item);
        }
      }
    }
    return result;
  },
  files: function() {
    var path, paths, result, _i, _len;
    paths = this.glob.apply(this, arguments);
    result = [];
    for (_i = 0, _len = paths.length; _i < _len; _i++) {
      path = paths[_i];
      if (this.isFileSync(path)) {
        result.push(path);
      }
    }
    return result;
  },
  directories: function() {
    var path, paths, result, _i, _len;
    paths = this.glob.apply(this, arguments);
    result = [];
    for (_i = 0, _len = paths.length; _i < _len; _i++) {
      path = paths[_i];
      if (this.isDirectorySync(path) && !(path === '.' || path === '..')) {
        result.push(path);
      }
    }
    return result;
  },
  isDirectory: function(path, callback) {
    return this._statMethod(path, 'isDirectory', callback);
  },
  isDirectorySync: function(path) {
    return this.statSync(path).isDirectory();
  },
  isFile: function(path, callback) {
    var _this = this;
    return this._statMethod(path, 'isDirectory', function(error, isDirectory) {
      return callback.call(_this, error, !isDirectory);
    });
  },
  isFileSync: function(path) {
    return !this.isDirectorySync(path);
  },
  chmod: function(path, mode) {
    return Tower.module('wrench').chmodSyncRecursive(path, mode);
  },
  chown: function(path, uid, gid) {
    return Tower.module('wrench').chownSyncRecursive(path, uid, gid);
  },
  expandPath: function(path, root) {
    return this.absolutePath(path, root);
  },
  normalizePath: function(path) {
    return _path.normalize(path);
  },
  absolutePath: function(path, root) {
    if (root == null) {
      root = this.pwd();
    }
    if (path.charAt(0) !== '/') {
      path = root + '/' + path;
    }
    return _path.normalize(path);
  },
  relativePath: function(path, root) {
    if (root == null) {
      root = this.pwd();
    }
    return _path.relative(root, path);
  },
  relativePathOld: function(path, root) {
    if (root == null) {
      root = this.pwd();
    }
    if (path[0] === '.') {
      path = this.join(root, path);
    }
    return _path.normalize(path.replace(new RegExp('^' + root.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '/'), ''));
  },
  resolvePath: function(path) {
    return _path.resolve(path);
  },
  extensions: function(path) {
    return this.basename(path).match(/(\.\w+)/g);
  },
  join: function() {
    return _path.join.apply(_path, arguments);
  },
  isUrl: function(path) {
    return !!path.match(/^[-a-z]+:\/\/|^cid:|^\/\//);
  },
  isAbsolute: function(path) {
    return path.charAt(0) === '/';
  },
  pwd: function() {
    return process.cwd();
  },
  basename: function() {
    return _path.basename.apply(_path, arguments);
  },
  dirname: function(path) {
    return _path.dirname(path);
  },
  extname: function(path) {
    return _path.extname(path);
  },
  slug: function(path) {
    return this.basename(path).replace(new RegExp(this.extname(path) + '$'), '');
  },
  digestFileSync: function(path) {
    return this.pathWithFingerprint(path, this.digestString(this.readFileSync(path, 'utf-8')));
  },
  pathFingerprint: function(path) {
    var result;
    result = this.basename(path).match(/-([0-9a-f]{32})\.?/);
    if (result != null) {
      return result[1];
    } else {
      return null;
    }
  },
  pathWithFingerprint: function(path, digest) {
    var oldDigest;
    if (oldDigest = this.pathFingerprint(path)) {
      return path.replace(oldDigest, digest);
    } else {
      return path.replace(/\.(\w+)$/, "-" + digest + ".\$1");
    }
  },
  digestHash: function() {
    return Tower.module('crypto').createHash(Tower.hashingAlgorithm);
  },
  fingerprint: function(string) {
    return this.digestHash().update(string).digest('hex');
  },
  stale: function(path) {
    var newMtime, oldMtime, result;
    oldMtime = this.PATHS[path];
    newMtime = this.mtime(path);
    result = !!(oldMtime && oldMtime.getTime() !== newMtime.getTime());
    this.PATHS[path] = newMtime;
    return result;
  },
  touch: function(path, callback) {
    var _this = this;
    return exec("touch -m " + (path.replace(/\ /, '\\ ')), function(error) {
      if (callback) {
        return callback.call(_this, error);
      } else {
        if (error) {
          throw error;
        }
      }
    });
  },
  _statProperty: function(path, property, callback) {
    var _this = this;
    return this.stat(path, function(error, stat) {
      if (error) {
        return callback.call(_this, error);
      }
      return callback.call(_this, null, stat[property]);
    });
  },
  _statMethod: function(path, method, callback) {
    var _this = this;
    return this.stat(path, function(error, stat) {
      if (error) {
        return callback.call(_this, error);
      }
      return callback.call(_this, null, stat[method]());
    });
  }
});
