var fs, _, _path,
  __slice = [].slice;

_ = Tower._;

_path = require('path');

fs = require('fs');

fs.mkdirpSync = function(dir) {
  dir = _path.resolve(_path.normalize(dir));
  try {
    return fs.mkdirSync(dir, parseInt('0755'));
  } catch (e) {
    switch (e.errno) {
      case 47:
        break;
      case 34:
        fs.mkdirpSync(_path.dirname(dir));
        return fs.mkdirpSync(dir);
      default:
        return console.error(e);
    }
  }
};

Tower.GeneratorActions = {
  get: function(url, to, retries) {
    var error, path, request, superagent,
      _this = this;
    if (retries == null) {
      retries = 0;
    }
    path = this.destinationPath(to);
    superagent = Tower.module('superagent');
    error = function() {
      if (retries > 3) {
        return console.log("Error downloading " + url);
      } else {
        retries++;
        return _this.get(url, to, retries);
      }
    };
    request = superagent.get(url).buffer(true);
    superagent.parse['application/javascript'] = superagent.parse['text'];
    superagent.parse['binary'] = function(res, fn) {
      res.setEncoding('binary');
      res.text = '';
      res.on('data', function(chunk) {
        return res.text += chunk;
      });
      return res.on('end', fn);
    };
    superagent.parse['image/png'] = superagent.parse['binary'];
    superagent.parse['application/x-shockwave-flash'] = superagent.parse['binary'];
    if (url.match('cloud.github.com')) {
      request.set('Pragma', 'no-cache');
      request.set('Cache-Control', 'no-cache');
      request.set('Accept-Encoding', 'gzip,deflate,sdch');
    }
    return request.end(function(response) {
      if (response.ok) {
        _this.log('create', path);
        if (response.type === 'image/png') {
          return Tower.writeFileSync(path, response.text, 'binary');
        } else {
          return Tower.writeFileSync(path, response.text);
        }
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
    if (action === 'create' && Tower.existsSync(path)) {
      return;
    }
    key = (function() {
      switch (action) {
        case 'destroy':
          return '   \x1b[36mremove\x1b[0m';
        default:
          return '   \x1b[36m' + action + '\x1b[0m';
      }
    })();
    return console.log("" + key + " : " + (_path.relative(process.cwd(), path)));
  },
  injectIntoFile: function(path, options, callback) {
    var data, string;
    string = '';
    if (typeof options === 'string') {
      string = options;
      options = callback;
      callback = void 0;
    }
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    options || (options = {});
    path = this.destinationPath(path);
    data = Tower.readFileSync(path, 'utf-8');
    if (typeof callback === 'function') {
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
    this.log('update', path);
    return Tower.writeFileSync(path, data);
  },
  readFile: function(file, callback) {
    return Tower.readFile(file, 'utf-8', callback);
  },
  createFile: function(path, data, callback) {
    path = this.destinationPath(path);
    this.log('create', path);
    fs.mkdirpSync(_path.dirname(path));
    Tower.writeFileSync(path, data);
    if (typeof callback === 'function') {
      return callback();
    }
  },
  destinationPath: function(path) {
    if (path.match(/^\//)) {
      return path;
    }
    return _path.normalize(_path.join(this.destinationRoot, this.currentDestinationDirectory, path));
  },
  createDirectory: function(name, callback) {
    var path, result;
    path = this.destinationPath(name);
    this.log('create', path);
    result = fs.mkdirpSync(path);
    if (callback) {
      callback.call(this, result);
    }
    return result;
  },
  emptyDirectory: function(path) {},
  inside: function(directory, sourceDirectory, block) {
    var currentDestinationDirectory, currentSourceDirectory;
    if (typeof sourceDirectory === 'function') {
      block = sourceDirectory;
      sourceDirectory = directory;
    }
    currentSourceDirectory = this.currentSourceDirectory;
    this.currentSourceDirectory = Tower.join(this.currentSourceDirectory, sourceDirectory);
    currentDestinationDirectory = this.currentDestinationDirectory;
    this.currentDestinationDirectory = Tower.join(this.currentDestinationDirectory, directory);
    block.call(this);
    this.currentSourceDirectory = currentSourceDirectory;
    return this.currentDestinationDirectory = currentDestinationDirectory;
  },
  copyFile: function(source) {
    var args, block, data, destination, options, _ref;
    _ref = this._args(arguments, 1), args = _ref.args, options = _ref.options, block = _ref.block;
    destination = args[0] || source;
    source = _path.resolve(this.findInSourcePaths(source));
    data = fs.readFileSync(source, 'utf-8');
    return this.createFile(destination, data, block);
  },
  linkFile: function(source) {
    var args, block, destination, options, _ref;
    _ref = this._args(arguments, 1), args = _ref.args, options = _ref.options, block = _ref.block;
    destination = args.first || source;
    source = _path.resolve(this.findInSourcePaths(source));
    return this.createLink(destination, source, options);
  },
  template: function(source) {
    var args, block, data, destination, options, _ref;
    _ref = this._args(arguments, 1), args = _ref.args, options = _ref.options, block = _ref.block;
    destination = args[0] || source.replace(/\.tt$/, '');
    source = _path.resolve(this.findInSourcePaths(source));
    data = this.render(fs.readFileSync(source, 'utf-8'), this.locals());
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
    if (behavior !== 'invoke') {
      return;
    }
    path = _path.resolve(path, destination_root);
    this.sayStatus('chmod', this.relativeToOriginalDestinationRoot(path), options.fetch('verbose', true));
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
    if (behavior !== 'invoke') {
      return;
    }
    _ref = this._args(arguments, 2), args = _ref.args, options = _ref.options, block = _ref.block;
    path = _path.resolve(path, destination_root);
    this.sayStatus('gsub', this.relativeToOriginalDestinationRoot(path), options.fetch('verbose', true));
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
    if (fs.existsSync(path)) {
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
    return _path.resolve(_path.join(this.sourceRoot, "templates", this.currentSourceDirectory, path));
  }
};

Tower.GeneratorActions.file = Tower.GeneratorActions.createFile;

Tower.GeneratorActions.directory = Tower.GeneratorActions.createDirectory;

module.exports = Tower.GeneratorActions;
