
  Metro.Model.Attributes = {
    ClassMethods: {
      key: function(key, options) {
        if (options == null) options = {};
        this.keys()[key] = new Metro.Model.Attribute(key, options);
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
      keys: function() {
        return this._keys || (this._keys = {});
      },
      attribute: function(name) {
        var attribute;
        attribute = this.keys()[name];
        if (!attribute) {
          throw new Error("Attribute '" + name + "' does not exist on '" + this.name + "'");
        }
        return attribute;
      }
    },
    InstanceMethods: {
      typecast: function(name, value) {
        return this.constructor.attribute(name).typecast(value);
      },
      get: function(name) {
        var _base;
        return (_base = this.attributes)[name] || (_base[name] = this.constructor.attribute(name).defaultValue(this));
      },
      set: function(name, value) {
        this._attributeChange(name, value);
        this.attributes[name] = value;
        return value;
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
