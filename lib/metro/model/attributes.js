
  Metro.Model.Attributes = {
    ClassMethods: {
      key: function(key, options) {
        if (options == null) options = {};
        this.attributes()[key] = new Metro.Model.Attribute(key, options);
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
      attributes: function() {
        return this._attributes || (this._attributes = {});
      },
      attribute: function(name) {
        var attribute;
        attribute = this.attributes()[name];
        if (!attribute) {
          throw new Error("Attribute '" + name + "' does not exist on '" + this.name + "'");
        }
        return attribute;
      },
      typecast: function(name, value) {
        var attribute;
        attribute = this.attributes()[name];
        if (attribute) {
          return attribute.typecast(value);
        } else {
          return value;
        }
      }
    },
    InstanceMethods: {
      typecast: function(name, value) {
        return this.constructor.typecast(name, value);
      },
      get: function(name) {
        if (!this.attributes.hasOwnProperty(name)) {
          this.attributes[name] = this.constructor.attribute(name).defaultValue(this);
        }
        return this.attributes[name];
      },
      set: function(name, value) {
        var beforeValue;
        beforeValue = this._attributeChange(name, value);
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
      }
    }
  };

  module.exports = Metro.Model.Attributes;
