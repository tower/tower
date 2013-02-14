// This is the main entry point for any Tower application.
// This file exposes a function like `module.exports = function(){}`.
// To run the function you must call `require('tower')()`.
//
// Let's wrap all the code to avoid leaks.
(function() {
    // Define some top level variables. All variables should be
    // defined at the top of each function.
    var options, _, fs, util, path, program, spawn, http, httpProxy, Status, Tower, last_color;
    // Initialize variables and core modules:
    fs = require('fs'), util = require('util'), path = require('path'), httpProxy = require('http-proxy'), http = require('http'), spawn = require('child_process').spawn, program = require('commander');
    // node path resolution was broken before
    if(process.platform == 'win32' && process.version <= 'v0.8.5') {
        require('./packages/tower-platform/path.js')
    }

    // Note the last color used for logging. When we change colors
    // we'll skip a line for clarity. Typically, you'd change colors
    // to notify different things.
    // XXX: Move this logging functionality inside a class
    //      because were repeating ourselves within this file
    //      and the sub-process.
    last_color = [];
    // A global log function with simple color support (you
    // must still pass the ascii color codes in as an array or string)
    global.log = function(str, color) {
        // Again, always defining variables at the top so it's
        // extremely easy to find.
        var s;
        // If we haven't specified a color, use cyan.
        if(!color) color = '[36m';
        // String to use to combine the array of colors.
        s = "";
        if(color instanceof Array) {
            // Append the `s` string with the color escape code
            // as well as the color code itself.
            color.forEach(function(ascii) {
                s += "\033" + ascii;
            });
        } else {
            // It's just a string that was passed, not an array.
            s = "\033" + color;
        }
        // If our last color is NOT the same as our built-up string `s`
        // then skip a line (newline).
        if(last_color !== s) {
            util.print('\n');
            last_color = s;
        }
        // Final output. We use util.print because it's raw and doesn't
        // add newlines, which console.log does.
        util.print('\n       ::' + s + str + '\033[0m');
    };

    // Define some simple default options.
    options = {
        port: 3000,
        env: 'development',
        dirname: __dirname,
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
            var _arr = process.argv.splice(-(process.argv.length - 3), process.argv.length - 1);
            return _arr;
        })();

        /**
         * The Server class is the heart of the operation.
         * It keeps track of the sub-process, proxy, and http server
         * so whenever anything happens, this class will deal with it.
         * @param {Object} options All the options.
         */
        function Server(options) {

            this.options = options || {};
            this.running = false;
            this.crashing = false;
            this.listening = true;
            this.exiting = false;
            this.errors = [];
            this.proxyInstance = null;
            this.serverInstance = null;
            this.requestQueue = [];
            this.process = null;

        }

        /**
         * Call this method when you want stuff to happen.
         * This will start the proxy server (NOTE: You only really need
         * the proxy server unless you're running the http server.)
         * and also a simple http server.
         * XXX: We will replace the http server with Express, but we will
         *      move it into the sub-process.
         * @return {void}
         */
        Server.prototype.run = function() {

            // Spawn the proxy server:
            this.startProxy();

            // Spawn the http server:
            // XXX: We'll need to move this into Tower's core packages, so we will
            //      need a way to restart the process (sub and main) for conflicting
            //      internal ports.
            //
            // One way would be to call `new Tower.HTTP.CIPError();` which would be
            // a child of the general purpose `Error` prototype/class.
            // We could then look at the instance of the error, if it matches the previous class, then
            // we'll do the regular restart.
        };

        /**
         * Start a simple HTTP server.
         * XXX: This will be replaced. Only used for initial
         *      testing of the proxy server.
         * @return {void}
         */
        Server.prototype.startHTTP = function() {

            self.serverInstance = http.createServer(

            function(req, res) {
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.write('request successfully proxied: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
                res.end();
            });

            self.serverInstance.on('error', function(err) {
                // If we have a conflicting error then we'll need
                // to restart the proxy server and http server on a different
                // port.
                if(err.code == 'EADDRINUSE') {
                    // Kill this instance and start a new one.
                    self.stop('Restarting the server - Conflicting Inner Port.', '[33m');
                    self.options.inner_port++;
                    self.run();
                    log('Successfully restarted!', '[32m');
                }
            });

            self.serverInstance.listen(self.options.inner_port, function() {
                log('HTTP server has started.');
            });

        };

        Server.prototype.startProxy = function() {

            var self = this;

            this.proxyInstance = httpProxy.createServer(

            function(req, res, proxy) {
                if(self.listening) {
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });

                    self.errors.forEach(function(err) {
                        res.write(err.toString());
                    });
                    res.write('The current app is crashing.');
                    res.end();
                } else if(!self.listening) {
                    proxy.proxyRequest(req, res, {
                        host: '127.0.0.1',
                        port: inner
                    });
                } else {
                    // Queue up request; Not listening yet.
                    var buffer = httpProxy.buffer(req);
                    self.request_queue.push(function() {
                        proxy.proxyRequest(req, res, {
                            host: '127.0.0.1',
                            port: inner,
                            buffer: buffer
                        });
                    });
                }
            }

            );

            this.proxyInstance.on('upgrade', function(req, socket, head) {

                if(self.listening) {

                    p.proxy.proxyWebSocketRequest(req, socket, head, {
                        host: '127.0.0.1',
                        port: self.options.inner_port
                    });

                } else {

                    var buffer = httpProxy.buffer(req);
                    self.request_queue.push(function() {
                        p.proxy.proxyWebSocketRequest(req, socket, head, {
                            host: '127.0.0.1',
                            port: self.options.inner_port,
                            buffer: buffer
                        });
                    });

                }

            });

            this.proxyInstance.on('proxyError', function(err, req, res) {
                res.writeHead(503, {
                    'Content-Type': 'text/plain'
                });
                res.end('Unexpected error.');
            });

            this.proxyInstance.on('end', function() {
                console.log("The request was proxied.");
            });

            this.proxyInstance.listen(this.options.outer_port, function() {
                log('Proxy server has started.');
                self.startProcess();
                self.startHTTP();

            }

            );

        };

        Server.prototype.startProcess = function() {
            var self = this,
                ls;

            ls = spawn('node', ['--harmony', path.join(__dirname, 'packages', 'tower.js'), JSON.stringify(options)]);

            ls.stdout.on('data', function(data) {
                if(data) {
                    console.log(data.toString('utf-8'));
                }
            });

            ls.stderr.on('data', function(data) {
                data = data.toString('utf-8');

                if(data.code && data.code === 0x01) {
                    // Conflicting Error:
                    self.stop('Restarting the server - Conflicting Inner Port.', '[33m');
                    self.options.inner_port++;
                    self.run();
                    log('Successfully restarted!', '[32m');

                    return;
                }
                self.errors.push(data);
                self.crashing = true;
            });

            ls.on('exit', function(code) {
                if(self.crashing) {
                    console.log('---------------------------', '    \033[31mApp is crashing.\033[0m', '---------------------------');

                    self.errors.forEach(function(list) {
                        console.log(list.toString());
                    });
                }
            });

            this.process = ls;
        };

        Server.prototype.stop = function(msg) {
            var self = this;
            if(msg) {
                log(msg);
            }
            if(this.serverInstance._handle) {
                this.serverInstance.close();
            }

            if(this.proxyInstance._handle) {
                self.proxyInstance.close();
            }
        };

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