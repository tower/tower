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

/**
 * We need to include the main package classes which will expose a few
 * global variables.
 */
(function() {
    /**
     * Figure out which environment we are inside: (client or server)
     */
    if (!global && window) { // isClient
        var __isServer__ = window.__isClient__ = true; 
        var __isClient__ = window.__isServer__ = false;
    } else {                // isServer
        var __isServer__ = global.__isServer__ = true;
        var __isClient__ = global.__isClient__ = false;
    }
    /**
     * Set the root path globally.
     * @type {String}
     */
    global._root = process.cwd();
    /**
     * Include the package system. This will include everything
     * we need to get started. (This will also include Ember stuff)
     */
    var Envelope = require("./tower-packages/main");
    /**
     * Create a configuration object to pass into the packages 
     * initialization methods:
     */
     var config = {
        /**
         * Current Environment
         * @type {Boolean}
         */
        isServer: __isServer__,
        isClient: __isClient__,
        /**
         * Starting packages:
         * @type {Array}
         */
        startup: [
            'tower-core'
        ],
        /**
         * Default Paths:
         * @type {Array}
         */
        paths: [
            "vendor/packages",
            "node_modules"
        ]

     };
    /**
     * Initialize the package system, we'll need to specify some 
     * settings:
     */
    var _Instance__ = new Envelope(config);

})();

//module.exports = require('./tower/server');
//Tower.srcRoot = require('path').resolve(__dirname + '/../');
