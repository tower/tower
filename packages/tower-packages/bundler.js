var fs   = require('fs'),
    path = require('path'),
    watchr = require('watchr');

var Bundler = {
    
    output: {
        js: 'vendor/javascripts/packages/',
        css: 'vendor/stylesheets/packages/',
        images: 'public/images/packages/'
    },

    _resources: [],

    /**
     * An array containing each package path. Watch each package, and it's
     * files for changes.
     * @type {Array}
     */
    watch: function() {
        var self = this;
        watchr.watch({
            paths: Tower.Packages._paths,
            listener: function(event, filepath){
                // When something changes, re-bundle the package.
                //self.build();
                var packageName = filepath.replace(Tower.root, "").replace(/^\\/, "");
                Tower.Packages.lookup.forEach(function(p){
                    packageName = packageName.replace(/\\/g, "/").replace(p, "");
                });
                packageName = packageName.match(/^[^\/]+/)[0];
                self.fileChanged(packageName, filepath);
                self.build(packageName);
            },
            next: function(err,watcher){
                if (err)  throw err;
                console.log('\033[36m' + '   info  - ' + '\033[0m' + 'watching packages for changes' + '\033[0m');
            }
        });

    },

    /**
     * When a file has been changed (or added), we would trigger this method before `build`
     * so that we can build individual files first (coffee-script)
     * @return {[type]} [description]
     */
    fileChanged: function(package, filepath) {
        var self = this;
        var pkg = Tower.Packages.get(package);
        for(var i in Tower.Packages._extensions) {
            var val = Tower.Packages._extensions[i];
            /**
             * If the extension matches the registered ones.
             */
            if (filepath.match(new RegExp("\." + i + "$"))) {
                // Call the callback;
                pkg._files.forEach(function(file){
                    if (file.file === filepath) {
                        if (typeof val === "function")
                            val.call(self, filepath, package, filepath.replace(new RegExp("\." + i + "$"), ""), file.type);
                    }
                });
            }
        }
    },
    /**
     * Adds a resource to the bundler.
     * You can either specify a path, or the file's content. The bundler will
     * create file serve path automatically if you pass data.
     * @param {Object} options Contains the options for the current resource (js, css, image, etc...)
     */
    addResource: function(options) {
        this._resources.push(options);
    },

    /**
     * Build the package into different components.
     * Take all it's exported files and copy them to 
     * vendor/javascripts/packages/{name}/{file}.js
     * Do the same for CSS files, images, etc... that are registed
     * with the package.
     * @param  {String} package Package name that we want to build or re-build.
     * @return
     */
    build: function(package) {
        var self = this;
        // Fetch the package's data.
        var pkg = Tower.Packages.get(package);
        
        this.checkOutputValidity();

        if ( ! fs.existsSync(path.join(Tower.root, this.output.js, package))) {
            fs.mkdirSync(path.join(Tower.root, this.output.js, package));
        }

        pkg._files.forEach(function(file){

            if (file.type === 'client' || file.type === '*') {

                if (file.file.match(/\.js$/)) {

                    if (fs.existsSync(path.join(pkg.path, file))) {
                        // Copy!
                        var contents = fs.readFileSync(path.join(pkg.path, file.file), 'utf-8');
                        fs.writeFileSync(path.join(Tower.root, self.output.js, package, file.file), contents, 'utf-8');    
                        self.addFileLock(package, path.join(Tower.root, self.output.js, package, file.file), path.join(self.output.js, package, file.file), 'js');
                    }
                }
            }

        });

    },

    addFileLock: function(name, filename, relative, type) {

        var json = require(path.join(Tower.root, 'packages.json'));

        if (!json.packages[name]) {
            json.packages[name] = {
                files: []
            };
        }
        var found = false;
        json.packages[name].files.forEach(function(file){
            if (file.file === filename) {
                found = true;
            }
        });
        if (!found) {
            json.packages[name].files.push({file: filename, type: type, relative: relative});
            fs.writeFileSync(path.join(Tower.root, 'packages.json'), JSON.stringify(json), 'utf-8');
        }
    },

    checkOutputValidity: function() {

        if ( ! fs.existsSync(path.join(Tower.root, this.output.js))) {
            fs.mkdirSync(path.join(Tower.root, this.output.js));
        }

        if ( ! fs.existsSync(path.join(Tower.root, this.output.css))) {
            fs.mkdirSync(path.join(Tower.root, this.output.css));
        }

        if ( ! fs.existsSync(path.join(Tower.root, this.output.images))) {
            fs.mkdirSync(path.join(Tower.root, this.output.images));
        }

    }

};

Tower.Bundler = Bundler;