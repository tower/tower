
Tower.Model.Attribute = (function() {

  Attribute.string = {
    from: function(serialized) {
      if (Tower.none(serialized)) {
        return null;
      } else {
        return String(serialized);
      }
    },
    to: function(deserialized) {
      if (Tower.none(deserialized)) {
        return null;
      } else {
        return String(deserialized);
      }
    }
  };

  Attribute.number = {
    from: function(serialized) {
      if (Tower.none(serialized)) {
        return null;
      } else {
        return Number(serialized);
      }
    },
    to: function(deserialized) {
      if (Tower.none(deserialized)) {
        return null;
      } else {
        return Number(deserialized);
      }
    }
  };

  Attribute.integer = {
    from: function(serialized) {
      if (Tower.none(serialized)) {
        return null;
      } else {
        return parseInt(serialized);
      }
    },
    to: function(deserialized) {
      if (Tower.none(deserialized)) {
        return null;
      } else {
        return parseInt(deserialized);
      }
    }
  };

  Attribute.float = {
    from: function(serialized) {
      return parseFloat(serialized);
    },
    to: function(deserialized) {
      return deserialized;
    }
  };

  Attribute.decimal = Attribute.float;

  Attribute.boolean = {
    from: function(serialized) {
      if (typeof serialized === "string") {
        return !!(serialized !== "false");
      } else {
        return Boolean(serialized);
      }
    },
    to: function(deserialized) {
      return Tower.Model.Attribute.boolean.from(deserialized);
    }
  };

  Attribute.date = {
    from: function(date) {
      return date;
    },
    to: function(date) {
      return date;
    }
  };

  Attribute.time = Attribute.date;

  Attribute.datetime = Attribute.date;

  Attribute.array = {
    from: function(serialized) {
      if (Tower.none(serialized)) {
        return null;
      } else {
        return Tower.Support.Object.toArray(serialized);
      }
    },
    to: function(deserialized) {
      return Tower.Model.Attribute.array.from(deserialized);
    }
  };

  function Attribute(owner, name, options) {
    var key, serializer;
    if (options == null) options = {};
    this.owner = owner;
    this.name = key = name;
    this.type = options.type || "String";
    if (typeof this.type !== "string") {
      this.itemType = this.type[0];
      this.type = "Array";
    }
    this.encodingType = (function() {
      switch (this.type) {
        case "Id":
        case "Date":
        case "Array":
        case "String":
        case "Integer":
        case "Float":
        case "BigDecimal":
        case "Time":
        case "DateTime":
        case "Boolean":
        case "Object":
        case "Number":
          return this.type;
        default:
          return "Model";
      }
    }).call(this);
    serializer = Tower.Model.Attribute[Tower.Support.String.camelize(this.type, true)];
    this._default = options["default"];
    this.get = options.get || (serializer ? serializer.from : void 0);
    this.set = options.set || (serializer ? serializer.to : void 0);
    if (Tower.accessors) {
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

  Attribute.prototype.defaultValue = function(record) {
    var _default;
    _default = this._default;
    if (Tower.Support.Object.isArray(_default)) {
      return _default.concat();
    } else if (Tower.Support.Object.isHash(_default)) {
      return Tower.Support.Object.extend({}, _default);
    } else if (typeof _default === "function") {
      return _default.call(record);
    } else {
      return _default;
    }
  };

  Attribute.prototype.encode = function(value, binding) {
    return this.code(this.set, value, binding);
  };

  Attribute.prototype.decode = function(value, binding) {
    return this.code(this.get, value, binding);
  };

  Attribute.prototype.code = function(type, value, binding) {
    switch (typeof type) {
      case "string":
        return binding[type].call(binding[type], value);
      case "function":
        return type.call(binding, value);
      default:
        return value;
    }
  };

  return Attribute;

})();

module.exports = Tower.Model.Attribute;
