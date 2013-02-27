// This is the main entry point for any Tower application.
// This file exposes a function like `module.exports = function(){}`.
// To run the function you must call `require('tower')()`.
//
// Let's wrap all the code to avoid leaks.
(function() {
    // Define some top level variables. All variables should be
    // defined at the top of each function.
    var options, _, fs, log, path, Server, program, Tower;
    // Initialize variables and core modules:
    fs = require('fs'), path = require('path'), program = require('commander');

    // node path resolution was broken before
    if(process.platform == 'win32' && process.version <= 'v0.8.5') {
        require('./packages/tower-platform/path.js')
    }

    global.log = require('./log.js');
    Server = require('./server.js');

    // Define some simple default options.
    options = global.options = {
        port: 3000,
        env: 'development',
        dirname: path.resolve(__dirname, '..'),
        // The current command passed to this process:
        command: null,
        // Command arguments.
        // We build this later on in this file.
        commandArgs: []
    };

    // Start using commander. Provide all the available options for cli
    // commands:
    program
        .version('0.5.0')
        .usage('[options]')
        .option('-p, --port [number]', 'Port', parseInt)
        .option('-e, --env [string]', 'Environment Type')
        .usage('[command] [options]')
        .on('--help', function() {
            console.log(['Commands:', 'tower new <app-name>          generate a new Tower application in folder "app-name"', 'tower console                 command line prompt to your application', 'tower generate <generator>    generate project files (models, views, controllers, scaffolds, etc.)'].join("\n")
            );
    });
    // Parse the commands.
    program.parse(process.argv);

    // Store the port they specified if it's valid:
    if(program.port) {
        options.port = program.port;
    }

    // Do the same with the environment value:
    if(program.env) {
        options.env = program.env;
    }

    // Export a starting function that we'll call within the
    // app's main file:
    module.exports = function(command) {
        // We always want the default to be server command:
        if(!command) {
            command = 'server';
        }
        // Let's build out the command arguments:
        options.commandArgs = (function() {
            // Cut the first two items.
            process.argv.splice(0, 2);
            var _arr = process.argv.splice(-(process.argv.length - 3), process.argv.length - 1);
            return _arr;
        })();

        if(command && command != 'server') {
            // Instead of spawing a new process
            // we'll require the tower.js manually.
            // From there, we'll include the appropriate package
            // responsible for the command. Each package has it's own
            // command.
            var _server = new Server({});
            options.command = command;
            _server.startProcess();
            // If it's not the server, then return false;
            return false;
        }


        var server = new Server({
            inner_port: 5001,
            outer_port: 3000
        });

        options.command = command;

        server.run();

    };

})();