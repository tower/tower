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
        attributes[key] = this.typecast(value);
      }
      for (name in definitions) {
        definition = definitions[name];
        if (!attrs.hasOwnProperty(name)) {
          attributes[name] || (attributes[name] = this.typecast(definition.defaultValue(this)));
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

    Scope.prototype.sourceClass = function() {
      return global[this.sourceClassName];
    };

    Scope.prototype.store = function() {
      return global[this.sourceClassName].store();
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

    function Association(owner, reflection) {
      this.owner = owner;
      this.reflection = reflection;
    }

    Association.prototype.targetClass = function() {
      return global[this.reflection.targetClassName];
    };

    Association.prototype.scoped = function() {
      return (new Metro.Model.Scope(this.reflection.targetClassName)).where(this.conditions());
    };

    Association.prototype.conditions = function() {
      var result;
      result = {};
      if (this.owner.id && this.reflection.foreignKey) {
        result[this.reflection.foreignKey] = this.owner.id;
      }
      return result;
    };

    Association.delegates("where", "find", "all", "first", "last", "store", {
      to: "scoped"
    });

    return Association;

  })();

  Metro.Model.Associations = {
    ClassMethods: {
      reflections: function() {
        return this._reflections || (this._reflections = {});
      },
      hasOne: function(name, options) {
        if (options == null) options = {};
      },
      hasMany: function(name, options) {
        var reflection;
        if (options == null) options = {};
        options.foreignKey = "" + (Metro.Support.String.underscore(this.name)) + "Id";
        this.reflections()[name] = reflection = new Metro.Model.Reflection("hasMany", this.name, name, options);
        Metro.Support.Object.defineProperty(this.prototype, name, {
          enumerable: true,
          configurable: true,
          get: function() {
            return this.association(name);
          },
          set: function(value) {
            return this.association(name).set(value);
          }
        });
        return reflection;
      },
      belongsTo: function(name, options) {
        var nameId, reflection;
        if (options == null) options = {};
        this.reflections()[name] = reflection = new Metro.Model.Association("belongsTo", this.name, name, options);
        Metro.Support.Object.defineProperty(this.prototype, name, {
          enumerable: true,
          configurable: true,
          get: function() {
            return this._getBelongsToAssocation(name);
          },
          set: function(value) {
            return this._setBelongsToAssocation(name, value);
          }
        });
        nameId = "" + name + "Id";
        this.keys[nameId] = new Metro.Model.Attribute(nameId, options);
        Metro.Support.Object.defineProperty(this.prototype, nameId, {
          enumerable: true,
          configurable: true,
          get: function() {
            return this.association(name).getId();
          },
          set: function(value) {
            return this.association(name).setId(value);
          }
        });
        return reflection;
      }
    },
    InstanceMethods: {
      association: function(name) {
        var _base;
        return (_base = this.associations)[name] || (_base[name] = this.constructor.reflections()[name].association(this));
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
    included: function() {
      this.keys = {};
      return this.key("id");
    },
    ClassMethods: {
      key: function(key, options) {
        if (options == null) options = {};
        this.keys[key] = new Metro.Model.Attribute(key, options);
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
        return this;
      },
      attributeDefinition: function(name) {
        var definition;
        definition = this.keys[name];
        if (!definition) {
          throw new Error("Attribute '" + name + "' does not exist on '" + this.name + "'");
        }
        return definition;
      }
    },
    InstanceMethods: {
      typeCast: function(name, value) {
        return this.constructor.attributeDefinition(name).typecast(value);
      },
      get: function(name) {
        var _base;
        return (_base = this.attributes)[name] || (_base[name] = this.constructor.keys[name].defaultValue(this));
      },
      set: function(name, value) {
        var beforeValue;
        beforeValue = this.attributes[name];
        this.attributes[name] = value;
        this._attributeChange(beforeValue, value);
        return value;
      }
    }
  };

  Metro.Model.Persistence = {
    ClassMethods: {
      create: function(attrs) {
        return this.store().create(new this(attrs));
      },
      update: function() {},
      deleteAll: function() {
        return this.store().clear();
      }
    },
    InstanceMethods: {
      isNew: function() {
        return !!!attributes.id;
      },
      save: function(options) {},
      update: function(options) {},
      reset: function() {},
      updateAttribute: function(name, value) {},
      updateAttributes: function(attributes) {},
      increment: function(attribute, amount) {
        if (amount == null) amount = 1;
      },
      decrement: function(attribute, amount) {
        if (amount == null) amount = 1;
      },
      reload: function() {},
      "delete": function() {},
      destroy: function() {},
      createOrUpdate: function() {},
      isDestroyed: function() {},
      isPersisted: function() {},
      isDirty: function() {
        return Metro.Support.Object.isPresent(this.changes());
      },
      _trackChangedAttribute: function(attribute, value) {
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

  Metro.Model.Reflection = (function() {

    function Reflection(type, sourceClassName, name, options) {
      if (options == null) options = {};
      this.type = type;
      this.sourceClassName = sourceClassName;
      this.targetClassName = options.className || Metro.Support.String.camelize(Metro.Support.String.singularize(name));
      this.foreignKey = options.foreignKey;
    }

    Reflection.prototype.targetClass = function() {
      return global[this.targetClassName];
    };

    Reflection.prototype.association = function(owner) {
      return new Metro.Model.Association(owner, this);
    };

    return Reflection;

  })();

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
        return new Metro.Model.Scope(this.name);
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
    toForm: function() {},
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
          return new this.Presence;
        case "count":
        case "length":
        case "min":
        case "max":
          return new this.Length;
        case "format":
          return new this.Format(value, attributes);
      }
    };

    function Validator(value, attributes) {
      this.value = value;
      this.attributes = attributes;
    }

    Validator.prototype.validateEach = function(record, errors) {
      var attribute, success, _i, _len, _ref;
      if (errors == null) errors = [];
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
          _results.push(validators.push(Metro.Model.Validation.create(key, value, attributes)));
        }
        return _results;
      },
      validators: function() {
        return this._validators || (this._validators = []);
      }
    },
    validate: function() {
      var success, validator, validators, _i, _len;
      validators = this.constructor.validators;
      success = true;
      this.errors.length = 0;
      for (_i = 0, _len = validators.length; _i < _len; _i++) {
        validator = validators[_i];
        if (!validator.validate(this)) success = false;
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
