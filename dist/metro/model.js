(function() {
  var __slice = Array.prototype.slice;

  Metro.Model = (function() {

    Model.initialize = function() {
      return Metro.Support.Dependencies.load("" + Metro.root + "/app/models");
    };

    Model.teardown = function() {
      return delete this._store;
    };

    Model.store = function() {
      return this._store || (this._store = new Metro.Store.Memory);
    };

    function Model(attrs) {
      var attributes, definition, definitions, key, name, value;
      if (attrs == null) attrs = {};
      attributes = {};
      definitions = this.constructor.keys();
      for (key in attrs) {
        value = attrs[key];
        attributes[key] = value;
      }
      for (name in definitions) {
        definition = definitions[name];
        if (!attrs.hasOwnProperty(name)) {
          attributes[name] || (attributes[name] = definition.defaultValue(this));
        }
      }
      this.attributes = this.typeCastAttributes(attributes);
      this.changes = {};
    }

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

    Association.include(Metro.Model.Scope);

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

  Metro.Model.Associations = (function() {

    function Associations() {}

    Associations.hasOne = function(name, options) {
      if (options == null) options = {};
    };

    Associations.hasMany = function(name, options) {
      var reflection;
      if (options == null) options = {};
      options.foreignKey = "" + (Metro.Support.String.underscore(this.name)) + "Id";
      this.reflections()[name] = reflection = new Metro.Model.Reflection("hasMany", this.name, name, options);
      Object.defineProperty(this.prototype, name, {
        enumerable: true,
        configurable: true,
        get: function() {
          return this._getHasManyAssociation(name);
        },
        set: function(value) {
          return this._setHasManyAssociation(name, value);
        }
      });
      return reflection;
    };

    Associations.belongsTo = function(name, options) {
      var reflection;
      if (options == null) options = {};
      this.reflections()[name] = reflection = new Metro.Model.Association("belongsTo", this.name, name, options);
      Object.defineProperty(this.prototype, name, {
        enumerable: true,
        configurable: true,
        get: function() {
          return this._getBelongsToAssocation(name);
        },
        set: function(value) {
          return this._setBelongsToAssocation(name, value);
        }
      });
      this.keys()["" + name + "Id"] = new Metro.Model.Attribute("" + name + "Id", options);
      Object.defineProperty(this.prototype, "" + name + "Id", {
        enumerable: true,
        configurable: true,
        get: function() {
          return this._getBelongsToAssocationId("" + name + "Id");
        },
        set: function(value) {
          return this._setBelongsToAssocationId("" + name + "Id", value);
        }
      });
      return reflection;
    };

    Associations.reflections = function() {
      return this._reflections || (this._reflections = {});
    };

    Associations.prototype._getHasManyAssociation = function(name) {
      return this.constructor.reflections()[name].association(this.id);
    };

    Associations.prototype._setHasManyAssociation = function(name, value) {
      return this.constructor.reflections()[name].association(this.id).destroyAll();
    };

    Associations.prototype._getBelongsToAssocationId = function(name) {
      return this.attributes[name];
    };

    Associations.prototype._setBelongsToAssocationId = function(name, value) {
      return this.attributes[name] = value;
    };

    Associations.prototype._getBelongsToAssocation = function(name) {
      var id;
      id = this._getBelongsToAssocationId(name);
      if (!id) return null;
      return global[this.reflections()[name].targetClassName].where({
        id: this.id
      }).first();
    };

    Associations.prototype._setBelongsToAssocation = function(name, value) {
      var id;
      id = this._getBelongsToAssocationId(name);
      if (!id) return null;
      return global[this.reflections()[name].targetClassName].where({
        id: this.id
      }).first();
    };

    return Associations;

  })();

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

  Metro.Model.Dirty = (function() {

    function Dirty() {}

    Dirty.prototype.isDirty = function() {
      var change, changes;
      changes = this.changes();
      for (change in changes) {
        return true;
      }
      return false;
    };

    Dirty.prototype.changes = function() {
      return this._changes || (this._changes = {});
    };

    Dirty.prototype._trackChangedAttribute = function(attribute, value) {
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
    };

    return Dirty;

  })();

  Metro.Model.Persistence = (function() {

    function Persistence() {}

    Persistence.create = function(attrs) {
      var record;
      record = new this(attrs);
      this.store().create(record);
      return record;
    };

    Persistence.update = function() {};

    Persistence.deleteAll = function() {
      return this.store().clear();
    };

    Persistence.prototype.isNew = function() {
      return !!!attributes.id;
    };

    Persistence.prototype.save = function(options) {
      return runCallbacks(function() {});
    };

    Persistence.prototype.update = function(options) {};

    Persistence.prototype.reset = function() {};

    Persistence.alias("reload", "reset");

    Persistence.prototype.updateAttribute = function(name, value) {};

    Persistence.prototype.updateAttributes = function(attributes) {};

    Persistence.prototype.increment = function(attribute, amount) {
      if (amount == null) amount = 1;
    };

    Persistence.prototype.decrement = function(attribute, amount) {
      if (amount == null) amount = 1;
    };

    Persistence.prototype.reload = function() {};

    Persistence.prototype["delete"] = function() {};

    Persistence.prototype.destroy = function() {};

    Persistence.prototype.createOrUpdate = function() {};

    Persistence.prototype.isDestroyed = function() {};

    Persistence.prototype.isPersisted = function() {};

    return Persistence;

  })();

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

  Metro.Model.Scopes = (function() {

    function Scopes() {}

    Scopes.scope = function(name, scope) {
      return this[name] = scope instanceof Metro.Model.Scope ? scope : this.where(scope);
    };

    Scopes.where = function() {
      var _ref;
      return (_ref = this.scoped()).where.apply(_ref, arguments);
    };

    Scopes.order = function() {
      var _ref;
      return (_ref = this.scoped()).order.apply(_ref, arguments);
    };

    Scopes.limit = function() {
      var _ref;
      return (_ref = this.scoped()).limit.apply(_ref, arguments);
    };

    Scopes.select = function() {
      var _ref;
      return (_ref = this.scoped()).select.apply(_ref, arguments);
    };

    Scopes.joins = function() {
      var _ref;
      return (_ref = this.scoped()).joins.apply(_ref, arguments);
    };

    Scopes.includes = function() {
      var _ref;
      return (_ref = this.scoped()).includes.apply(_ref, arguments);
    };

    Scopes.within = function() {
      var _ref;
      return (_ref = this.scoped()).within.apply(_ref, arguments);
    };

    Scopes.scoped = function() {
      return new Metro.Model.Scope(this.name);
    };

    Scopes.all = function(callback) {
      return this.store().all(callback);
    };

    Scopes.first = function(callback) {
      return this.store().first(callback);
    };

    Scopes.last = function(callback) {
      return this.store().last(callback);
    };

    Scopes.find = function(id, callback) {
      return this.store().find(id, callback);
    };

    Scopes.count = function(callback) {
      return this.store().count(callback);
    };

    Scopes.exists = function(callback) {
      return this.store().exists(callback);
    };

    return Scopes;

  })();

  Metro.Model.Serialization = (function() {

    function Serialization() {}

    Serialization.prototype.toXML = function() {};

    Serialization.prototype.toJSON = function() {
      return JSON.stringify(this.attributes);
    };

    Serialization.prototype.toObject = function() {};

    Serialization.prototype.clone = function() {};

    Serialization.fromJSON = function(data) {
      var i, record, records, _len;
      records = JSON.parse(data);
      if (!(records instanceof Array)) records = [records];
      for (i = 0, _len = records.length; i < _len; i++) {
        record = records[i];
        records[i] = new this(record);
      }
      return records;
    };

    return Serialization;

  })();

  Metro.Model.Validation = (function() {

    function Validation(name, value) {
      this.name = name;
      this.value = value;
      this.attributes = Array.prototype.slice.call(arguments, 2, arguments.length);
      this.validationMethod = (function() {
        switch (name) {
          case "presence":
            return this.validatePresence;
          case "min":
            return this.validateMinimum;
          case "max":
            return this.validateMaximum;
          case "count":
          case "length":
            return this.validateLength;
          case "format":
            if (typeof this.value === 'string') {
              this.value = new RegExp(this.value);
            }
            return this.validateFormat;
        }
      }).call(this);
    }

    Validation.prototype.validate = function(record) {
      var attribute, success, _i, _len, _ref;
      success = true;
      _ref = this.attributes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        attribute = _ref[_i];
        if (!this.validationMethod(record, attribute)) success = false;
      }
      return success;
    };

    Validation.prototype.validatePresence = function(record, attribute) {
      if (!record[attribute]) {
        record.errors().push({
          attribute: attribute,
          message: Metro.Support.I18n.t("metro.model.errors.validation.presence", {
            attribute: attribute
          })
        });
        return false;
      }
      return true;
    };

    Validation.prototype.validateMinimum = function(record, attribute) {
      var value;
      value = record[attribute];
      if (!(typeof value === 'number' && value >= this.value)) {
        record.errors().push({
          attribute: attribute,
          message: Metro.Support.I18n.t("metro.model.errors.validation.minimum", {
            attribute: attribute,
            value: value
          })
        });
        return false;
      }
      return true;
    };

    Validation.prototype.validateMaximum = function(record, attribute) {
      var value;
      value = record[attribute];
      if (!(typeof value === 'number' && value <= this.value)) {
        record.errors().push({
          attribute: attribute,
          message: "" + attribute + " must be a maximum of " + this.value
        });
        return false;
      }
      return true;
    };

    Validation.prototype.validateLength = function(record, attribute) {
      var value;
      value = record[attribute];
      if (!(typeof value === 'number' && value === this.value)) {
        record.errors().push({
          attribute: attribute,
          message: "" + attribute + " must be equal to " + this.value
        });
        return false;
      }
      return true;
    };

    Validation.prototype.validateFormat = function(record, attribute) {
      var value;
      value = record[attribute];
      if (!this.value.exec(value)) {
        record.errors().push({
          attribute: attribute,
          message: "" + attribute + " must be match the format " + (this.value.toString())
        });
        return false;
      }
      return true;
    };

    return Validation;

  })();

  Metro.Model.Validations = (function() {

    function Validations() {
      Validations.__super__.constructor.apply(this, arguments);
    }

    Validations.validates = function() {
      var attributes, key, options, validators, value, _results;
      attributes = Array.prototype.slice.call(arguments, 0, arguments.length);
      options = attributes.pop();
      if (typeof options !== "object") {
        Metro.throw_error("missing_options", "" + this.name + ".validates");
      }
      validators = this.validators();
      _results = [];
      for (key in options) {
        value = options[key];
        _results.push(validators.push((function(func, args, ctor) {
          ctor.prototype = func.prototype;
          var child = new ctor, result = func.apply(child, args);
          return typeof result === "object" ? result : child;
        })(Metro.Model.Validation, [key, value].concat(__slice.call(attributes)), function() {})));
      }
      return _results;
    };

    Validations.validators = function() {
      return this._validators || (this._validators = []);
    };

    Validations.prototype.validate = function() {
      var self, success, validator, validators, _i, _len;
      self = this;
      validators = this.constructor.validators();
      success = true;
      this.errors().length = 0;
      for (_i = 0, _len = validators.length; _i < _len; _i++) {
        validator = validators[_i];
        if (!validator.validate(self)) success = false;
      }
      return success;
    };

    Validations.prototype.errors = function() {
      return this._errors || (this._errors = []);
    };

    return Validations;

  })();

  Metro.Model.include(Metro.Model.Persistence);

  Metro.Model.include(Metro.Model.Scopes);

  Metro.Model.include(Metro.Model.Serialization);

  Metro.Model.include(Metro.Model.Associations);

  Metro.Model.include(Metro.Model.Validations);

  Metro.Model.include(Metro.Model.Dirty);

  Metro.Model.include(Metro.Model.Attributes);

}).call(this);
