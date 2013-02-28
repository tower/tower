var net = require('net');

function CommunicationLayer() {
    var client = net.connect({port: 8124}, function() {
        console.log('client connected.');
        client.write('world!\r\n');
    });

    client.on('data', function(data) {
        console.log(data.toString());
    });

    client.on('end', function() {
        console.log('client disconnected.');
    });

}

CommunicationLayer.create = function() {
    return new CommunicationLayer();
}

module.exports = CommunicationLayer;