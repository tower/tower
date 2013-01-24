(function() {
    require('harmony-reflect');
    /**
     * Variable declaration and requiring of helper modules:
     * @type {Object}
     */
    var self = this,
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
    /**
     * The Envelope Class!
     *
     * @class  Envelope
     * @param {Object} config Configuration Object.
     * @return {Class}
     */
    var Envelope = (function() {

        function Envelope(config) {
            /**
             * Store the configuration options:
             * @type {Object}
             */
            this.config = config;
            /**
             * Require all the files we need that makes up the `Package` system.
             */
            var Bundler     = require('./bundler');
            var Package     = require('./package');
            var Packages    = require('./packages');
            var Container   = require('./container');
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
            global.Packages = Packages = new Packages();
            global.Container = Container = new Container();

            Container.set('Tower', Ember.Namespace.create());
            Container.set('App', Ember.Namespace.create());
            var Tower, App;
            global.Tower    = Tower = Container.alias('Tower');
            global.App      = App   = Container.alias('App');
            /**
             * This callback will run once all the packages are loaded and found. This will ensure we
             * are good to go, and that were still not loading anymore packages. If a package
             * hasn't been found, we are positive that it doesn't exist.
             *
             * This method will run the initialization process for core packages. These are
             * setup in the config file passed through this constructor.
             *
             * @return {Null}
             */
            Packages.ready('packages.loaded', function() {
                Packages.require(config.startup);
            });
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
            Packages.ready('environment.development.started', function() {
                /**
                 * Start the file watcher. This is the ONLY file watcher in the system.
                 * This ensures that we have a fast, effecient development cycle. This will run
                 * the bundler's stuff, as well as all the "Hot Code Push" and other file watching
                 * tasks.
                 */
                Bundler.watch();
            });

        }
        /**
         * Return the class constructor:
         */
        return Envelope;
    })();
    /**
     * Export the Envelope class:
     * @type {[type]}
     */
    module.exports = Envelope;
})();