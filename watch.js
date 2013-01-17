(function(){

    var fs = require('fs');
    var path = require('path');
    var wrench = require('wrench');
    var _      = require('underscore');

    var root = path.resolve(__dirname);
    var pkgRoot = path.join(root, "packages") + path.sep;

    var watchr = require('watchr')
    var globsync = require('glob-whatev');

    var paths = _.select(globsync.glob('packages/**/*'), function(i){
        return !i.match('templates');
    });
    // Watch a directory or file
    watchr.watch({
        paths: paths,
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
            wrench.copyDirSyncRecursive('packages', 'lib');
            console.log('`packages` directory has been copied to `lib`');
        }
    });


    function changed(filepath) {
        var cleanPath = filepath.replace(pkgRoot, "").replace(/^(packages)/, "");
        var libPath = path.join("lib", cleanPath);
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
        if (fs.existsSync(libPath))
            fs.unlinkSync(libPath);
    }

})();