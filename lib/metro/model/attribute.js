Metro.Model.Attribute = (function() {
  function Attribute(name, options) {
    if (options == null) {
      options = {};
    }
    this.name = name;
    this.type = options.type || "string";
    this._default = options["default"];
    this.typecastMethod = (function() {
      switch (this.type) {
        case Array:
        case "array":
          return this._typecastArray;
        case Date:
        case "date":
        case "time":
          return this._typecastDate;
        case Number:
        case "number":
        case "integer":
          return this._typecastInteger;
        case "float":
          return this._typecastFloat;
        default:
          return this._typecastString;
      }
    }).call(this);
  }
  Attribute.prototype.typecast = function(value) {
    return this.typecastMethod.call(this, value);
  };
  Attribute.prototype._typecastArray = function(value) {
    return value;
  };
  Attribute.prototype._typecastString = function(value) {
    return value;
  };
  Attribute.prototype._typecastDate = function(value) {
    return value;
  };
  Attribute.prototype._typecastInteger = function(value) {
    if (value === null || value === void 0) {
      return null;
    }
    return parseInt(value);
  };
  Attribute.prototype._typecastFloat = function(value) {
    if (value === null || value === void 0) {
      return null;
    }
    return parseFloat(value);
  };
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
  return Attribute;
})();
module.exports = Metro.Model.Attribute;