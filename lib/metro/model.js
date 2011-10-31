var Model;
Model = (function() {
  Model.Association = require('./model/association');
  Model.Associations = require('./model/associations');
  Model.Attribute = require('./model/attribute');
  Model.Attributes = require('./model/attributes');
  Model.Dirty = require('./model/dirty');
  Model.Observing = require('./model/observing');
  Model.Persistence = require('./model/persistence');
  Model.Reflection = require('./model/reflection');
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
  Model.include(Model.Dirty);
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
  function Model(attrs) {
    var attributes, definition, definitions, key, name, value;
    if (attrs == null) {
      attrs = {};
    }
    attributes = {};
    definitions = this.constructor.keys();
    for (key in attrs) {
      value = attrs[key];
      attributes[key] = value;
    }
    for (name in definitions) {
      definition = definitions[name];
      if (!attrs.hasOwnProperty(name)) {
        attributes[name] || (attributes[name] = definition.defaultValue(this));
      }
    }
    this.attributes = this.typeCastAttributes(attributes);
    this.changes = {};
  }
  return Model;
})();
module.exports = Model;