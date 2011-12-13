
  Metro.Model.Attribute = (function() {

    function Attribute(name, type, options) {
      if (options == null) options = {};
      this.name = name;
      this.type = options.type || "string";
      this._default = options["default"];
      this._encode = options.encode;
      this._decode = options.decode;
    }

    Attribute.prototype.defaultValue = function(record) {
      var _default;
      _default = this._default;
      switch (typeof _default) {
        case 'function':
          return _default.call(record);
        default:
          return _default;
      }
    };

    Attribute.prototype.encode = function(value, binding) {
      return this.code(this._encode, value, binding);
    };

    Attribute.prototype.decode = function(value, binding) {
      return this.code(this._decode, value, binding);
    };

    Attribute.prototype.code = function(type, value, binding) {
      switch (type) {
        case "string":
          return binding[type].call(binding[type], value);
        case "function":
          return type.call(_encode, value);
        default:
          return value;
      }
    };

    return Attribute;

  })();

  module.exports = Metro.Model.Attribute;
