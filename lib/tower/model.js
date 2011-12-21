(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Tower.Model = (function() {

    __extends(Model, Tower.Class);

    function Model(attrs) {
      var attributes, definition, definitions, key, name, value;
      if (attrs == null) attrs = {};
      definitions = this.constructor.fields();
      attributes = {};
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
      this.attributes = attributes;
      this.changes = {};
      this.errors = {};
      this.readonly = false;
    }

    return Model;

  })();

  require('./model/scope');

  require('./model/callbacks');

  require('./model/criteria');

  require('./model/dirty');

  require('./model/metadata');

  require('./model/inheritance');

  require('./model/relation');

  require('./model/relations');

  require('./model/field');

  require('./model/versioning');

  require('./model/fields');

  require('./model/persistence');

  require('./model/atomic');

  require('./model/scopes');

  require('./model/nestedAttributes');

  require('./model/serialization');

  require('./model/states');

  require('./model/validator');

  require('./model/validations');

  require('./model/timestamp');

  require('./model/locale/en');

  Tower.Model.include(Tower.Model.Persistence);

  Tower.Model.include(Tower.Model.Atomic);

  Tower.Model.include(Tower.Model.Versioning);

  Tower.Model.include(Tower.Model.Metadata);

  Tower.Model.include(Tower.Model.Dirty);

  Tower.Model.include(Tower.Model.Criteria);

  Tower.Model.include(Tower.Model.Scopes);

  Tower.Model.include(Tower.Model.States);

  Tower.Model.include(Tower.Model.Inheritance);

  Tower.Model.include(Tower.Model.Serialization);

  Tower.Model.include(Tower.Model.NestedAttributes);

  Tower.Model.include(Tower.Model.Relations);

  Tower.Model.include(Tower.Model.Validations);

  Tower.Model.include(Tower.Model.Callbacks);

  Tower.Model.include(Tower.Model.Fields);

  module.exports = Tower.Model;

}).call(this);
