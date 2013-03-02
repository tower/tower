var fs = require('fs'),
    path = require('path'),
    UglifyJS = require('uglify-js');

var wrench = require('wrench'),
    util = require('util'),
    glob = require('glob');

Config = {
    _prev: [],
    _platform: '',
    _getPrev: function(i) {
        if (i) {
            return this._prev[(this._prev.length - 1) - i];
        } else {
            return this._prev[(this._prev.length - 1)];
        }
    },
    _settings: {}
};

Config.get = function() {
    var args = arguments;
    var s = this._settings;
    if (args[0] instanceof Array) {
        args = args[0];
    }
    var prev = (s[args[0]]) ? s[args[0]] : false;
    var n = args.length;
    if (n === 1) return prev;
    if (prev === false) return;
    for (var i = 1; i < n; i++) {
        prev = prev[args[i]];
    }

    return prev;
}

Config.path = function(p) {
    this._settings[this._platform].path = p;
    return this;
};

Config.js = function() {
    this._prev.push('js');
    this._platform = 'js';
    if (!this._settings['js']) {
        this._settings['js'] = {};
    }
    return this;
};

Config.css = function() {
    this._prev.push('css');
    this._platform = 'css';
    if (!this._settings['css']) {
        this._settings['css'] = {};
    }
    return this;
};

Config.compiler = function() {
    this._prev.push('compiler');
    if (!this._settings['js']) {
        this._settings['js'] = {};
    }
    return this;
};

Config.type = function(type) {
    this._prev.push('type');
    var prev = this._prev[this._prev.length - 3];
    // Go two steps back:
    if (prev && this._compiler[prev]) {
        this._compiler[prev].type = type;
    } else {
        throw new Error('The current bundler configuration is has incorrect syntax. Make sure you\'re using each method in the correct order.');
    }
    return this;
};

function Bundler() {
    /**
     * Holds all the extensions registered and the callback that will run
     * when we find it's extension:
     *
     * e.g ['js'] = {cb: function(){}}
     *
     * @type {Object}
     */
    this.extensions = {};
}

Bundler._instance = null;

Bundler.prototype.compile = function(options) {
    options.path = options.path + '.' + options.extension;
    fs.writeFileSync(options.path, options.data.toString('utf-8'));
    this._resources.push(options);
};

Bundler.prototype.addResource = function(options) {
    this.compile(options);
};

Bundler.prototype.registerExtension = function(type, callback) {
    this.extensions[type] = callback;
};

Bundler.prototype.build = function(package) {
    var self = this;
    // Fetch the package's data.
    var pkg = Tower.Packager.get(package);

    this.checkOutputValidity();

    if (!fs.existsSync(path.join(_root, this.output.js, package))) {
        fs.mkdirSync(path.join(_root, this.output.js, package));
    }

    pkg._files.forEach(function(file) {
        if (file.type === 'client' || file.type === '*') {
            if (file.file.match(/\.js$/)) {
                if (fs.existsSync(path.join(pkg.path, file))) {
                    // Copy!
                    //console.log(path.join(_root, self.output.js, package));
                    var contents = fs.readFileSync(path.join(pkg.path, file.file), 'utf-8');

                    /**finalPath.forEach(function(p, index){
                                var newP = path.join(buildPath.join(path.sep), p);
                                console.log(index, newP);
                                if (!fs.existsSync(newP)) {
                                    //fs.mkdirSync(newP);
                                    buildPath += newP;
                                }
                            });**/
                    /**

                            var finalPath = [_root, self.output.js, package, file.file];
                            var previous = "";

                            /**
                            *   Goes through each `finalPath` index one at a time.
                            *   We also assemble the current path to the next path so we build on top.
                            *
                            *   ['_root', 'a', 'b', 'c']
                            *   0 => _root
                            *   1 => _root/a
                            *   2 => _root/a/b
                            *   3 => _root/a/b/c
                            **/

                    function recursive(p) {

                        if (!fs.existsSync(p)) {
                            console.log("New Dir: " + p);
                            //fs.mkdirSync(p);
                        }

                    }

                    fs.writeFileSync(path.join(_root, self.output.js, package, file.file), contents, 'utf-8');
                    self.addFileLock(package, path.join(_root, self.output.js, package, file.file), path.join(self.output.js, package, file.file), 'js');

                }
            }
        }

    });
};

Bundler.prototype.start = function() {
    this.watch();
};

Bundler.prototype.watch = function() {

    var self = this;

    var _watchPackages = [];
    Tower.Packager._paths.forEach(function(i) {
        _watchPackages.push(path.join(i, '**', '*'));
    });

    function stripFilename(filename) {
        return filename.replace(new RegExp(Tower.path), '');
    }

    Tower.watch(_watchPackages).on('all', function(event, file) {
        var pkg = Tower.Packager.matchFilename(file);
        var begLogStr = "File " + event;
        if (!pkg) return false;
        log(
        begLogStr.bold + "\n\t\t      " + ">> ".blue + "Name:".underline + " \"" + stripFilename(file) + "\"" + "\n\t\t      " + ">> ".blue + "Package:".underline + " \"" + pkg.name + "\"");

        self.fileChanged(pkg.name, file);

    }).on('error', function(error) {
        log("Error", error);
    }).on('ready', function() {
        log("Watching Files...".bold);
    }).start();

    /**watchr.watch({
            paths: Packages._paths,
            listener: function(event, filepath) {
                // When something changes, re-bundle the package.
                //self.build();
                var lookup = null;
                var packageName = filepath.replace(_root, "").replace(/^\\/, "");
                Packages.lookup.forEach(function(p) {
                    packageName = packageName.replace(/\\/g, "/");
                    if(packageName.match(p)) {
                        lookup = p;
                        packageName = packageName.replace(p, "");
                    }
                });
                packageName = packageName.replace(/\/\//g, "/").replace(lookup, "").replace(/^\//, "").match(/^[^\/]+/)[0];
                self.fileChanged(packageName, filepath);
                self.build(packageName);
            },
            next: function(err, watcher) {
                if(err) throw err;
                console.log('\033[36m' + '   info  - ' + '\033[0m' + 'watching packages for changes' + '\033[0m');
            }
        });**/
};
/**
Bundler.prototype.fileChanged = function(package, filepath) {
    var self = this;
    var pkg = Tower.Packages.get(package);
    for(var i in Tower.Packages._extensions) {
        var val = Tower.Packages._extensions[i];

        if(filepath.match(new RegExp("\." + i + "$"))) {
            // Call the callback;
            pkg._files.forEach(function(file) {
                //console.log(pkg.path.replace(/\\/g, "/"), filepath.replace(/\\/g, "/"));
                var shortPath = filepath.replace(/\\/g, "/").replace(pkg.path.replace(/\\/g, "/"), "");
                //console.log(filepath.replace(pkg.path.replace(/\\/g, "/"), "").replace(/\\/g, "/"));
                if(file.file === shortPath) {
                    var serve_path = path.join(_root, self.output.js, package, shortPath.replace(/\..+$/, ""));
                    if(typeof val === "function") val.call(self, filepath, serve_path, file.type);
                }
            });
        }
    }
};**/

Bundler.prototype.config = function(callback) {
    callback.apply(Config, [Config]);
};

Bundler.prototype.fileChanged = function(packageName, filename) {
    var self = this;
    // Determine what extension the file is:
    var extension = filename.match(/[.](.+)$/)[1];

    // Make sure we have a processor for that extension;
    if (this.extensions[extension]) {
        var filenameWithoutExt = filename.replace(/[.](.+)$/, '') + '.';
        // Run that callback
        var obj = this.extensions[extension].apply(this, [filenameWithoutExt, packageName]);

        // Get the filename only up to and including the package name. Because we
        // will store a tmp copy under .tower/.tmp/.
        var minimalFileName = filename.match(new RegExp("(" + _.regexpEscape(packageName) + ".+)"))[1];
        // Next, if it's JavaScript, we need to minify and concatenate it!
        if (extension === 'js') {

            if (obj.data) {
                self.buildFile(minimalFileName, Compress(obj.data));
            } else {
                // Read the file:
                fs.readFile(obj.filename, "utf8", function(err, contents) {
                    if (err) throw new Error(err);
                    self.buildFile(minimalFileName, Compress(contents));
                });
            }

            function Compress(code) {
                var ast = UglifyJS.parse(code);
                ast.figure_out_scope();
                var compressor = UglifyJS.Compressor({});
                ast = ast.transform(compressor);
                return ast.print_to_string(); // get compressed code
            }
        }

    } else {
        // We can't work with it.
    }

};

Bundler.prototype.buildFile = function(filename, contents) {
    var self = this;
    // Build the new file.
    var finalPath = path.join(Tower.cwd, '.tower', '.tmp', filename);

    function makeDir(p) {
        // Check if it exists:
        fs.exists(p, function(e) {
            if (!e) {
                fs.mkdir(p, function(err) {
                    if (err) throw new Error(err);
                    console.log(1);
                    makeDir(p.substring(0, p.lastIndexOf("/")))
                });
            } else {
                fs.writeFile(finalPath, contents, 'utf8', function(err) {
                    if (err) throw new Error(err);
                    // Now rebuild the cache;
                    self.buildCache();
                });
            }
        });
    }

    // Get rid of the file:
    makeDir(finalPath.substring(0, finalPath.lastIndexOf("/")));
};

Bundler.prototype.buildCache = function() {
    var cp = require('child_process').spawn;
    var ls = cp('node', [path.join(__dirname, 'build.js'), Tower.cwd, Tower.path]);

    ls.stdout.on('data', function(data) {
        console.log(data.toString());
    });

    ls.stderr.on('data', function (data) {
      console.log(data.toString());
    });


    ls.on('exit', function() {
        console.log('exit');
    });
};

Bundler.prototype.extend = function(callback) {
    callback.apply(this);
    return this;
}

Bundler.prototype.createExtension = function(extension, callback) {
    this.extensions[extension] = callback;
    return this;
};

Bundler.prototype.extension = function(ext) {

    return this;
};

/**
 * Initialize the bundler.
 * @return {[type]} [description]
 */
Bundler.create = function() {
    this._instance = new Bundler();
    return this._instance;
};

Bundler.run = function() {
    if (!this._instance) return false;
    log("Bundler Running".bold);
    log("Environment: ".bold + (Tower.env.charAt(0).toUpperCase() + Tower.env.slice(1)).underline);
    if (Tower.env == 'development') {
        // Build before we watch:
        var p = path.join(Tower.cwd, '.tower');
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
        }

        // The .tmp directory will house the intermediate compilation step for
        // all the javascript files. If the compilation level is high (CommonJS) then
        // we will concatenate each js file and copy them here (mimicing the directory structure).
        //
        // This allows us to only minify and concatenate for the file that has changed.
        //
        // This build solution has 2 levels involved:
        //  LEVEL 1: -> Concatenate and Minify each client-side js file and copy the directory
        //              structure over to .tower/.tmp
        //  LEVEL 2: -> Merge all the files into a single .js file.
        //
        // There will be a handlebar helper like "{{includePackageAssets}}" or "{{packages javascript}}"
        // and "{{packages css}}". This helper will check what environment were in. If were in development
        // it'll then check the compilation level/type we set. If were on loose, then we'll fetch the
        // cache.json file and insert a script tag for each resource; otherwise, we'll check the config
        // file and see what file they specified to be compiled to and include that.
        var temp = path.join(p, '.tmp');
        if (!fs.existsSync(temp)) {
            fs.mkdirSync(temp);
        }

        var file = path.join(p, 'cache.json');
        if (!fs.existsSync(file)) {
            // cache.json is built for an extra layer of speed.
            // this is only used in development. In production, you would only have a single
            // javascript file that would automatically be included in the page.
            // cache.json is used in development for inserting all the `script` tags for each and
            // every javascript file.
            // Depending on the compiling level, this file may or may not be used as much, if at all.
            fs.writeFileSync(file, JSON.stringify({
                resources: [{
                    type: 'js',
                    group: []
                }, {
                    type: 'css',
                    group: []
                }]
            }), 'utf-8');
        }

        //this._instance.build();
        this._instance.watch();
    }
};

Tower.export(Bundler);