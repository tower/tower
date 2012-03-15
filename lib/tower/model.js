var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Model = (function(_super) {

  __extends(Model, _super);

  Model.configure = function(object) {
    this.config || (this.config = {});
    if (typeof object === "function") object = object.call(this);
    _.extend(this.config, object);
    return this;
  };

  Model.defaults = function(object) {
    var key, value;
    for (key in object) {
      value = object[key];
      this["default"](key, value);
    }
    return this._defaults;
  };

  Model["default"] = function(key, value) {
    this._defaults || (this._defaults = {});
    return this._defaults[key] = value;
  };

  function Model(attrs, options) {
    this.initialize(attrs, options);
  }

  Model.prototype.initialize = function(attrs, options) {
    var attributes, definition, definitions, key, name, value, _results;
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
    _results = [];
    for (key in attrs) {
      value = attrs[key];
      _results.push(this.attributes[key] = value);
    }
    return _results;
  };

  return Model;

})(Tower.Class);

require('./model/scope');

require('./model/criteria');

require('./model/dirty');

require('./model/conversion');

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

Tower.Model.include(Tower.Model.Scopes);

Tower.Model.include(Tower.Model.Persistence);

Tower.Model.include(Tower.Model.Inheritance);

Tower.Model.include(Tower.Model.Serialization);

Tower.Model.include(Tower.Model.Relations);

Tower.Model.include(Tower.Model.Validations);

Tower.Model.include(Tower.Model.Attributes);

Tower.Model.include(Tower.Model.Timestamp);

module.exports = Tower.Model;
