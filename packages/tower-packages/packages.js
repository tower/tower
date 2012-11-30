var glob = require("glob-whatev"),
    path = require("path"),
    fs   = require("fs");

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

var Packages = (function(){

    function Packages() {
        this._packages = {};
        this.found     = {};
    }   

    Packages.prototype.initialize = function() {
        console.log("Initializing Packages");

        // Find all the packages;
        this.findAll();

    };

    Packages.prototype.findAll = function() {
        // Find all the packages.
        var basePath     = path.join(Tower.root, "packages") + path.sep; 
        var globString   = basePath + "*";
        glob.glob(globString).forEach(function(filepath){
            // Load the package.js file.
            var packageFile = path.join(basePath, "package.js");
            fs.exists(packageFile, function(exists){
                if (exists) {
                    console.log(filepath);
                } else {
                    var pkg = filepath.replace(/\//g, "\\").replace(new RegExp(_.regexpEscape(basePath)), "").replace(/\\$/, "");
                    throw Error("Package: " + pkg.capitalize());
                }
            });
        });
    };

    return Packages;
})();

Tower.Packages = new Packages();