(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Coach.Model = (function() {

    __extends(Model, Coach.Class);

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

  Coach.Model.include(Coach.Model.Persistence);

  Coach.Model.include(Coach.Model.Atomic);

  Coach.Model.include(Coach.Model.Versioning);

  Coach.Model.include(Coach.Model.Metadata);

  Coach.Model.include(Coach.Model.Dirty);

  Coach.Model.include(Coach.Model.Criteria);

  Coach.Model.include(Coach.Model.Scopes);

  Coach.Model.include(Coach.Model.States);

  Coach.Model.include(Coach.Model.Inheritance);

  Coach.Model.include(Coach.Model.Serialization);

  Coach.Model.include(Coach.Model.NestedAttributes);

  Coach.Model.include(Coach.Model.Relations);

  Coach.Model.include(Coach.Model.Validations);

  Coach.Model.include(Coach.Model.Callbacks);

  Coach.Model.include(Coach.Model.Fields);

  module.exports = Coach.Model;

}).call(this);
