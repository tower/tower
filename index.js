(function() {
    // Initialize variables and core modules:
    var fs = require('fs'),
        path = require('path');
    // Define a couple couples that we'll work with later:
    var __dir = __dirname;
    // This is simply for debugging purposes, or if you want
    // to run tower without being within an application's context:
    var __isApp = (process.cwd() == __dirname) ? false : true;
    // node path resolution was broken before
    if(process.platform == 'win32' && process.version <= 'v0.8.5') {
        require('./packages/tower-platform/path.js')
    }
    // Export a starting function that we'll call within the
    // app's main file:
    module.exports = function() {
        var httpProxy   = require('http-proxy');
        var http        = require('http');
        var spawn       = require('child_process').spawn;


        var Status = {
            isRunning: false,
            isCrashing: false,
            isListening: true,
            isExiting: false,
            errors: [],
            instance: null,

            spawn: function() {
                var self = this;

                ls = spawn('node', [
                        '--harmony', 
                        path.join(__dir, 'packages', 'tower.js'),
                        __isApp,
                        __dir
                    ]);

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

        function run(inner, outer, callback) {
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
                        host: 'localhost',
                        port: inner
                    });
                } else {
                    // Overflow:
                    
                }
                //
                // Put your custom server logic here
                //
            });

            p.on('end', function() {
                console.log("The request was proxied.");
            });

            p.listen(outer, callback);
        }


        run(8002, 9002, function() {
            http.createServer(function(req, res) {
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.write('request successfully proxied: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
                res.end();
            }).listen(8002);
        });
    };


    var start_server = function(options) {


        };

})();