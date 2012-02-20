var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Model = (function(_super) {

  __extends(Model, _super);

  function Model(attrs, options) {
    var attributes, definition, definitions, key, name, value;
    if (attrs == null) attrs = {};
    if (options == null) options = {};
    definitions = this.constructor.fields();
    attributes = {};
    for (name in definitions) {
      definition = definitions[name];
      if (!attrs.hasOwnProperty(name)) {
        attributes[name] = definition.defaultValue(this);
      }
    }
    this.attributes = attributes;
    this.changes = {};
    this.errors = {};
    this.readOnly = options.hasOwnProperty("readOnly") ? options.readOnly : false;
    this.persistent = options.hasOwnProperty("persistent") ? options.persisted : false;
    for (key in attrs) {
      value = attrs[key];
      this.attributes[key] = value;
    }
  }

  return Model;

})(Tower.Class);

require('./model/scope');

require('./model/criteria');

require('./model/dirty');

require('./model/metadata');

require('./model/inheritance');

require('./model/relation');

require('./model/relations');

require('./model/field');

require('./model/fields');

require('./model/persistence');

require('./model/scopes');

require('./model/serialization');

require('./model/validator');

require('./model/validations');

require('./model/timestamp');

require('./model/locale/en');

Tower.Model.include(Tower.Support.Callbacks);

Tower.Model.include(Tower.Model.Metadata);

Tower.Model.include(Tower.Model.Dirty);

Tower.Model.include(Tower.Model.Criteria);

Tower.Model.include(Tower.Model.Scopes);

Tower.Model.include(Tower.Model.Persistence);

Tower.Model.include(Tower.Model.Inheritance);

Tower.Model.include(Tower.Model.Serialization);

Tower.Model.include(Tower.Model.Relations);

Tower.Model.include(Tower.Model.Validations);

Tower.Model.include(Tower.Model.Fields);

Tower.Model.include(Tower.Model.Timestamp);

module.exports = Tower.Model;
