(function() {
    var options, _, fs, path, program, spawn, http, httpProxy, Status;
    // Initialize variables and core modules:
    fs = require('fs'), path = require('path'), httpProxy = require('http-proxy'), http = require('http'), spawn = require('child_process').spawn, program = require('commander');
    // node path resolution was broken before
    if(process.platform == 'win32' && process.version <= 'v0.8.5') {
        require('./packages/tower-platform/path.js')
    }

    this.log = function(str, color) {
        if(!color) color = '[36m';
        console.log('\n       ::\033' + color + str + '\033[0m    ');
    };

    options = {
        port: 3000,
        env: 'development',
        dirname: __dirname
    };

    program.version('0.5.0').usage('[options]').option('-p, --port [number]', 'Port', parseInt).option('-e, --env [string]', 'Environment Type');

    program.parse(process.argv);

    if(program.port) {
        options.port = program.port;
    }

    if(program.env) {
        options.env = program.env;
    }

    // Export a starting function that we'll call within the
    // app's main file:
    module.exports = function(command) {

        if(!command) {
            command = 'server';
        }

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

        Server.prototype.run = function() {

            // Spawn the proxy server:
            this.startProxy();

            // Spawn the http server:
            this.startHTTP();

        };

        Server.prototype.startHTTP = function() {

        };

        Server.prototype.startProxy = function() {

            var self = this;

            this.proxyInstance = httpProxy.createServer(

            function(req, res, proxy) {
                if(self.listening) {
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });

                    Status.errors.forEach(function(err) {
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
                    Status.request_queue.push(function() {
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
                    Status.request_queue.push(function() {
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