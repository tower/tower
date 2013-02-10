/**
 * The main entry point to any Tower application.
 * Tower is split between multiple packages. This package is the one
 * you install with `npm install tower`. All other packages will be
 * installed automatically through npm as dependencies to this package.
 *
 * This package is the package manager that sets the environment up, for
 * both client-side and server-side code, and initializes the next
 * package.
 *
 * Each package has it's own tests and they are completely (for the most
 * part) independent of each other. This allows flexibility and quite a
 * bit of modularity amoung packages.
 */
require('harmony-reflect');
/**
 * We need to include the main package classes which will expose a few
 * global variables.
 */
(function() {
    var Tower, App, self, _, path;

    global.__isApp = process.argv[2];
    global.__dir   = process.argv[3];
    path           = require('path');

    _ = require('underscore');
    /**
     * A string helper method to capitalize the first letter
     * in a word.
     * @return {String} Converted String.
     */
    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };
    /**
     * A helper method that escapes regex characters in a string.
     *
     * @param  {String} string Original String
     * @return {String}        Converted/Escaped String
     */
    _.regexpEscape = function(string) {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    String.prototype.replacePathSep = function() {
        return this.replace(new RegExp('\\|\/', path.sep));
    };

    /**
     * Figure out which environment we are inside: (client or server)
     */
    if(!global && window) { // isClient
        var __isServer__ = window.__isClient__ = true;
        var __isClient__ = window.__isServer__ = false;
    } else { // isServer
        var __isServer__ = global.__isServer__ = true;
        var __isClient__ = global.__isClient__ = false;
    }
    /**
     * Set the root path globally.
     * @type {String}
     */
    global._root = process.cwd();
    /**
     * Variable declaration and requiring of helper modules:
     * @type {Object}
     */
    self = this;
    /**
     * Require all the files we need that makes up the `Package` system.
     */
    var Bundler = require('./tower-packages/bundler');
    var Package = require('./tower-packages/package');
    var Packages = require('./tower-packages/packages');
    var Container = require('./tower-packages/container');
    /**
     * Create a new instance of the `Bundler` class. This will attach itself
     * to the global scope.
     * @type {Bundler}
     */
    global.Bundler = Bundler = new Bundler();
    /**
     * Create a new instance of the `Packages` class. This will also attach itself
     * to the global scope.
     * @type {Packages}
     */
    global.Package  = Package;
    global.Container = Container = new Container();
    global.Packages = Packages = new Packages();

    Container.set('Tower', {});
    Container.set('App', {
        Controllers: {},
        Models: {},
        Views: {}
    });

    global.Tower = Tower = {};
    global.App = App = Container.alias('App');

    Packages.run(function() {

        Tower.ready = Packages.include('tower', 'shared/ready');
        /**
         * This callback will run when the development environment has successfully started.
         * This means that the server is running and the framework is done initializing.
         * We can then start the bundler's watch method to start watching the filesystem.
         * This is the ONLY file watcher in the framework, which makes things really effecient.
         *
         * This file watcher will NOT run in production mode. Nor will any of the "Hot Code Push".
         * As we want to maximize performance for taking requests, not development tools.
         *
         * @return {Null}
         */
        Tower.ready('environment.development.started', function() {
            /**
             * Start the file watcher. This is the ONLY file watcher in the system.
             * This ensures that we have a fast, effecient development cycle. This will run
             * the bundler's stuff, as well as all the "Hot Code Push" and other file watching
             * tasks.
             */
            Bundler.watch();
        });

    });


})();

//module.exports = require('./tower/server');
//Tower.srcRoot = require('path').resolve(__dirname + '/../');