(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Metro.Model = (function() {

    __extends(Model, Metro.Object);

    function Model(attrs) {
      var attributes, definition, definitions, key, name, value;
      if (attrs == null) attrs = {};
      definitions = this.constructor.keys();
      attributes = {};
      for (key in attrs) {
        value = attrs[key];
        attributes[key] = this.typecast(key, value);
      }
      for (name in definitions) {
        definition = definitions[name];
        if (!attrs.hasOwnProperty(name)) {
          attributes[name] || (attributes[name] = this.typecast(name, definition.defaultValue(this)));
        }
      }
      this.attributes = attributes;
      this.changes = {};
      this.associations = {};
      this.errors = [];
    }

    Model.prototype.toLabel = function() {
      return this.className();
    };

    Model.prototype.toPath = function() {
      return this.constructor.toParam() + "/" + this.toParam();
    };

    Model.prototype.toParam = function() {
      return this.get("id").toString();
    };

    Model.toParam = function() {
      return Metro.Support.String.parameterize(this.className());
    };

    return Model;

  })();

  Metro.Model.Scope = (function() {

    function Scope(sourceClassName) {
      this.sourceClassName = sourceClassName;
      this.conditions = [];
    }

    Scope.prototype.where = function() {
      this.conditions.push(["where", arguments]);
      return this;
    };

    Scope.prototype.order = function() {
      this.conditions.push(["order", arguments]);
      return this;
    };

    Scope.prototype.limit = function() {
      this.conditions.push(["limit", arguments]);
      return this;
    };

    Scope.prototype.select = function() {
      this.conditions.push(["select", arguments]);
      return this;
    };

    Scope.prototype.joins = function() {
      this.conditions.push(["joins", arguments]);
      return this;
    };

    Scope.prototype.includes = function() {
      this.conditions.push(["includes", arguments]);
      return this;
    };

    Scope.prototype.within = function() {
      this.conditions.push(["within", arguments]);
      return this;
    };

    Scope.prototype.all = function(callback) {
      return this.store().all(this.query(), callback);
    };

    Scope.prototype.first = function(callback) {
      return this.store().first(this.query(), callback);
    };

    Scope.prototype.last = function(callback) {
      return this.store().last(this.query(), callback);
    };

    Scope.prototype.store = function() {
      return Metro.constant(this.sourceClassName).store();
    };

    Scope.prototype.query = function() {
      var condition, conditions, item, key, result, value, _i, _len;
      conditions = this.conditions;
      result = {};
      for (_i = 0, _len = conditions.length; _i < _len; _i++) {
        condition = conditions[_i];
        switch (condition[0]) {
          case "where":
            item = condition[1][0];
            for (key in item) {
              value = item[key];
              result[key] = value;
            }
            break;
          case "order":
            result._sort = condition[1][0];
        }
      }
      return result;
    };

    return Scope;

  })();

  Metro.Model.Association = (function() {

    __extends(Association, Metro.Object);

    function Association(owner, name, options) {
      if (options == null) options = {};
      if (Metro.accessors) {
        Metro.Support.Object.defineProperty(owner.prototype, name, {
          enumerable: true,
          configurable: true,
          get: function() {
            return this.association(name);
          },
          set: function(value) {
            return this.association(name).set(value);
          }
        });
      }
      this.owner = owner;
      this.name = name;
      this.targetClassName = Metro.namespaced(options.className || Metro.Support.String.camelize(name));
    }

    Association.prototype.scoped = function(record) {
      return (new Metro.Model.Scope(this.targetClassName)).where(this.conditions(record));
    };

    Association.prototype.conditions = function(record) {
      var result;
      result = {};
      if (this.foreignKey && record.id) result[this.foreignKey] = record.id;
      return result;
    };

    Association.delegate("where", "find", "all", "first", "last", "store", {
      to: "scoped"
    });

    return Association;

  })();

  require('./association/belongsTo');

  require('./association/hasMany');

  require('./association/hasOne');

  Metro.Model.Associations = {
    ClassMethods: {
      associations: function() {
        return this._associations || (this._associations = {});
      },
      association: function(name) {
        var association;
        association = this.associations()[name];
        if (!association) {
          throw new Error("Reflection for '" + name + "' does not exist on '" + this.name + "'");
        }
        return association;
      },
      hasOne: function(name, options) {
        if (options == null) options = {};
      },
      hasMany: function(name, options) {
        if (options == null) options = {};
        return this.associations()[name] = new Metro.Model.Association.HasMany(this, name, options);
      },
      belongsTo: function(name, options) {
        var association;
        if (options == null) options = {};
        this.associations()[name] = association = new Metro.Model.Association.BelongsTo(this, name, options);
        this.key("" + name + "Id");
        return association;
      }
    },
    InstanceMethods: {
      association: function(name) {
        var _base;
        return (_base = this.associations)[name] || (_base[name] = this.constructor.association(name).scoped(this));
      }
    }
  };

  Metro.Model.Attribute = (function() {

    function Attribute(name, options) {
      if (options == null) options = {};
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
      if (value === null || value === void 0) return null;
      return parseInt(value);
    };

    Attribute.prototype._typecastFloat = function(value) {
      if (value === null || value === void 0) return null;
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

  Metro.Model.Persistence = {
    ClassMethods: {
      create: function(attributes, callback) {
        return this.store().create(new this(attributes), callback);
      },
      update: function(query, attributes, callback) {
        return this.store().update(query, attributes, callback);
      },
      destroy: function(query, callback) {
        return this.store().destroy(query, callback);
      },
      updateAll: function() {},
      deleteAll: function() {
        return this.store().clear();
      },
      store: function(value) {
        if (value) this._store = value;
        return this._store || (this._store = new Metro.Store.Memory);
      }
    },
    InstanceMethods: {
      isNew: function() {
        return !!!attributes.id;
      },
      save: function(callback) {
        if (this.isNew()) {
          return this._create(callback);
        } else {
          return this._update(callback);
        }
      },
      _update: function(callback) {
        return this.constructor.update(this.toUpdates(), callback);
      },
      _create: function(callback) {
        return this.constructor.create(this.toUpdates(), callback);
      },
      reset: function() {},
      updateAttribute: function(key, value) {},
      updateAttributes: function(attributes) {
        return this.constructor.update(attributes, callback);
      },
      increment: function(attribute, amount) {
        if (amount == null) amount = 1;
      },
      decrement: function(attribute, amount) {
        if (amount == null) amount = 1;
      },
      reload: function() {},
      "delete": function() {},
      destroy: function() {},
      isDestroyed: function() {},
      isPersisted: function() {
        return !!this.isNew();
      },
      toObject: function() {
        return this.attributes;
      },
      isDirty: function() {
        return Metro.Support.Object.isPresent(this.changes);
      },
      _attributeChange: function(attribute, value) {
        var array, beforeValue, _base;
        array = (_base = this.changes)[attribute] || (_base[attribute] = []);
        beforeValue = array[0] || (array[0] = this.attributes[attribute]);
        array[1] = value;
        if (array[0] === array[1]) array = null;
        if (array) {
          this.changes[attribute] = array;
        } else {
          delete this.changes[attribute];
        }
        return beforeValue;
      }
    }
  };

  Metro.Model.Scopes = {
    ClassMethods: {
      scope: function(name, scope) {
        return this[name] = scope instanceof Metro.Model.Scope ? scope : this.where(scope);
      },
      where: function() {
        var _ref;
        return (_ref = this.scoped()).where.apply(_ref, arguments);
      },
      order: function() {
        var _ref;
        return (_ref = this.scoped()).order.apply(_ref, arguments);
      },
      limit: function() {
        var _ref;
        return (_ref = this.scoped()).limit.apply(_ref, arguments);
      },
      select: function() {
        var _ref;
        return (_ref = this.scoped()).select.apply(_ref, arguments);
      },
      joins: function() {
        var _ref;
        return (_ref = this.scoped()).joins.apply(_ref, arguments);
      },
      includes: function() {
        var _ref;
        return (_ref = this.scoped()).includes.apply(_ref, arguments);
      },
      within: function() {
        var _ref;
        return (_ref = this.scoped()).within.apply(_ref, arguments);
      },
      scoped: function() {
        return new Metro.Model.Scope(Metro.namespaced(this.name));
      },
      all: function(callback) {
        return this.store().all(callback);
      },
      first: function(callback) {
        return this.store().first(callback);
      },
      last: function(callback) {
        return this.store().last(callback);
      },
      find: function(id, callback) {
        return this.store().find(id, callback);
      },
      count: function(callback) {
        return this.store().count(callback);
      },
      exists: function(callback) {
        return this.store().exists(callback);
      }
    }
  };

  Metro.Model.Serialization = {
    ClassMethods: {
      fromJSON: function(data) {
        var i, record, records, _len;
        records = JSON.parse(data);
        if (!(records instanceof Array)) records = [records];
        for (i = 0, _len = records.length; i < _len; i++) {
          record = records[i];
          records[i] = new this(record);
        }
        return records;
      },
      fromForm: function(data) {}
    },
    toXML: function() {},
    toJSON: function() {
      return JSON.stringify(this.attributes);
    },
    toObject: function() {
      return this.attributes;
    },
    clone: function() {
      return new this.constructor(Metro.Support.Object.clone(this.attributes));
    }
  };

  Metro.Model.Validator = (function() {

    Validator.create = function(name, value, attributes) {
      switch (name) {
        case "presence":
          return new this.Presence(name, value, attributes);
        case "count":
        case "length":
        case "min":
        case "max":
          return new this.Length(name, value, attributes);
        case "format":
          return new this.Format(name, value, attributes);
      }
    };

    function Validator(name, value, attributes) {
      this.name = name;
      this.value = value;
      this.attributes = attributes;
    }

    Validator.prototype.validateEach = function(record, errors) {
      var attribute, success, _i, _len, _ref;
      success = true;
      _ref = this.attributes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        attribute = _ref[_i];
        if (!this.validate(record, attribute, errors)) success = false;
      }
      return success;
    };

    return Validator;

  })();

  require('./validator/format');

  require('./validator/length');

  require('./validator/presence');

  require('./validator/uniqueness');

  Metro.Model.Validations = {
    ClassMethods: {
      validate: function() {
        var attributes, key, options, validators, value, _results;
        attributes = Metro.Support.Array.args(arguments);
        options = attributes.pop();
        if (typeof options !== "object") {
          Metro.raise("missing_options", "" + this.name + ".validates");
        }
        validators = this.validators();
        _results = [];
        for (key in options) {
          value = options[key];
          _results.push(validators.push(Metro.Model.Validator.create(key, value, attributes)));
        }
        return _results;
      },
      validators: function() {
        return this._validators || (this._validators = []);
      }
    },
    validate: function() {
      var errors, success, validator, validators, _i, _len;
      validators = this.constructor.validators();
      success = true;
      errors = this.errors;
      errors.length = 0;
      for (_i = 0, _len = validators.length; _i < _len; _i++) {
        validator = validators[_i];
        if (!validator.validateEach(this, errors)) success = false;
      }
      return success;
    }
  };

  Metro.Model.include(Metro.Model.Persistence);

  Metro.Model.include(Metro.Model.Scopes);

  Metro.Model.include(Metro.Model.Serialization);

  Metro.Model.include(Metro.Model.Associations);

  Metro.Model.include(Metro.Model.Validations);

  Metro.Model.include(Metro.Model.Attributes);

}).call(this);
