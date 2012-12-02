(function(){

    var Package = (function(){

        function Package(callback) {
            this._callback = callback;
            this._info     = {};
            this._dependencies = [];
            this._files    = [];
            this._init     = [];
            callback.apply(this);
            Tower.Packages.add(this._info.name || null, this);
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
                self._files.push({file: file, type: type});
            }); 
        }

        Package.prototype.init = function(files) {
            var self = this;
            if (!(files instanceof Array))
                files = files ? [files] : [];
            files.forEach(function(file){
                self._init.push(file);
            });
        };

        Package.prototype.registerExtension = function(callback) {

        }

        Package.register = function(callback) {
            if (!(this instanceof Package)) {
                return new Package(callback);
            } 
        };

        return Package;
    })();

    Tower.Package = Package;
})();