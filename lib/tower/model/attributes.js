
Tower.Model.Attributes = {
  ClassMethods: {
    field: function(name, options) {
      return this.fields()[name] = new Tower.Model.Attribute(this, name, options);
    },
    fields: function() {
      var _base;
      return (_base = Tower.metadataFor(this.name)).fields || (_base.fields = {});
    }
  },
  get: function(name) {
    var field;
    if (!this.has(name)) {
      field = this.constructor.fields()[name];
      if (field) this.attributes[name] = field.defaultValue(this);
    }
    return this.attributes[name];
  },
  set: function(key, value) {
    var updates, _results;
    if (typeof key === "object") {
      updates = key;
    } else {
      updates = {};
      updates[key] = value;
    }
    _results = [];
    for (key in updates) {
      value = updates[key];
      _results.push(this._set(key, value));
    }
    return _results;
  },
  _set: function(key, value) {
    this._attributeChange(key, value);
    return this.attributes[key] = value;
  },
  assignAttributes: function(attributes) {
    var key, value;
    for (key in attributes) {
      value = attributes[key];
      delete this.changes[key];
      this.attributes[key] = value;
    }
    return this;
  },
  has: function(key) {
    return this.attributes.hasOwnProperty(key);
  }
};

module.exports = Tower.Model.Attributes;
