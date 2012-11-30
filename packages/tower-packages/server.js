(function(){

    var find = require("glob-whatev"),
        path = require("path");

    var Register = (function(){

        function Register() {

        }

        return Register;
    })();
    
    var Packages = (function(){

        function Packages() {
            this._packages = {};
        }   

        Packages.prototype.initialize = function() {
            console.log("Initializing Packages");
        };

        Packages.prototype.findPackages = function() {
            // Find all the packages.
            var packagesPath = path.join(Tower.root, "packages") + path.sep + "*"; 
            globsync.glob(packagesPath).forEach(function(filepath){
                console.log(filepath);
            });
        };

        Packages.prototype.register = function(callback) {
            callback.apply(new Register());
        }

        return Packages;
    })();

    Tower.Packages = new Packages();
})();