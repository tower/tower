
  Metro.Model.Fields = {
    ClassMethods: {
      field: function(key, options) {
        if (options == null) options = {};
        this.fields()[key] = new Metro.Model.Field(key, options);
        if (Metro.accessors) {
          Object.defineProperty(this.prototype, key, {
            enumerable: true,
            configurable: true,
            get: function() {
              return this.get(key);
            },
            set: function(value) {
              return this.set(key, value);
            }
          });
        }
        return this;
      },
      fields: function() {
        return this._fields || (this._fields = {});
      },
      field: function(name) {
        var field;
        field = this.fields()[name];
        if (!field) {
          throw new Error("Field '" + name + "' does not exist on '" + this.name + "'");
        }
        return field;
      }
    },
    InstanceMethods: {
      get: function(name) {
        if (!this.fields.hasOwnProperty(name)) {
          this.attributes[name] = this.constructor.field(name).defaultValue(this);
        }
        return this.attributes[name];
      },
      set: function(name, value) {
        var beforeValue;
        beforeValue = this._fieldChange(name, value);
        this.attributes[name] = value;
        value;
        return this.fire("change", {
          beforeValue: beforeValue,
          value: value
        });
      },
      toUpdates: function() {
        var array, attributes, key, result, _ref;
        result = {};
        attributes = this.attributes;
        _ref = this.changes;
        for (key in _ref) {
          array = _ref[key];
          result[key] = attributes[key];
        }
        return result;
      },
      hasAttribute: function(name) {
        return this.attributes.hasOwnProperty(name);
      }
    }
  };

  module.exports = Metro.Model.Fields;
