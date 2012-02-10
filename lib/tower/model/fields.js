
Tower.Model.Fields = {
  ClassMethods: {
    field: function(name, options) {
      return this.fields()[name] = new Tower.Model.Field(this, name, options);
    },
    fields: function() {
      return this._fields || (this._fields = {});
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
  set: function(name, value) {
    var key;
    if (typeof name === "object") {
      for (key in name) {
        value = name[key];
        this._set(key, value);
      }
    } else {
      this._set(name, value);
    }
    return value;
  },
  _set: function(name, value) {
    var beforeValue;
    beforeValue = this._attributeChange(name, value);
    this.attributes[name] = value;
    return value;
  },
  has: function(name) {
    return this.attributes.hasOwnProperty(name);
  },
  assignAttributes: function(attributes) {
    var key, value;
    for (key in attributes) {
      value = attributes[key];
      this.attributes[key] = value;
    }
    return this;
  }
};

module.exports = Tower.Model.Fields;
