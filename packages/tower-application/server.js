Tower.Application = function Application() {

}

Tower.Application._instance = null;

Tower.Application.prototype.route = function() {
    return new Tower.Router();
};

Tower.Application.prototype.model = function(model) {
    return new Tower.Model(model);
};

Tower.Application.prototype.bundler = function() {
    return Tower.Bundler.create();
}();

Tower.Application.create = function() {
    return (this._instance = new Tower.Application());
}

Tower.Application.run = function() {
    this._instance.app = require('express')();
    this._instance.server = (require('http')).createServer(this._instance.app);
    this._instance.listen();
};

Tower.Application.prototype.listen = function() {
    this.app.get('/', function(req, res) {
        console.log(req.url);
        res.write('<h1>Tower is Online!</h1>');
        res.end();
    });

    /**require('http').createServer(function(req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.write('request successfully proxied: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
        res.end();
    }).listen(Tower.port);**/

    this.server.listen(Tower.port, function() {
        console.log("Server is listening on port [" + Tower.port + "]");
    });
};