
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

  Attribute.geo = {
    from: function(serialized) {
      return serialized;
    },
    to: function(deserialized) {
      switch (_.kind(deserialized)) {
        case "array":
          return {
            lat: deserialized[0],
            lng: deserialized[1]
          };
        case "object":
          return {
            lat: deserialized.lat || deserialized.latitude,
            lng: deserialized.lng || deserialized.longitude
          };
        default:
          deserialized = deserialized.split(/,\ */);
          return {
            lat: parseFloat(deserialized[0]),
            lng: parseFloat(deserialized[1])
          };
      }
    }
  };

  Attribute.array = {
    from: function(serialized) {
      if (Tower.none(serialized)) {
        return null;
      } else {
        return _.castArray(serialized);
      }
    },
    to: function(deserialized) {
      return Tower.Model.Attribute.array.from(deserialized);
    }
  };

  function Attribute(owner, name, options, block) {
    var index, key, normalizedKey, serializer, validations, _ref;
    if (options == null) options = {};
    this.owner = owner;
    this.name = key = name;
    if (typeof options === 'string') {
      options = {
        type: options
      };
    } else if (typeof options === 'function') {
      block = options;
      options = {};
    }
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
        case "Geo":
          return this.type;
        default:
          return "Model";
      }
    }).call(this);
    serializer = Tower.Model.Attribute[Tower.Support.String.camelize(this.type, true)];
    this._default = options["default"];
    if (!this._default) {
      if (this.type === "Geo") {
        this._default = {
          lat: null,
          lng: null
        };
      } else if (this.type === 'Array') {
        this._default = [];
      }
    }
    if (this.type === 'Geo' && !options.index) {
      index = {};
      index[name] = "2d";
      options.index = index;
    }
    this.get = options.get || (serializer ? serializer.from : void 0);
    this.set = options.set || (serializer ? serializer.to : void 0);
    if (this.get === true) {
      this.get = "get" + (Tower.Support.String.camelize(name));
    }
    if (this.set === true) {
      this.set = "set" + (Tower.Support.String.camelize(name));
    }
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
    validations = {};
    _ref = Tower.Model.Validator.keys;
    for (key in _ref) {
      normalizedKey = _ref[key];
      if (options.hasOwnProperty(key)) validations[normalizedKey] = options[key];
    }
    if (_.isPresent(validations)) this.owner.validates(name, validations);
    if (options.index) {
      if (options.index === true) {
        this.owner.index(name);
      } else {
        this.owner.index(options.index);
      }
    }
  }

  Attribute.prototype.validators = function() {
    var result, validator, _i, _len, _ref;
    result = [];
    _ref = this.owner.validators();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      validator = _ref[_i];
      if (validator.attributes.indexOf(this.name) !== -1) result.push(validator);
    }
    return result;
  };

  Attribute.prototype.defaultValue = function(record) {
    var _default;
    _default = this._default;
    if (_.isArray(_default)) {
      return _default.concat();
    } else if (_.isHash(_default)) {
      return _.extend({}, _default);
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
