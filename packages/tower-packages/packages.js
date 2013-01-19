var glob = require("glob-whatev"),
    path = require("path"),
    fs = require("fs"),
    _ = require("underscore");

var Packages = (function() {

    function Packages(cb) {

        this._packages = {};
        this._paths = [
            path.join(__dirname, '..'),
            path.join(_root, 'node_modules')
        ];

        if (__isApp) {
            this._paths.push(process.cwd());
        }
        this.find(function(){
        });

    }

    Packages.prototype.add = function(name, package) {
        this._packages[name] = package;
    }

    Packages.prototype.load = function(file) {
        // Load the package:
        require(file);
    };

    Packages.prototype.find = function(cb) {    
        var self = this;
        
        this._paths.forEach(function(p){

            fs.readdir(p, function(error, dir){
                if (error) throw Error(error);
                dir.forEach(function(_dir){
                    if (_dir.match("tower-packages")) return;
                    // Check if `package.js` exists:
                    fs.exists(path.join(p, _dir, 'package.js'), function(exists){
                        if (exists) {
                            // Package is valid:
                            self.load(path.join(p, _dir, 'package.js'));
                        }
                    });

                
                });

            });

        });

        

    };


    return Packages;

})();

/**var Packages = {

        _packages: {},
        _paths: [],
        _corePaths: [
            path.join(__dirname, '..')
        ],
        found: {},
        lock: {},
        lookup: [],
        _packagesFound: [],
        _extensions: {},

        initialize: function(config) {
            this.findAll();
        },


        load: function(name) {

        },

        get: function(name) {
            return this._packages[name] || "Package not found";
        },

        add: function(name, obj) {
            this._packages[name] = obj;
        },

        create: function(name, package) {
            var self = this;
            if (self._packages[name] != null) return;
            this._paths.push(package);
            require(path.join(package, "package.js"));
            console.log("NAME: " + name);
            self._packages.forEach(function(a){
                console.log(a.path);
            });
            self._packages[name].path = package;
        },

        registerExtension: function(type, callback) {
            this._extensions[type] = callback;
        },

        findAll: function() {
            // Find all the packages.
            var basePath     = path.join(_root, "packages") + path.sep; 
            var globString   = basePath + "*";

            var self = this;

            this._corePaths.forEach(function(_path){
                var globString = path.join(_path, "*");
                _.select(glob.glob(globString), function(i){return true;//return !i.match('tower-packages')}).forEach(function(filepath){
                    var packageFile = path.join(filepath, "package.js");
                    if (fs.existsSync(packageFile)) {
                        var name;
                        name = filepath.replace(/\//g, "\\").replace(/\/$/, "").split('\\');

                        function getLastElement(n, length) {
                            if (n[length] != null && n[length] != "") {
                                return n[length];
                            } else {
                                return getLastElement(n, length - 1);
                            }
                        }

                        name = getLastElement(name, name.length - 1);
                        self._packagesFound.push({name: name, path: filepath});
                        self.create(name, filepath); // Create the package.
                    } else {
                        console.log(filepath);
                    }
                });
            });

            this.lookup.forEach(function(_path){
                var fullPath = path.join(_root, _path);
                var globString = path.join(fullPath, "*");
                glob.glob(globString).forEach(function(filepath){
                    // Load the package.js file.
                    var packageFile = path.join(filepath, "package.js");
                    if (fs.existsSync(packageFile)) {
                        var name;
                        name = filepath.replace(/\//g, "\\").replace(/\/$/, "").split('\\');
                        
                        function getLastElement(n, length) {
                            if (n[length] != null && n[length] != "") {
                                return n[length];
                            } else {
                                return getLastElement(n, length - 1);
                            }
                        }

                        name = getLastElement(name, name.length - 1);
                        self._packagesFound.push({name: name, path: filepath});
                        self.create(name, filepath); // Create the package.
                    }
                });
            });
        }

    };**/

global.Packages = Packages;