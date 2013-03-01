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
    console.log(Tower.Router);
    this._instance.app.use(Tower.Router.Middleware);
    this._instance.listen();
};

Tower.Application.prototype.listen = function() {

    this.server.listen(Tower.port, function() {
        console.log("Server is listening on port [" + Tower.port + "]");
    });
};