var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Model = (function(_super) {

  __extends(Model, _super);

  function Model(attributes, options) {
    this.initialize(attributes, options);
  }

  Model.prototype.initialize = function(attrs, options) {
    var attributes, definition, definitions, key, name, value, _results;
    if (attrs == null) attrs = {};
    if (options == null) options = {};
    definitions = this.constructor.fields();
    attributes = {};
    for (name in definitions) {
      definition = definitions[name];
      attributes[name] = definition.defaultValue(this);
    }
    if (this.constructor.isSubClass()) {
      attributes.type || (attributes.type = this.constructor.name);
    }
    this.attributes = attributes;
    this.relations = {};
    this.changes = {
      before: {},
      after: {}
    };
    this.errors = {};
    this.operations = [];
    this.operationIndex = -1;
    this.readOnly = options.hasOwnProperty("readOnly") ? options.readOnly : false;
    this.persistent = options.hasOwnProperty("persistent") ? options.persisted : false;
    _results = [];
    for (key in attrs) {
      value = attrs[key];
      _results.push(this.set(key, value));
    }
    return _results;
  };

  return Model;

})(Tower.Class);

require('./model/scope');

require('./model/criteria');

require('./model/dirty');

require('./model/conversion');

require('./model/indexing');

require('./model/inheritance');

require('./model/relation');

require('./model/relations');

require('./model/attribute');

require('./model/attributes');

require('./model/persistence');

require('./model/scopes');

require('./model/serialization');

require('./model/validator');

require('./model/validations');

require('./model/timestamp');

require('./model/locale/en');

Tower.Model.include(Tower.Support.Callbacks);

Tower.Model.include(Tower.Model.Conversion);

Tower.Model.include(Tower.Model.Dirty);

Tower.Model.include(Tower.Model.Criteria);

Tower.Model.include(Tower.Model.Indexing);

Tower.Model.include(Tower.Model.Scopes);

Tower.Model.include(Tower.Model.Persistence);

Tower.Model.include(Tower.Model.Inheritance);

Tower.Model.include(Tower.Model.Serialization);

Tower.Model.include(Tower.Model.Relations);

Tower.Model.include(Tower.Model.Validations);

Tower.Model.include(Tower.Model.Attributes);

Tower.Model.include(Tower.Model.Timestamp);

module.exports = Tower.Model;
