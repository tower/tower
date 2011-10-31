Metro.Model = (function() {
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
require('./model/scope');
require('./model/association');
require('./model/associations');
require('./model/attribute');
require('./model/attributes');
require('./model/dirty');
require('./model/observing');
require('./model/persistence');
require('./model/reflection');
require('./model/scopes');
require('./model/serialization');
require('./model/validation');
require('./model/validations');
Metro.Model.include(Metro.Model.Persistence);
Metro.Model.include(Metro.Model.Scopes);
Metro.Model.include(Metro.Model.Serialization);
Metro.Model.include(Metro.Model.Associations);
Metro.Model.include(Metro.Model.Validations);
Metro.Model.include(Metro.Model.Dirty);
Metro.Model.include(Metro.Model.Attributes);
module.exports = Model;