Tower.Model = function Model(model) {

    this._prevField = null;
};

Tower.Model.prototype.field = function() {

    return this;
};

Tower.Model.prototype.validates = function() {

    return this;
};

Tower.Model.prototype.timestamps = function() {

    return this;
};