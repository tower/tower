var fs = require('fs'),
    path = require('path');

Config = {
    _prev: [],
    _platform: '',
    _getPrev: function(i) {
        if(i) {
            return this._prev[(this._prev.length - 1) - i];
        } else {
            return this._prev[(this._prev.length - 1)];
        }
    },
    _settings: {}
};

Config.get = function() {
    var args = arguments;
    var s    = this._settings;
    if (args[0] instanceof Array) {
        args = args[0];
    }
    var prev = (s[args[0]]) ? s[args[0]] : false;
    var n = args.length;
    if (n === 1) return prev;
    if (prev === false) return;
    for(var i = 1; i < n; i++) {
        prev = prev[args[i]];
    }

    return prev;
}

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
    if(prev && this._compiler[prev]) {
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
    var pkg = Tower.Packages.get(package);

    this.checkOutputValidity();

    if(!fs.existsSync(path.join(_root, this.output.js, package))) {
        fs.mkdirSync(path.join(_root, this.output.js, package));
    }

    pkg._files.forEach(function(file) {
        if(file.type === 'client' || file.type === '*') {
            if(file.file.match(/\.js$/)) {
                if(fs.existsSync(path.join(pkg.path, file))) {
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

                        if(!fs.existsSync(p)) {
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
    Tower.Packages._paths.forEach(function(i) {
        _watchPackages.push(path.join(i, '**', '*'));
    });

    Tower.watch(_watchPackages).on('all', function(event, files) {
        log("File changed. Reloading...", ["[1m", "[30m"]);
    }).on('error', function(error) {
        console.log("Error", error);
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

Bundler.prototype.fileChanged = function(package, filepath) {
    var self = this;
    var pkg = Tower.Packages.get(package);
    for(var i in Tower.Packages._extensions) {
        var val = Tower.Packages._extensions[i];
        /**
         * If the extension matches the registered ones.
         */
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
};

Bundler.prototype.config = function(callback) {
    callback.apply(Config, [Config]);
};

/**
 * Initialize the bundler.
 * @return {[type]} [description]
 */
Bundler.prototype.create = function() {
    return this;
};

Bundler.run = function() {

};

Tower.export(Bundler);