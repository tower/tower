var fs   = require('fs'),
    path = require('path'),
    watchr = require('watchr');

var Bundler = {

    /**
     * An array containing each package path. Watch each package, and it's
     * files for changes.
     * @type {Array}
     */
    watch: function() {
        console.log(Tower.Packages._paths);
        watchr.watch({
            paths: Tower.Packages._paths,
            listener: function(event, filepath){
                console.log(filepath, event);
            },
            next: function(err,watcher){
                if (err)  throw err;
                console.log('\033[36m' + '   info  - ' + '\033[0m' + 'watching packages for changes' + '\033[0m');
            }
        });

    }

};

Tower.Bundler = Bundler;