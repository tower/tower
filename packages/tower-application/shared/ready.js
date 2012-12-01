var Ready = (function(){

    function Ready() {
        this._modules = {};
    }   

    Ready.prototype.new = function(module) {
        this._modules[module] = true;
    };

    Ready.prototype.check = function(module) {
        return this._modules[module] != null;
    };

    return Ready();
})();

Tower.Ready = new Ready();
