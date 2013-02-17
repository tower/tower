Tower.Application = function Application() {

}

Tower.Application.prototype.route = function() {
    return new Tower.Router();
};