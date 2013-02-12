(function() {
    var options, _, fs, path, program, spawn, http, httpProxy, Status;
    // Initialize variables and core modules:
    fs = require('fs'), path = require('path'), httpProxy = require('http-proxy'), http = require('http'), spawn = require('child_process').spawn, program = require('commander');
    // node path resolution was broken before
    if(process.platform == 'win32' && process.version <= 'v0.8.5') {
        require('./packages/tower-platform/path.js')
    }

    this.log = function(str) {
        console.log('\n       ::\033[36m'+str+'\033[0m    ');
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

    Status = {
        isRunning: false,
        isCrashing: false,
        isListening: true,
        isExiting: false,
        errors: [],
        instance: null,
        request_queue: [],

        spawn: function() {
            var self = this;

            ls = spawn('node',
                [
                    '--harmony',
                    path.join(__dirname, 'packages', 'tower.js'),
                    JSON.stringify(options)
                ]
            );

            ls.stdout.on('data', function(data) {
                if(data) {
                    console.log(data.toString('utf-8'));
                }
            });

            ls.stderr.on('data', function(data) {
                self.errors.push(data);
                self.isCrashing = true;
            });

            ls.on('exit', function(code) {
                if(self.isCrashing) {
                    console.log('---------------------------', '    \033[31mApp is crashing.\033[0m', '---------------------------');

                    self.errors.forEach(function(list) {
                        console.log(list.toString());
                    });

                    self.awaitRestart();
                }
            });

            self.instance = ls;

        },

        destroy: function() {
            //console.log(this.instance.close);
        },

        awaitRestart: function() {
            console.log('       \033[31mWaiting for file changes.\033[0m    ');
        },

        restart: function() {

        }
    };

    // Export a starting function that we'll call within the
    // app's main file:
    module.exports = function() {

        function run(outer, inner, callback) {
            Status.spawn();
            var p = httpProxy.createServer(function(req, res, proxy) {
                if(Status.isCrashing) {
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });

                    Status.errors.forEach(function(err) {
                        res.write(err.toString());
                    });
                    res.write('The current app is crashing.');
                    res.end();
                } else if(Status.isListening) {
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
                //
                // Put your custom server logic here
                //
            });

            p.on('upgrade', function(req, socket, head) {
                if(Status.isListening) {
                    p.proxy.proxyWebSocketRequest(req, socket, head, {
                        host: '127.0.0.1',
                        port: inner
                    });
                } else {
                    var buffer = httpProxy.buffer(req);
                    Status.request_queue.push(function() {
                        p.proxy.proxyWebSocketRequest(req, socket, head, {
                            host: '127.0.0.1',
                            port: inner,
                            buffer: buffer
                        });
                    });
                }
            });

            p.on('proxyError', function(err, req, res) {
                res.writeHead(503, {
                    'Content-Type': 'text/plain'
                });
                res.end('Unexpected error.');
            });

            p.on('end', function() {
                console.log("The request was proxied.");
            });

            p.listen(outer, function() {
                log('Proxy server has started.');
                callback();
            });
        }

        run(options.port, 5000, function() {
            http.createServer(function(req, res) {
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.write('request successfully proxied: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
                res.end();
            }).listen(5000, function() {
                log('HTTP server has started.');
            });
        });
    };


    var start_server = function(options) {


    };

})();