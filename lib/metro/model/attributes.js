
  Metro.Model.Attributes = (function() {

    function Attributes() {}

    Attributes.key = function(key, options) {
      if (options == null) options = {};
      this.keys()[key] = new Metro.Model.Attribute(key, options);
      Object.defineProperty(this.prototype, key, {
        enumerable: true,
        configurable: true,
        get: function() {
          return this.getAttribute(key);
        },
        set: function(value) {
          return this.setAttribute(key, value);
        }
      });
      return this;
    };

    Attributes.keys = function() {
      return this._keys || (this._keys = {});
    };

    Attributes.attributeDefinition = function(name) {
      var definition;
      definition = this.keys()[name];
      if (!definition) {
        throw new Error("Attribute '" + name + "' does not exist on '" + this.name + "'");
      }
      return definition;
    };

    Attributes.prototype.typeCast = function(name, value) {
      return this.constructor.attributeDefinition(name).typecast(value);
    };

    Attributes.prototype.typeCastAttributes = function(attributes) {
      var key, value;
      for (key in attributes) {
        value = attributes[key];
        attributes[key] = this.typeCast(key, value);
      }
      return attributes;
    };

    Attributes.prototype.getAttribute = function(name) {
      var _base;
      return (_base = this.attributes)[name] || (_base[name] = this.constructor.keys()[name].defaultValue(this));
    };

    if (!Attributes.hasOwnProperty("get")) Attributes.alias("get", "getAttribute");

    Attributes.prototype.setAttribute = function(name, value) {
      var beforeValue;
      beforeValue = this._trackChangedAttribute(name, value);
      return this.attributes[name] = value;
    };

    if (!Attributes.hasOwnProperty("set")) Attributes.alias("set", "setAttribute");

    return Attributes;

  })();

  module.exports = Metro.Model.Attributes;
