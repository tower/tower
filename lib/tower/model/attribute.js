var __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
};

Tower.Model.Attribute = (function() {

  function Attribute(owner, name, options, block) {
    var key, type;
    if (options == null) {
      options = {};
    }
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
    this.type = type = options.type || 'String';
    if (typeof type !== 'string') {
      this.itemType = type[0];
      this.type = type = 'Array';
    }
    this.encodingType = (function() {
      switch (type) {
        case 'Id':
        case 'Date':
        case 'Array':
        case 'String':
        case 'Integer':
        case 'Float':
        case 'BigDecimal':
        case 'Time':
        case 'DateTime':
        case 'Boolean':
        case 'Object':
        case 'Number':
        case 'Geo':
          return type;
        default:
          return 'Model';
      }
    })();
    this._setDefault(options);
    this._defineAccessors(options);
    this._defineAttribute(options);
    this._addValidations(options);
    this._addIndex(options);
  }

  __defineProperty(Attribute,  "_setDefault", function(options) {
    this._default = options["default"];
    if (!this._default) {
      if (this.type === 'Geo') {
        return this._default = {
          lat: null,
          lng: null
        };
      } else if (this.type === 'Array') {
        return this._default = [];
      }
    }
  });

  __defineProperty(Attribute,  "_defineAccessors", function(options) {
    var name, serializer, type;
    name = this.name;
    type = this.type;
    serializer = Tower.Store.Serializer[type];
    this.get = options.get || (serializer ? serializer.from : void 0);
    this.set = options.set || (serializer ? serializer.to : void 0);
    if (this.get === true) {
      this.get = "get" + (Tower.Support.String.camelize(name));
    }
    if (this.set === true) {
      return this.set = "set" + (Tower.Support.String.camelize(name));
    }
  });

  __defineProperty(Attribute,  "_defineAttribute", function(options) {
    var attribute, field, name;
    name = this.name;
    attribute = {};
    field = this;
    attribute[name] = Ember.computed(function(key, value) {
      var data;
      if (arguments.length === 2) {
        data = Ember.get(this, 'data');
        return data.set(key, field.encode(value, this));
      } else {
        data = Ember.get(this, 'data');
        value = data.get(key);
        if (value === void 0) {
          value = field.defaultValue(this);
        }
        return field.decode(value, this);
      }
    }).property('data').cacheable();
    return this.owner.reopen(attribute);
  });

  __defineProperty(Attribute,  "_addValidations", function(options) {
    var key, normalizedKey, validations, _ref;
    validations = {};
    _ref = Tower.Model.Validator.keys;
    for (key in _ref) {
      normalizedKey = _ref[key];
      if (options.hasOwnProperty(key)) {
        validations[normalizedKey] = options[key];
      }
    }
    if (_.isPresent(validations)) {
      return this.owner.validates(this.name, validations);
    }
  });

  __defineProperty(Attribute,  "_addIndex", function(options) {
    var index, name, type;
    type = this.type;
    name = this.name;
    if (type === 'Geo' && !options.index) {
      index = {};
      index[name] = '2d';
      options.index = index;
    }
    if (options.index) {
      if (options.index === true) {
        return this.owner.index(this.name);
      } else {
        return this.owner.index(options.index);
      }
    }
  });

  __defineProperty(Attribute,  "validators", function() {
    var result, validator, _i, _len, _ref;
    result = [];
    _ref = this.owner.validators();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      validator = _ref[_i];
      if (validator.attributes.indexOf(this.name) !== -1) {
        result.push(validator);
      }
    }
    return result;
  });

  __defineProperty(Attribute,  "defaultValue", function(record) {
    var _default;
    _default = this._default;
    if (_.isArray(_default)) {
      return _default.concat();
    } else if (_.isHash(_default)) {
      return _.extend({}, _default);
    } else if (typeof _default === 'function') {
      return _default.call(record);
    } else {
      return _default;
    }
  });

  __defineProperty(Attribute,  "encode", function(value, binding) {
    return this.code(this.set, value, binding);
  });

  __defineProperty(Attribute,  "decode", function(value, binding) {
    return this.code(this.get, value, binding);
  });

  __defineProperty(Attribute,  "code", function(type, value, binding) {
    switch (typeof type) {
      case 'string':
        return binding[type].call(binding[type], value);
      case 'function':
        return type.call(binding, value);
      default:
        return value;
    }
  });

  return Attribute;

})();

module.exports = Tower.Model.Attribute;
