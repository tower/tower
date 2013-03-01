var path, fs, fork, ProxyServer;

path = require('path'), fs = require('fs'), spawn = require('child_process').spawn;
ProxyServer = require('http-proxy');

/**
 * The Proxy class is the heart of the operation.
 * It keeps track of the sub-process, proxy, and http Proxy
 * so whenever anything happens, this class will deal with it.
 * @param {Object} options All the options.
 */

function Proxy(options) {

    this.options = options || {};
    this.running = false;
    this.crashing = false;
    this.listening = true;
    this.exiting = false;
    this.errors = [];
    this.proxy = null;
    this.server = null;
    this.requestQueue = [];
    this.process = null;

}

/**
 * Call this method when you want stuff to happen.
 * This will start the proxy Proxy (NOTE: You only really need
 * the proxy Proxy unless you're running the http Proxy.)
 * and also a simple http Proxy.
 * XXX: We will replace the http Proxy with Express, but we will
 *      move it into the sub-process.
 * @return {void}
 */
Proxy.prototype.run = function() {

    // Spawn the proxy Proxy:
    this.startProxy();

    // Spawn the http Proxy:
    // XXX: We'll need to move this into Tower's core packages, so we will
    //      need a way to restart the process (sub and main) for conflicting
    //      internal ports.
    //
    // One way would be to call `new Tower.HTTP.CIPError();` which would be
    // a child of the general purpose `Error` prototype/class.
    // We could then look at the instance of the error, if it matches the previous class, then
    // we'll do the regular restart.
};

Proxy.prototype.startProxy = function() {

    var self = this;
    this.proxyInstance = ProxyServer.createServer(function(req, res, proxy) {

        if(self.crashing) {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });

            self.errors.forEach(function(err) {
                res.write(err.toString());
            });
            res.write('The current app is crashing.');
            res.end();
        } else if(self.listening) {
            proxy.proxyRequest(req, res, {
                host: 'localhost',
                port: self.options.inner_port
            });
        } else {
            // Queue up request; Not listening yet.
            var buffer = Proxy.buffer(req);
            self.request_queue.push(function() {
                proxy.proxyRequest(req, res, {
                    host: 'localhost',
                    port: self.options.inner_port,
                    buffer: buffer
                });
            });
        }
    });

    this.proxyInstance.on('upgrade', function(req, socket, head) {

        if(self.listening) {

            p.proxy.proxyWebSocketRequest(req, socket, head, {
                host: '127.0.0.1',
                port: self.options.inner_port
            });

        } else {

            var buffer = Proxy.buffer(req);
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
        //log('Proxy Proxy has started.');
        console.log("Proxy server is listening on port [" + self.options.outer_port + "] and forwarding to port [" + self.options.inner_port + "]")
        self.startProcess();
    }

    );

};

Proxy.prototype.startProcess = function() {
    var self = this,
        ls;

    ls = spawn('node', ['--harmony', path.join(__dirname, '..', 'packages', 'tower.js'), JSON.stringify(options)]);

    ls.stdout.on('data', function(data) {
        if(data) {
            console.log(data.toString('utf-8'));
        }
    });

    ls.stderr.on('data', function(data) {
        data = data.toString('utf-8');

        if(data.code && data.code === 0x01) {
            // Conflicting Error:
            self.stop('Restarting the Proxy - Conflicting Inner Port.', '[33m');
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

Proxy.prototype.stop = function(msg) {
    var self = this;
    if(msg) {
        log(msg);
    }
    if(this.ProxyInstance._handle) {
        this.ProxyInstance.close();
    }

    if(this.proxyInstance._handle) {
        self.proxyInstance.close();
    }
};

module.exports = Proxy;