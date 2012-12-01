var glob = require("glob-whatev"),
    path = require("path"),
    fs   = require("fs");

Tower.AppRoot = process.cwd();

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

var Packages = (function(){

    function Packages() {
        this._packages = {};
        this.found     = {};
        this.lock      = {};
        this.lookup    = [];

        this.findLookups();
        this.findAll();
    }   

    /**
     * Find and look inside the `package.json` and look for the `tower.packages.lookup` key.
     * @return {[type]} [description]
     */
    Packages.prototype.findLookups = function() {
        var self = this;
        fs.exists(path.join(Tower.AppRoot, 'package.json'), function(exists){
            if (!exists) return;

            fs.readFile(path.join(Tower.AppRoot, 'package.json'), 'utf-8', function(err, file){
                if (err) throw Error();

                var json = JSON.parse(file);
                self.lookup = json.tower.packages.lookup; 
            }); 

        });
    };

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
            var packageFile = path.join(filepath, "package.js");
            fs.exists(packageFile, function(exists){
                if (exists) {
                    console.log(12123);
                    //require(packageFile);
                } else {
                    var pkg = filepath.replace(/\//g, "\\").replace(new RegExp(_.regexpEscape(basePath)), "").replace(/\\$/, "");
                    throw Error("Package: " + pkg.capitalize() + " | Missing `package.js` file.");
                }
            });
        });
    };

    return Packages;
})();

Tower.Packages = new Packages();