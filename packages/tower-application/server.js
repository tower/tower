Tower.Application = function Application() {

}

Tower.Application.prototype.route = function() {
    return new Tower.Router();
};

Tower.Application.prototype.model = function(model) {
    return new Tower.Model(model);
};

Tower.Application.prototype.bundler = function() {
    return new Tower.Bundler();
}()