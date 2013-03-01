Router = function Router() {


}

Router.prototype.setup = function() {
    return this;
};

Router.prototype.render = function() {
    return this;
};

Router.Middleware = require('./middleware');

Tower.export(Router);
