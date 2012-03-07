var File, fs, rest, _path, _url;
var __slice = Array.prototype.slice;

File = require('pathfinder').File;

_path = require('path');

fs = require('fs');

_url = require('url');

rest = require('restler');

File.mkdirpSync = function(dir) {
  dir = _path.resolve(_path.normalize(dir));
  try {
    return fs.mkdirSync(dir, 0755);
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

Tower.Generator.Actions = {
  get: function(url, to) {
    var error, path;
    var _this = this;
    path = this.destinationPath(to);
    error = function() {
      return console.log("Error downloading " + url);
    };
    return rest.get(url).on('error', error).on('complete', function(data) {
      _this.log("create", path);
      return File.write(path, data);
    });
  },
  log: function(action, path) {
    var key;
    if (action === "create" && File.exists(path)) return;
    key = (function() {
      switch (action) {
        case "create":
          return '   \x1b[36mcreate\x1b[0m';
        case "destroy":
          return '   \x1b[36mremove\x1b[0m';
      }
    })();
    return console.log("" + key + " : " + (File.relativePath(path)));
  },
  injectIntoFile: function(file, options, callback) {},
  readFile: function(file) {},
  createFile: function(path, data) {
    path = this.destinationPath(path);
    this.log("create", path);
    return File.write(path, data);
  },
  destinationPath: function(path) {
    return File.join(this.destinationRoot, this.currentDestinationDirectory, path);
  },
  file: function(file, data) {
    return this.createFile(file, data);
  },
  createDirectory: function(name) {
    var path;
    path = this.destinationPath(name);
    this.log("create", path);
    return File.mkdirpSync(path);
  },
  directory: function(name) {
    return this.createDirectory(name);
  },
  emptyDirectory: function(name) {},
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
    return this.createFile(destination, data, options);
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
    if (options == null) options = {};
    return require('ejs').render(string, options);
  },
  chmod: function(path, mode, options) {
    if (options == null) options = {};
    if (behavior !== "invoke") return;
    path = File.expandPath(path, destination_root);
    this.sayStatus("chmod", this.relativeToOriginalDestinationRoot(path), options.fetch("verbose", true));
    if (!options.pretend) return FileUtils.chmod_R(mode, path);
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
    if (behavior !== "invoke") return;
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
  uncommentLines: function(path, flag) {
    flag = flag.hasOwnProperty("source") ? flag.source : flag;
    return this.gsubFile.apply(this, [path, /^(\s*)#\s*(.*#{flag})/, '\1\2'].concat(__slice.call(args)));
  },
  commentLines: function(path, flag) {
    var args, block, options, _ref;
    _ref = this._args(arguments, 2), args = _ref.args, options = _ref.options, block = _ref.block;
    flag = flag.hasOwnProperty("source") ? flag.source : flag;
    return this.gsubFile.apply(this, [path, /^(\s*)([^#|\n]*#{flag})/, '\1# \2'].concat(__slice.call(args)));
  },
  removeFile: function(path, options) {
    if (options == null) options = {};
    if (behavior !== "invoke") return;
    path = File.expandPath(path, destination_root);
    this.sayStatus("remove", this.relativeToOriginalDestinationRoot(path), options.fetch("verbose", true));
    if (!options.pretend && (typeof File.exists === "function" ? File.exists(path) : void 0)) {
      return FileUtils.rm_rf(path);
    }
  },
  removeDir: function() {
    return this.removeFile.apply(this, arguments);
  },
  _invokeWithConflictCheck: function(block) {
    if (File.exists(path)) {
      this._onConflictBehavior(block);
    } else {
      this.sayStatus("create", "green");
      if (!this.pretend()) block.call;
    }
    return destination;
  },
  _onConflictBehavior: function(block) {
    return this.sayStatus("exist", "blue", block);
  },
  _args: function(args, index) {
    var block, options;
    if (index == null) index = 0;
    args = Array.prototype.slice.call(args, index, args.length);
    if (typeof args[args.length - 1] === "function") {
      block = args.pop();
    } else {
      block = null;
    }
    if (Tower.Support.Object.isHash(args[args.length - 1])) {
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

module.exports = Tower.Generator.Actions;
