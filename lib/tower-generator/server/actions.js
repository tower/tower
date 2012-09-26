var File, fs, _path, _url,
  __slice = [].slice;

File = require('pathfinder').File;

_path = require('path');

fs = require('fs');

_url = require('url');

File.mkdirpSync = function(dir) {
  dir = _path.resolve(_path.normalize(dir));
  try {
    return fs.mkdirSync(dir, parseInt("0755"));
  } catch (e) {
    switch (e.errno) {
      case 47:
        break;
      case 34:
        this.mkdirpSync(_path.dirname(dir));
        return this.mkdirpSync(dir);
      default:
        return console.error(e);
    }
  }
};

Tower.GeneratorActions = {
  get: function(url, to, retries) {
    var error, path, request,
      _this = this;
    if (retries == null) {
      retries = 0;
    }
    path = this.destinationPath(to);
    error = function() {
      if (retries > 3) {
        return console.log("Error downloading " + url);
      } else {
        retries++;
        return _this.get(url, to, retries);
      }
    };
    request = Tower.module('superagent').get(url).buffer(true);
    if (url.match('cloud.github.com')) {
      request.set('Pragma', 'no-cache');
      request.set('Cache-Control', 'no-cache');
      request.set('Accept-Encoding', 'gzip,deflate,sdch');
    }
    return request.end(function(response) {
      if (response.ok) {
        _this.log("create", path);
        return File.write(path, response.text);
      } else {
        return error();
      }
    });
  },
  log: function(action, path) {
    var key;
    if (this.silent) {
      return;
    }
    if (action === "create" && File.exists(path)) {
      return;
    }
    key = (function() {
      switch (action) {
        case "destroy":
          return '   \x1b[36mremove\x1b[0m';
        default:
          return '   \x1b[36m' + action + '\x1b[0m';
      }
    })();
    return console.log("" + key + " : " + (File.relativePath(path)));
  },
  injectIntoFile: function(path, options, callback) {
    var data, string;
    string = "";
    if (typeof options === "string") {
      string = options;
      options = callback;
      callback = void 0;
    }
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    options || (options = {});
    path = this.destinationPath(path);
    data = File.read(path);
    if (typeof callback === "function") {
      data = callback.call(this, data);
    } else if (options.before) {
      if (!(options.duplicate === false && data.match(_.regexpEscape(string)))) {
        data = data.replace(options.before, function(_) {
          return "" + string + _;
        });
      }
    } else if (options.after) {
      if (!(options.duplicate === false && data.match(_.regexpEscape(string)))) {
        data = data.replace(options.after, function(_) {
          return "" + _ + string;
        });
      }
    } else {
      data = data + string;
    }
    this.log("update", path);
    return fs.writeFileSync(path, data);
  },
  readFile: function(file, callback) {
    return fs.readFile(file, "utf-8", callback);
  },
  createFile: function(path, data, callback) {
    path = this.destinationPath(path);
    this.log("create", path);
    return File.write(path, data, callback);
  },
  destinationPath: function(path) {
    if (path.match(/^\//)) {
      return path;
    }
    return _path.normalize(File.join(this.destinationRoot, this.currentDestinationDirectory, path));
  },
  createDirectory: function(name, callback) {
    var path, result;
    path = this.destinationPath(name);
    this.log("create", path);
    result = File.mkdirpSync(path);
    if (callback) {
      callback.call(this, result);
    }
    return result;
  },
  emptyDirectory: function(path) {},
  inside: function(directory, sourceDirectory, block) {
    var currentDestinationDirectory, currentSourceDirectory;
    if (typeof sourceDirectory === "function") {
      block = sourceDirectory;
      sourceDirectory = directory;
    }
    currentSourceDirectory = this.currentSourceDirectory;
    this.currentSourceDirectory = File.join(this.currentSourceDirectory, sourceDirectory);
    currentDestinationDirectory = this.currentDestinationDirectory;
    this.currentDestinationDirectory = File.join(this.currentDestinationDirectory, directory);
    block.call(this);
    this.currentSourceDirectory = currentSourceDirectory;
    return this.currentDestinationDirectory = currentDestinationDirectory;
  },
  copyFile: function(source) {
    var args, block, data, destination, options, _ref;
    _ref = this._args(arguments, 1), args = _ref.args, options = _ref.options, block = _ref.block;
    destination = args[0] || source;
    source = File.expandPath(this.findInSourcePaths(source));
    data = File.read(source);
    return this.createFile(destination, data, block);
  },
  linkFile: function(source) {
    var args, block, destination, options, _ref;
    _ref = this._args(arguments, 1), args = _ref.args, options = _ref.options, block = _ref.block;
    destination = args.first || source;
    source = File.expandPath(this.findInSourcePaths(source));
    return this.createLink(destination, source, options);
  },
  template: function(source) {
    var args, block, data, destination, options, _ref;
    _ref = this._args(arguments, 1), args = _ref.args, options = _ref.options, block = _ref.block;
    destination = args[0] || source.replace(/\.tt$/, '');
    source = File.expandPath(this.findInSourcePaths(source));
    data = this.render(File.read(source), this.locals());
    return this.createFile(destination, data, options);
  },
  render: function(string, options) {
    if (options == null) {
      options = {};
    }
    return require('ejs').render(string, options);
  },
  chmod: function(path, mode, options) {
    if (options == null) {
      options = {};
    }
    if (behavior !== "invoke") {
      return;
    }
    path = File.expandPath(path, destination_root);
    this.sayStatus("chmod", this.relativeToOriginalDestinationRoot(path), options.fetch("verbose", true));
    if (!options.pretend) {
      return File.chmod(mode, path);
    }
  },
  prependToFile: function(path) {
    var args, block, options, _ref;
    _ref = this._args(arguments, 1), args = _ref.args, options = _ref.options, block = _ref.block;
    options.merge({
      after: /\A/
    });
    args.push(options);
    args.push(block);
    return this.insertIntoFile.apply(this, [path].concat(__slice.call(args)));
  },
  prependFile: function() {
    return this.prependToFile.apply(this, arguments);
  },
  appendToFile: function(path) {
    var args, block, options, _ref;
    _ref = this._args(arguments, 1), args = _ref.args, options = _ref.options, block = _ref.block;
    options.merge({
      before: /\z/
    });
    args.push(options);
    args.push(block);
    return this.insertIntoFile.apply(this, [path].concat(__slice.call(args)));
  },
  appendFile: function() {
    return this.appendToFile.apply(this, arguments);
  },
  injectIntoClass: function(path, klass) {
    var args, block, options, _ref;
    _ref = this._args(arguments, 2), args = _ref.args, options = _ref.options, block = _ref.block;
    options.merge({
      after: /class #{klass}\n|class #{klass} .*\n/
    });
    args.push(options);
    args.push(block);
    return this.insertIntoFile.apply(this, [path].concat(__slice.call(args)));
  },
  gsubFile: function(path, flag) {
    var args, block, content, options, _ref;
    if (behavior !== "invoke") {
      return;
    }
    _ref = this._args(arguments, 2), args = _ref.args, options = _ref.options, block = _ref.block;
    path = File.expandPath(path, destination_root);
    this.sayStatus("gsub", this.relativeToOriginalDestinationRoot(path), options.fetch("verbose", true));
    if (!options.pretend) {
      content = File.binread(path);
      content.gsub.apply(content, [flag].concat(__slice.call(args), [block]));
      return File.open(path, 'wb', function(file) {
        return file.write(content);
      });
    }
  },
  removeFile: function(path, options) {
    if (options == null) {
      options = {};
    }
    return path = this.destinationPath(path);
  },
  removeDir: function() {
    return this.removeFile.apply(this, arguments);
  },
  _invokeWithConflictCheck: function(block) {
    if (File.exists(path)) {
      this._onConflictBehavior(block);
    } else {
      this.sayStatus("create", "green");
      if (!this.pretend()) {
        block.call;
      }
    }
    return destination;
  },
  _onConflictBehavior: function(block) {
    return this.sayStatus("exist", "blue", block);
  },
  _args: function(args, index) {
    var block, options;
    if (index == null) {
      index = 0;
    }
    args = Array.prototype.slice.call(args, index, args.length);
    if (typeof args[args.length - 1] === "function") {
      block = args.pop();
    } else {
      block = null;
    }
    if (_.isHash(args[args.length - 1])) {
      options = args.pop();
    } else {
      options = {};
    }
    return {
      args: args,
      options: options,
      block: block
    };
  },
  findInSourcePaths: function(path) {
    return File.expandPath(File.join(this.sourceRoot, "templates", this.currentSourceDirectory, path));
  }
};

Tower.GeneratorActions.file = Tower.GeneratorActions.createFile;

Tower.GeneratorActions.directory = Tower.GeneratorActions.createDirectory;

module.exports = Tower.GeneratorActions;
