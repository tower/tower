var net = require('net');

function CommunicationLayer() {
    var client = net.connect({port: 8124}, function() {

    });

    client.on('data', function(data) {

    });

    client.on('end', function() {

    });

}

CommunicationLayer.create = function() {
    return new CommunicationLayer();
}

module.exports = CommunicationLayer;