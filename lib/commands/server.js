module.exports = function(command, args) {
    var HTTPProxy, server, options, program = require('commander'), errors = [];

    program
        .version('0.0.1')
        .option('-p, --port [number]', 'Port Number [number]', 3000)
        .option('-v, --verbose', 'Verbose Output.')
        .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
        .parse(process.argv);

    options = {
        external_port: program.port || 3000,
        internal_port: 5000,
        isCrashing: false,
        isListening: false
    };

    HTTPProxy = require('http-proxy');
    server = HTTPProxy.createServer(function(req, res, proxy) {

        if (options.isCrashing) {
            // Display crashing errors;
            res.writeHead(200, {'Content-Type': 'text/html'});

            for (var i = 0; i < errors.length; i++) {
                res.write(errors[i]);
            }

            res.end();


        } else if (options.isListening) {
            // Forward the request;
            proxy.proxyRequest(req, res, {
                host: "localhost",
                port: options.internal_port
            });
        }

    });

    server.listen(options.external_port, function() {
        console.log("Proxy Server is running on port [" + options.external_port + "]");
    });

};