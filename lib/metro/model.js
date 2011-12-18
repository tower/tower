(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Metro.Model = (function() {

    __extends(Model, Metro.Object);

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

  Metro.Model.include(Metro.Model.Persistence);

  Metro.Model.include(Metro.Model.Atomic);

  Metro.Model.include(Metro.Model.Versioning);

  Metro.Model.include(Metro.Model.Metadata);

  Metro.Model.include(Metro.Model.Dirty);

  Metro.Model.include(Metro.Model.Criteria);

  Metro.Model.include(Metro.Model.Scopes);

  Metro.Model.include(Metro.Model.States);

  Metro.Model.include(Metro.Model.Inheritance);

  Metro.Model.include(Metro.Model.Serialization);

  Metro.Model.include(Metro.Model.NestedAttributes);

  Metro.Model.include(Metro.Model.Relations);

  Metro.Model.include(Metro.Model.Validations);

  Metro.Model.include(Metro.Model.Callbacks);

  Metro.Model.include(Metro.Model.Fields);

  module.exports = Metro.Model;

}).call(this);
