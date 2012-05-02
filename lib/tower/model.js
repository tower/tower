var __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) { 
    if(typeof parent.__extend == 'function') return parent.__extend(child);
      
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if(typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.Model = (function(_super) {
  var Model;

  function Model() {
    return Model.__super__.constructor.apply(this, arguments);
  }

  Model = __extends(Model, _super);

  Model.reopen(Ember.Evented);

  __defineProperty(Model,  "errors", null);

  __defineProperty(Model,  "init", function(attrs, options) {
    var attributes, definition, definitions, name;
    if (attrs == null) {
      attrs = {};
    }
    if (options == null) {
      options = {};
    }
    this._super.apply(this, arguments);
    definitions = this.constructor.fields();
    attributes = {};
    for (name in definitions) {
      definition = definitions[name];
      attributes[name] = definition.defaultValue(this);
    }
    this.errors = {};
    if (this.constructor.isSubClass()) {
      attributes.type || (attributes.type = this.constructor.className());
    }
    this.readOnly = options.hasOwnProperty('readOnly') ? options.readOnly : false;
    return this.setProperties(attrs);
  });

  return Model;

})(Tower.Class);

require('./model/scope');

require('./model/cursor');

require('./model/data');

require('./model/dirty');

require('./model/indexing');

require('./model/inheritance');

require('./model/metadata');

require('./model/relation');

require('./model/relations');

require('./model/attribute');

require('./model/attributes');

require('./model/persistence');

require('./model/scopes');

require('./model/serialization');

require('./model/states');

require('./model/validator');

require('./model/validations');

require('./model/timestamp');

require('./model/transactions');

require('./model/locale/en');

Tower.Model.include(Tower.Support.Callbacks);

Tower.Model.include(Tower.Model.Metadata);

Tower.Model.include(Tower.Model.Dirty);

Tower.Model.include(Tower.Model.Indexing);

Tower.Model.include(Tower.Model.Scopes);

Tower.Model.include(Tower.Model.Persistence);

Tower.Model.include(Tower.Model.Inheritance);

Tower.Model.include(Tower.Model.Serialization);

Tower.Model.include(Tower.Model.States);

Tower.Model.include(Tower.Model.Relations);

Tower.Model.include(Tower.Model.Validations);

Tower.Model.include(Tower.Model.Attributes);

Tower.Model.include(Tower.Model.Timestamp);

Tower.Model.include(Tower.Model.Transactions);

module.exports = Tower.Model;
