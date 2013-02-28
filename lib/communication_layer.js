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

        c.on('end', function() {

        });

    });

    this._server.listen(8124, function() {

    });

}

CommunicationServer.create = function() {
    return new CommunicationServer();
}


module.exports = CommunicationServer;