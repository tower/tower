var _,
  __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
};

_ = Tower._;

Tower.ModelAttribute = (function() {

  function ModelAttribute(owner, name, options, block) {
    var key, observes, type;
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
    observes = _.castArray(options.observes);
    observes.push('data');
    this.observes = observes;
    this._setDefault(options);
    this._defineAccessors(options);
    this._defineAttribute(options);
    this._addValidations(options);
    this._addIndex(options);
  }

  __defineProperty(ModelAttribute,  "_setDefault", function(options) {
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

  __defineProperty(ModelAttribute,  "_defineAccessors", function(options) {
    var name, observed, serialize, serializer, type;
    name = this.name;
    type = this.type;
    serializer = Tower['StoreSerializer' + type];
    this.get = options.get || (serializer ? serializer.from : void 0);
    if (serialize = options.serialize || options.encode) {
      if (_[serialize]) {
        observed = this.observes.length === 2 && this.observes[0];
        this.get = function() {
          return _[serialize](this.get(observed));
        };
      } else {
        this.get = true;
      }
    }
    this.set = options.set || (serializer ? serializer.to : void 0);
    if (this.get === true) {
      this.get = "get" + (_.camelize(name));
    }
    if (this.set === true) {
      return this.set = "set" + (_.camelize(name));
    }
  });

  __defineProperty(ModelAttribute,  "_defineAttribute", function(options) {
    var attribute, computed, field, mixins, name, properties;
    name = this.name;
    attribute = {};
    field = this;
    computed = Ember.computed(function(key, value) {
      if (arguments.length === 2) {
        value = field.encode(value, this);
        value = this.setAttribute(key, value);
        return value;
      } else {
        value = this.getAttribute(key);
        if (value === void 0) {
          value = field.defaultValue(this);
        }
        return field.decode(value, this);
      }
      /*
            if arguments.length is 2
              data  = Ember.get(@, 'data')
              value = data.set(key, field.encode(value, @))
              # this is for associations, built for hasMany through. 
              # need to think about some more but it works for now.
              # you can save hasMany through, with async is true.
              if Tower.isClient && key == 'id'
                cid = data.get('_cid')
                if cid and cid != data.get('_id')
                  relations = @constructor.relations()
                  for relationName, relation of relations
                    if relation.isHasMany || relation.isHasOne
                      foreignKey = relation.foreignKey
                      relation.klass().where(foreignKey, cid).all().forEach (item) ->
                        item.set(foreignKey, value)
            
              # probably should put this into Tower.ModelData:
              Tower.cursorNotification("#{@constructor.className()}.#{key}")
              value
            else
              data  = Ember.get(@, 'data')
              value = data.get(key)
              value = field.defaultValue(@) if value == undefined
              field.decode(value, @)
      */

    });
    attribute[name] = computed.property.apply(computed, this.observes).cacheable();
    mixins = this.owner.PrototypeMixin.mixins;
    properties = mixins[mixins.length - 1].properties;
    if (properties) {
      return properties[name] = attribute[name];
    } else {
      return this.owner.reopen(attribute);
    }
  });

  __defineProperty(ModelAttribute,  "_addValidations", function(options) {
    var key, normalizedKey, validations, _ref;
    validations = {};
    _ref = Tower.ModelValidator.keys;
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

  __defineProperty(ModelAttribute,  "_addIndex", function(options) {
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

  __defineProperty(ModelAttribute,  "validators", function() {
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

  __defineProperty(ModelAttribute,  "defaultValue", function(record) {
    var _default;
    _default = this._default;
    if (_default == null) {
      return _default;
    }
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

  __defineProperty(ModelAttribute,  "encode", function(value, binding) {
    return this.code(this.set, value, binding);
  });

  __defineProperty(ModelAttribute,  "decode", function(value, binding) {
    return this.code(this.get, value, binding);
  });

  __defineProperty(ModelAttribute,  "code", function(type, value, binding) {
    switch (typeof type) {
      case 'string':
        return binding[type].call(binding[type], value);
      case 'function':
        return type.call(binding, value);
      default:
        return value;
    }
  });

  __defineProperty(ModelAttribute,  "attach", function(owner) {});

  return ModelAttribute;

})();

module.exports = Tower.ModelAttribute;
