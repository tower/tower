(function() {
  var Model;
  Model = (function() {
    function Model() {}
    Model.Association = require('./model/association');
    Model.Associations = require('./model/associations');
    Model.Attributes = require('./model/attributes');
    Model.Observing = require('./model/observing');
    Model.Persistence = require('./model/persistence');
    Model.Scope = require('./model/scope');
    Model.Scopes = require('./model/scopes');
    Model.Validation = require('./model/validation');
    Model.Validations = require('./model/validations');
    Model.initialize = function() {
      return Metro.Support.Dependencies.load("" + Metro.root + "/app/models");
    };
    Model.teardown = function() {
      return delete this._store;
    };
    Model.toString = function() {
      return "" + this.className + "(" + (this.attributes.join(", ")) + ")";
    };
    Model.store = function() {
      var _ref;
      return (_ref = this._store) != null ? _ref : this._store = new Metro.Store.Memory;
    };
    return Model;
  })();
  module.exports = Model;
}).call(this);
