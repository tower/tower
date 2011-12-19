
  Coach.Model.Fields = {
    ClassMethods: {
      field: function(name, options) {
        return this.fields()[name] = new Coach.Model.Field(this, name, options);
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
        if (!this.has(name)) {
          this.attributes[name] = this.constructor.fields()[name].defaultValue(this);
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

  module.exports = Coach.Model.Fields;
