(function(){
    console.log(1);
    var find = require("glob-whatev"),
        path = require("path");

    var Register = (function(){

        function Register() {

        }

        return Register;
    })();
    
    var Package = (function(){

        function Package() {
            this._packages = {};
        }

        Package.prototype.findPackages = function() {
            // Find all the packages.
            var packagesPath = path.join(Tower.root, "packages") + path.sep + "*"; 
            globsync.glob(packagesPath).forEach(function(filepath){
                console.log(filepath);
            });

        };

        Package.prototype.register = function(callback) {
            callback.apply(new Register());
        }

        return Package;
    })();

    Storm.Package = new Package;
})();