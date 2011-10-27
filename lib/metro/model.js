(function() {
  var Model;
  Model = (function() {
    function Model() {
      Model.__super__.constructor.apply(this, arguments);
    }
    Model.Association = require('./model/association');
    Model.Associations = require('./model/associations');
    Model.Attribute = require('./model/attribute');
    Model.Attributes = require('./model/attributes');
    Model.Observing = require('./model/observing');
    Model.Persistence = require('./model/persistence');
    Model.Scope = require('./model/scope');
    Model.Scopes = require('./model/scopes');
    Model.Serialization = require('./model/serialization');
    Model.Validation = require('./model/validation');
    Model.Validations = require('./model/validations');
    Model.include(Model.Persistence);
    Model.include(Model.Scopes);
    Model.include(Model.Serialization);
    Model.include(Model.Associations);
    Model.include(Model.Validations);
    Model.include(Model.Attributes);
    Model.initialize = function() {
      return Metro.Support.Dependencies.load("" + Metro.root + "/app/models");
    };
    Model.teardown = function() {
      return delete this._store;
    };
    Model.store = function() {
      var _ref;
      return (_ref = this._store) != null ? _ref : this._store = new Metro.Store.Memory;
    };
    return Model;
  })();
  module.exports = Model;
}).call(this);
