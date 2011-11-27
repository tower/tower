(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Metro.Model = (function() {

    __extends(Model, Metro.Object);

    function Model(attrs) {
      var attributes, definition, definitions, key, name, value;
      if (attrs == null) attrs = {};
      definitions = this.constructor.keys();
      attributes = {};
      for (key in attrs) {
        value = attrs[key];
        attributes[key] = this.typecast(key, value);
      }
      for (name in definitions) {
        definition = definitions[name];
        if (!attrs.hasOwnProperty(name)) {
          attributes[name] || (attributes[name] = this.typecast(name, definition.defaultValue(this)));
        }
      }
      this.attributes = attributes;
      this.changes = {};
      this.associations = {};
      this.errors = [];
    }

    Model.prototype.toLabel = function() {
      return this.className();
    };

    Model.prototype.toPath = function() {
      return this.constructor.toParam() + "/" + this.toParam();
    };

    Model.prototype.toParam = function() {
      return this.get("id").toString();
    };

    Model.toParam = function() {
      return Metro.Support.String.parameterize(this.className());
    };

    return Model;

  })();

  require('./model/scope');

  require('./model/association');

  require('./model/associations');

  require('./model/attribute');

  require('./model/attributes');

  require('./model/persistence');

  require('./model/scopes');

  require('./model/serialization');

  require('./model/validator');

  require('./model/validations');

  Metro.Model.include(Metro.Model.Persistence);

  Metro.Model.include(Metro.Model.Scopes);

  Metro.Model.include(Metro.Model.Serialization);

  Metro.Model.include(Metro.Model.Associations);

  Metro.Model.include(Metro.Model.Validations);

  Metro.Model.include(Metro.Model.Attributes);

  module.exports = Metro.Model;

}).call(this);
