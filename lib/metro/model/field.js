
  Metro.Model.Field = (function() {

    function Field(owner, name, options) {
      var key;
      if (options == null) options = {};
      this.owner = owner;
      this.name = key = name;
      this.type = options.type || "string";
      this._default = options["default"];
      this._encode = options.encode;
      this._decode = options.decode;
      if (Metro.accessors) {
        Object.defineProperty(this.owner.prototype, name, {
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
    }

    Field.prototype.defaultValue = function(record) {
      var _default;
      _default = this._default;
      switch (typeof _default) {
        case 'function':
          return _default.call(record);
        default:
          return _default;
      }
    };

    Field.prototype.encode = function(value, binding) {
      return this.code(this._encode, value, binding);
    };

    Field.prototype.decode = function(value, binding) {
      return this.code(this._decode, value, binding);
    };

    Field.prototype.code = function(type, value, binding) {
      switch (type) {
        case "string":
          return binding[type].call(binding[type], value);
        case "function":
          return type.call(_encode, value);
        default:
          return value;
      }
    };

    return Field;

  })();

  module.exports = Metro.Model.Field;
