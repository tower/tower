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
var util, log, getCommand, App, self, path, incomingOptions, _, fs;
util = require('util'), _ = require('underscore'), incomingOptions = JSON.parse(process.argv[2]), path = require('path'), fs = require('fs');
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

global._ = _;

/**
 * We need to include the main package classes which will expose a few
 * global variables.
 */
(function() {
    /**
     * Tower Constructor
     */
    function TowerClass() {
        this.App = {
            files: []
        };
        this.container = {};
        this._namespaces = {};
        this.path = incomingOptions.dirname;
        this.env = incomingOptions.env;
        this.port = incomingOptions.port;
        this.version = JSON.parse(fs.readFileSync('../../package.json')).version;
        this.cwd = process.cwd();
        this.isServer = true;
        this.isClient = false;
        this.autoload = ['app.js', 'server.js', 'index.js'];

        this.command = {
            argv: incomingOptions.commandArgs,
            get: function() {
                return incomingOptions.command;
            }
        };
    }

    TowerClass.prototype.export = function(key, value, options) {
        // Get the package information.
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function(_, stack) {
            return stack;
        };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        var filename = stack[1].receiver.id;
        // Match the filename with the package:
        var package = Tower.Packager.matchFilename(filename);
        var base = false;
        if(this[package._namespace] == null) {
            Object.defineProperty(this, package._namespace, {
                __proto__: null,
                enumerable: true,
                configurable: true,
                writable: true,
                value: (function() {
                    if(!value && !options) {
                        options = value, value = key;
                        base = true;
                        return value;
                    }
                })()
            });
        }

        base = true;
        if(!options) options = {};

        if(!base) {
            Object.defineProperty(this[package._namespace], key, {
                __proto__: options.proto || null,
                enumerable: options.enumerable || true,
                configurable: options.configurable || true,
                writable: options.writable || true,
                value: value
            });
        }
    };

    TowerClass.create = function() {
        return new TowerClass();
    };

    var Tower = global.Tower = TowerClass.create();

    // Require all of the package system:
    require('./../tower-packager/packager');

    Tower.Packager.run(function(count) {
        // Include the tower-bundler package that will be the asset pipeline.
        // XXX: Allow the bundler to be somewhat turned off for production.
        //      In production, you would use a 3rd party server (NGINX) to serve
        //      all your assets.
        // XXX: We should have a special handlebar helper: {{#production}}
        //      and {{#development}}
        //      You would place all your Tower handled assets within the development
        //      helper and nginix/3rd party within the production.
        //
        //      {{#development}}
        //          {{{assets 'css' packages='all'}}}
        //          {{{assets 'js' packages='all'}}}
        //      {{/development}}
        //
        Tower.Packager.require('tower-bundler');
        // Load up the first package inside Tower. We'll load the server.js
        // file as it's initialization. Once we load this file, we
        // leave the rest of the system up to Tower, except the bundler.
        //
        // We only want to include the main tower package if were starting
        // a full Tower process (server, console, routes, etc...)
        Tower.Packager.require('tower-cli');
        // Initialize the environment:
        if (Tower.env == 'development') {
            Tower.ready('environment.development.started');
        }
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
             *
             * This will initialize an instance of Tower.watch.
             */
            Tower.Bundler.run();
        });

    });


})();

//module.exports = require('./tower/server');
//Tower.srcRoot = require('path').resolve(__dirname + '/../');