
Tower.Model.Fields = {
  ClassMethods: {
    field: function(name, options) {
      return this.fields()[name] = new Tower.Model.Field(this, name, options);
    },
    fields: function() {
      return this._fields || (this._fields = {});
    },
    schema: function() {
      return this.fields();
    }
  },
  InstanceMethods: {
    get: function(name) {
      var field;
      if (!this.has(name)) {
        field = this.constructor.fields()[name];
        if (field) this.attributes[name] = field.defaultValue(this);
      }
      return this.attributes[name];
    },
    set: function(name, value) {
      var beforeValue;
      beforeValue = this._attributeChange(name, value);
      this.attributes[name] = value;
      return value;
    },
    has: function(name) {
      return this.attributes.hasOwnProperty(name);
    }
  }
};

module.exports = Tower.Model.Fields;
