(function(){
    var path = require('path');

    var Package = (function(){

        function Package(callback) {
            this._callback = callback;
            this._info     = {};
            this._dependencies = [];
            this._files    = [];
            this._init     = [];
            this._path     = Packages._currentPath;
            callback.apply(this);
            Packages.add(this._info.name, this);
        }

        Package.prototype.info = function(obj) {
            this._info = obj;
        };

        Package.prototype.dependencies = function(arr) {
            var self = this;
            if (!(arr instanceof Array)) 
                arr = arr ? [name] : [];
            arr.forEach(function(dep){
                var format = {};
                format.raw = dep;
                var split = dep.split(':');
                if (split) {
                    format.parts = split;
                }
                self._dependencies.push(format);
            });
        };

        Package.prototype.addFile = function(path, type) {
            this._files.push({file: path, type: type});
        };

        Package.prototype.addFiles = function(base, files, type) {
            var self = this;
            if (!base) {
                files = base;
                type = files;
            }
            files.forEach(function(file){
                if (base) file = path.join(base, file);
                self._files.push({file: file, type: type});
            }); 
        };

        Package.prototype.init = function(files) {
            var self = this;
            if (!(files instanceof Array))
                files = files ? [files] : [];
            files.forEach(function(file){
                self._init.push(file);
            });
        };
        /**
         * Checks with the registered files if it's of the specified type.
         * @param  {String}  name File name
         * @param  {String}  type File type
         * @return {Boolean}      True or False.
         */
        Package.prototype.isType = function(name, type) {
            for (var file in this._files) {
                var f = this._files[file];
                if (f.file === name) {
                    if (f.type === type) {
                        return true;
                    } else if (f.type === 'client' | 'server' && type === '*') {
                        return true;
                    }
                }
            }
            return false;
        };
        /**
         * Register an extension with the bundler and package manager.
         * @param  {Function} callback When a file changes, we'll invoke this function
         *                             for the specific file type.
         * @return
         */
        Package.prototype.registerExtension = function(type, callback) {
            Bundler.registerExtension(type, callback);
        }

        Package.register = function(callback) {
            if (!(this instanceof Package)) {
                return new Package(callback);
            } 
        };

        return Package;

    })();

    global.Package = Package;

})();