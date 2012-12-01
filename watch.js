(function(){

    var fs = require('fs');
    var path = require('path');
    var gaze = require('gaze');

    var root = path.resolve(__dirname);
    var pkgRoot = path.join(root, "packages") + path.sep;

    var Minimatch = require("minimatch").Minimatch;

    /**gaze('packages/', {forceWatchMethod: 'new'}, function(err, watcher) {

        //console.log(err, watcher);

        this.on('added', function(filepath){
            console.log(111, filepath);
        });

        this.on('changed', function(filepath){

            var cleanPath = filepath.replace(root, "");
            var libPath = path.join("lib", cleanPath);

            var contents = fs.readFileSync(filepath, "utf-8");

            console.log(cleanPath + " Changed.");

            fs.writeFileSync(libPath, contents);
        });

        this.on('deleted', function(filepath){
            console.log(222, filepath);
        });


        this.on('error', function(error){
            console.log(error);
        });

    });**/

    var watchr = require('watchr')
    var globsync = require('glob-whatev');

    // Watch a directory or file
    watchr.watch({
        paths: globsync.glob('packages/**/*'),
        listener: function(event, filepath){
            
            switch(event) {
                case "change":
                    changed(filepath);
                break;
                case "new": 
                    added(filepath);
                break;
                case "unlink":
                    deleted(filepath);
                break;
            }

        },
        next: function(err,watcher){
            if (err)  throw err;
            console.log('watching setup successfully');
        }
    });


    function changed(filepath) {
        var cleanPath = filepath.replace(pkgRoot, "").replace(/^(packages)/, "");
        var libPath = path.join("lib", cleanPath);
        console.log(cleanPath + " has changed.");
        var contents = fs.readFileSync(filepath, "utf-8");
        fs.writeFileSync(libPath, contents);
    }

    function added(filepath) {
        var cleanPath = filepath.replace(pkgRoot, "").replace(/^(packages)/, "");
        var libPath = path.join("lib", cleanPath);
        console.log(cleanPath + " was added.");
        fs.writeFileSync(libPath, "");
    }

    function deleted(filepath) {
        var cleanPath = filepath.replace(pkgRoot, "").replace(/^(packages)/, "");
        var libPath = path.join("lib", cleanPath);
        console.log(cleanPath + " was deleted.");
        fs.unlinkSync(libPath);
    }

})();