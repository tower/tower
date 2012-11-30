
module.exports = function(grunt) {
  var async, fs, mint, path, towerPath, _path;
  fs = require('fs');
  async = require('async');
  mint = require('mint');
  _path = require('path');
  try {
    towerPath = require.resolve('tower');
  } catch (error) {
    towerPath = _path.join(__dirname, ".." + _path.sep + ".." + _path.sep + ".." + _path.sep + "index.js");
  }
  grunt.registerMultiTask('templates', 'Compile templates', function() {
    var coffeePattern, file, files, iterator, layoutPath, name, namePattern, pathSeparator, pathSeparatorEscaped, result, taskDone, template, templatePath, _i, _len,
      _this = this;
    name = "";
    taskDone = this.async();
    files = grunt.file.expand(["app" + _path.sep + "templates" + _path.sep + "**" + _path.sep + "*.coffee"]);
    result = [];
    pathSeparator = '/';
    pathSeparatorEscaped = '/';
    templatePath = new RegExp("app" + pathSeparatorEscaped + "templates" + pathSeparatorEscaped + ".+\.coffee$");
    coffeePattern = /\.coffee$/;
    layoutPath = new RegExp("layout" + pathSeparatorEscaped + "application");
    namePattern = new RegExp("app" + pathSeparatorEscaped + "templates" + pathSeparatorEscaped + "(?:client|shared)" + pathSeparatorEscaped);
    for (_i = 0, _len = files.length; _i < _len; _i++) {
      file = files[_i];
      if (!file.match(templatePath)) {
        continue;
      }
      if (!file.match(coffeePattern)) {
        continue;
      }
      if (file.match(layoutPath)) {
        continue;
      }
      result.push([file.replace(coffeePattern, ""), fs.readFileSync(file, 'utf-8')]);
    }
    template = "Tower.View.cache =\n";
    iterator = function(item, next) {
      var cb, fileName, opts, prefix, string, view;
      name = item[0].replace(namePattern, '');
      fileName = name.split(pathSeparator);
      fileName = fileName[fileName.length - 1];
      if (fileName.match(/^_/)) {
        return next();
      }
      try {
        string = coffeecup.render(item[1]);
      } catch (error) {
        try {
          prefix = name.split(pathSeparator)[0];
          view = new Tower.View({
            collectionName: prefix
          });
          opts = {
            type: 'coffee',
            inline: true,
            template: item[1].toString(),
            prefixes: [prefix]
          };
          cb = function(error, body) {
            return string = body;
          };
          view.render(opts, cb);
        } catch (error) {
          console.log(item[0], error);
          return next();
        }
      }
      template += "  '" + name + "': Ember.Handlebars.compile('";
      template += "" + string + "')\n";
      return next();
    };
    return async.forEachSeries(result, iterator, function(error) {
      template += '_.extend(Ember.TEMPLATES, Tower.View.cache)\n';
      return mint.coffee(template, {
        bare: true
      }, function(error, string) {
        if (error) {
          console.log(error);
          return taskDone(error);
        } else {
          fs.writeFileSync("public" + _path.sep + "javascripts" + _path.sep + "templates.js", string);
          return taskDone();
        }
      });
    });
  });
  grunt.registerMultiTask('injectTestDependencies', 'Modify files in place', function() {
    var done, files, iterator,
      _this = this;
    done = this.async();
    files = grunt.file.expandFiles(this.file.src);
    iterator = function(filePath, next) {
      return process.nextTick(function() {
        var packageJSON, testDependencies;
        packageJSON = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if (testDependencies = packageJSON['testDependencies']) {
          packageJSON['scripts']['install-dev'] = "npm install " + (Object.keys(testDependencies).join(' '));
          return process.nextTick(function() {
            fs.writeFileSync(filePath, JSON.stringify(packageJSON, null, 2));
            return next();
          });
        } else {
          return next();
        }
      });
    };
    return async.forEachSeries(files, iterator, done);
  });
  grunt.registerMultiTask('copy', 'Copy files to destination folder and replace @VERSION with pkg.version', function() {
    var copyFile, fileName, files, renameCount, replaceVersion, strip, target;
    replaceVersion = function(source) {
      return source.replace(/@VERSION/g, grunt.config('pkg.version'));
    };
    copyFile = function(src, dest) {
      if (/(js|css|json)$/.test(src)) {
        return grunt.file.copy(src, dest, {
          process: replaceVersion
        });
      } else {
        return grunt.file.copy(src, dest);
      }
    };
    files = grunt.file.expandFiles(this.file.src);
    target = this.file.dest + _path.sep;
    strip = this.data.strip;
    renameCount = 0;
    fileName = void 0;
    if (typeof strip === 'string') {
      strip = new RegExp('^' + grunt.template.process(strip, grunt.config()).replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&'));
    }
    files.forEach(function(fileName) {
      var targetFile;
      targetFile = (strip ? fileName.replace(strip, '') : fileName);
      return copyFile(fileName, target + targetFile);
    });
    grunt.log.writeln('Copied ' + files.length + ' files.');
    for (fileName in this.data.renames) {
      renameCount += 1;
      copyFile(fileName, target + grunt.template.process(this.data.renames[fileName], grunt.config()));
    }
    if (renameCount) {
      return grunt.log.writeln('Renamed ' + renameCount + ' files.');
    }
  });
  grunt.registerHelper('uploadToGitHub', function(local, remote, done) {
    var withStore,
      _this = this;
    require(towerPath);
    console.log('Uploading', local, 'to GitHub...', remote);
    withStore = function(block) {
      var githubDownloadStore;
      if (!githubDownloadStore) {
        githubDownloadStore = Tower.GithubDownloadStore.create();
        return githubDownloadStore.configure(function() {
          return block(githubDownloadStore);
        });
      } else {
        return block(githubDownloadStore);
      }
    };
    return withStore(function(store) {
      var criteria;
      criteria = {
        from: local,
        to: remote,
        name: remote,
        repo: 'tower',
        description: grunt.config('pkg.version')
      };
      return store.update(criteria, done);
    });
  });
  path = require("path");
  grunt.registerMultiTask("coffee", "Compile CoffeeScript files", function() {
    var dest, extension, options, strip;
    dest = this.file.dest + _path.sep;
    options = this.data.options;
    strip = this.data.strip;
    extension = this.data.extension;
    if (typeof strip === 'string') {
      strip = new RegExp('^' + grunt.template.process(strip, grunt.config()).replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&'));
    }
    grunt.file.expandFiles(this.file.src).forEach(function(filepath) {
      var targetFile;
      targetFile = dest + (strip ? filepath.replace(strip, '') : filepath);
      return grunt.helper("coffee", filepath, targetFile, grunt.utils._.clone(options), extension);
    });
    if (grunt.task.current.errorCount) {
      return false;
    } else {
      return true;
    }
  });
  grunt.registerHelper("coffee", function(src, destPath, options, extension) {
    var coffee, dest, js;
    coffee = require("coffee-script");
    js = "";
    options = options || {};
    extension = (extension ? extension : ".js");
    dest = path.dirname(destPath) + _path.sep + path.basename(destPath, ".coffee") + extension;
    if (options.bare !== false) {
      options.bare = true;
    }
    try {
      js = coffee.compile(grunt.file.read(src), options);
      grunt.file.write(dest, js);
      return true;
    } catch (e) {
      grunt.log.error("Error in " + src + ":\n" + e);
      return false;
    }
  });
  grunt.registerHelper('downloadDependendencies', function(done) {
    var IMAGES, JAVASCRIPTS, STYLESHEETS, SWFS, agent, bundleAll, processEach, wrench, _ref,
      _this = this;
    require(towerPath);
    agent = require('superagent');
    fs = require('fs');
    wrench = require('wrench');
    _ref = Tower.GeneratorAppGenerator, JAVASCRIPTS = _ref.JAVASCRIPTS, STYLESHEETS = _ref.STYLESHEETS, IMAGES = _ref.IMAGES, SWFS = _ref.SWFS;
    processEach = function(hash, bundle, next) {
      var iterator, keys;
      keys = _.keys(hash);
      iterator = function(remote, nextDownload) {
        var dir, local;
        local = hash[remote];
        dir = _path.resolve("." + _path.sep + "dist", _path.dirname(local));
        wrench.mkdirSyncRecursive(dir);
        return agent.get(remote).end(function(response) {
          path = "." + _path.sep + "dist" + _path.sep + local;
          return fs.writeFile(path, response.text, function() {
            return process.nextTick(nextDownload);
          });
        });
      };
      return Tower.async(keys, iterator, next);
    };
    bundleAll = function() {};
    return processEach(JAVASCRIPTS, 'tower.dependencies.js', function() {
      return processEach(STYLESHEETS, 'tower.dependencies.css', function() {
        return processEach(IMAGES, null, function() {
          return processEach(SWFS, null, function() {
            return done();
          });
        });
      });
    });
  });
  grunt.registerTask('downloadDependencies', 'Downloads client dependencies and makes them easy to access', function() {
    return grunt.helper('downloadDependencies', this.async());
  });
  grunt.registerHelper('uploadDependencies', function(done) {
    var IMAGES, JAVASCRIPTS, STYLESHEETS, SWFS, processEach, _ref,
      _this = this;
    require(towerPath);
    _ref = Tower.GeneratorAppGenerator, JAVASCRIPTS = _ref.JAVASCRIPTS, STYLESHEETS = _ref.STYLESHEETS, IMAGES = _ref.IMAGES, SWFS = _ref.SWFS;
    processEach = function(hash, next) {
      var iterator, keys;
      keys = _.keys(hash);
      iterator = function(remote, nextDownload) {
        var local;
        local = hash[remote];
        path = "." + _path.sep + "dist" + _path.sep + local;
        return grunt.helper('upload2GitHub', path, local, nextUpload);
      };
      return Tower.async(keys, iterator, next);
    };
    return processEach(JAVASCRIPTS, function() {
      return processEach(STYLESHEETS, function() {
        return processEach(IMAGES, function() {
          return processEach(SWFS, function() {
            return done();
          });
        });
      });
    });
  });
  grunt.registerTask('uploadDependencies', 'Downloads client dependencies and makes them easy to access', function() {
    return grunt.helper('uploadDependencies', this.async());
  });
  grunt.registerHelper('bundleDependencies', function(done) {
    var JAVASCRIPTS, bundlePath, processEach,
      _this = this;
    require(towerPath);
    fs = require('fs');
    JAVASCRIPTS = ['underscore', 'underscore.string', 'moment', 'geolib', 'validator', 'accounting', 'inflection', 'async', 'socket.io', 'handlebars', 'ember', 'tower', "bootstrap" + _path.sep + "bootstrap-dropdown"];
    bundlePath = null;
    processEach = function(keys, bundle, next) {
      var currentCallback, iterator, writeStream;
      currentCallback = null;
      bundlePath = "." + _path.sep + "dist" + _path.sep + bundle;
      writeStream = fs.createWriteStream(bundlePath, {
        flags: 'w',
        encoding: 'utf-8'
      });
      writeStream.on('drain', function() {
        if (currentCallback) {
          return currentCallback();
        }
      });
      iterator = function(local, nextDownload) {
        currentCallback = nextDownload;
        local = local + '.js';
        return fs.readFile("." + _path.sep + "dist" + _path.sep + local, 'utf-8', function(error, content) {
          if (writeStream.write(content)) {
            return next();
          }
        });
      };
      return Tower.async(keys, iterator, function() {
        return grunt.helper('upload2GitHub', bundlePath, bundle, function() {
          return process.nextTick(next);
        });
      });
    };
    return processEach(JAVASCRIPTS, 'tower.dependencies.js', function() {
      return fs.readFile(bundlePath, 'utf-8', function(error, content) {
        return require('mint').uglifyjs(content, {}, function(error, content) {
          var bundle,
            _this = this;
          bundle = 'tower.dependencies.min.js';
          bundlePath = '.#{_path.sep}dist#{_path.sep}' + bundle;
          return fs.writeFile(bundlePath, content, function() {
            return process.nextTick(function() {
              return grunt.helper('upload2GitHub', bundlePath, bundle, function() {
                return done();
              });
            });
          });
        });
      });
    });
  });
  grunt.registerTask('bundleDependencies', function() {
    return grunt.helper('bundleDependencies', this.async());
  });
  return grunt.registerMultiTask('build', 'Build tower for the client', function() {
    var buildIt, compileFile, nodePath;
    fs = require('fs');
    mint = require('mint');
    nodePath = require('path');
    compileFile = function(root, path, level) {
      var data, outputPath;
      try {
        data = fs.readFileSync(path, 'utf-8');
        data = data.replace(/require '([^']+)'\n/g, function(_, _path) {
          var _parent, _root;
          _parent = !!_path.match(/\.\./);
          if (_parent) {
            _root = nodePath.resolve(root, _path);
            _path = _root + '.coffee';
          } else {
            _root = nodePath.resolve(root, '..', _path);
            _path = _root + '.coffee';
          }
          try {
            return compileFile(_root, _path, level + 1) + "\n\n";
          } catch (error) {
            console.info(_path);
            console.error(error.stack);
            return "";
          }
        });
        data = data.replace(/module\.exports\s*=.*\s*/g, "");
        data + "\n\n";
        if (level === 1) {
          outputPath = ("." + _path.sep + "dist" + _path.sep) + nodePath.resolve(path, '..').split(_path.sep).pop();
          fs.writeFileSync(outputPath + '.coffee', data);
          mint.coffee(data, {
            bare: false
          }, function(error, result) {
            if (error) {
              console.error(error.stack);
            }
            return fs.writeFileSync(outputPath + '.js', result);
          });
        }
        return data;
      } catch (error) {
        console.log(error);
        return "";
      }
    };
    buildIt = function() {
      var content;
      if (!fs.existsSync("." + _path.sep + "dist")) {
        fs.mkdirSync("." + _path.sep + "dist");
      }
      content = compileFile("." + _path.sep + "packages" + _path.sep + "tower", "." + _path.sep + "packages" + _path.sep + "tower" + _path.sep + "client.coffee", 0).replace(/Tower\.version *= *.+\n/g, function(_) {
        var version;
        return version = "Tower.version = \"" + (grunt.config('pkg.version')) + "\"\n";
      });
      fs.writeFileSync("." + _path.sep + "dist" + _path.sep + "tower.coffee", content);
      return mint.coffee(content, {
        bare: false
      }, function(error, result) {
        result = grunt.config.process('meta.banner') + result;
        if (error) {
          console.error(error.stack);
        }
        return fs.writeFileSync("." + _path.sep + "dist" + _path.sep + "tower.js", result);
      });
    };
    return buildIt();
  });
};
