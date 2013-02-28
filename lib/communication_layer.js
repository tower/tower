var net = require('net');
/**
 * CommunicationServer handles the communication between the master process
 * and all the spawned child processes. The master process will run a tcp
 * server, and each of the clients will connect to it. This ensures a
 * standard communication model.
 *
 * Clients/Child processes would send message for errors, shutting down, etc...
 */
function CommunicationServer() {
    this._server = net.createServer( function (c) {
        console.log("Server connected.");
        c.on('end', function() {
            console.log("Communication Layer stopped. Process is ending.")
            process.exit();
        });
        c.write('hello\r\n');
        c.pipe(c);
    });

    this._server.listen(8124, function() {
        console.log("server bound: 8124");
    });

}

CommunicationServer.create = function() {
    return new CommunicationServer();
}


module.exports = CommunicationServer;