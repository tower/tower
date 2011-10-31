var Controller, Field, Flash, Form, Helpers, IE, Input, Link, Redirecting, Rendering, Responding, en, fs, key, lingo, moduleKeywords, value, _, _ref;
var __slice = Array.prototype.slice, __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
}, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
Flash = (function() {
  function Flash() {
    Flash.__super__.constructor.apply(this, arguments);
  }
  return Flash;
})();
Redirecting = (function() {
  function Redirecting() {}
  Redirecting.prototype.redirectTo = function() {};
  return Redirecting;
})();
Rendering = (function() {
  function Rendering() {
    Rendering.__super__.constructor.apply(this, arguments);
  }
  Rendering.prototype.render = function() {
    var args, callback, finish, self, view, _base, _ref;
    args = Array.prototype.slice.call(arguments, 0, arguments.length);
    if (args.length >= 2 && typeof args[args.length - 1] === "function") {
      callback = args.pop();
    }
    view = new Metro.View(this);
    if ((_ref = (_base = this.headers)["Content-Type"]) == null) {
      _base["Content-Type"] = this.contentType;
    }
    self = this;
    args.push(finish = function(error, body) {
      var _ref2;
      self.body = body;
      if ((_ref2 = self.body) == null) {
        self.body = error.toString();
      }
      if (callback) {
        callback(error, body);
      }
      return self.callback();
    });
    return view.render.apply(view, args);
  };
  Rendering.prototype.renderToBody = function(options) {
    this._processOptions(options);
    return this._renderTemplate(options);
  };
  Rendering.prototype.renderToString = function() {
    var options;
    options = this._normalizeRender.apply(this, arguments);
    return this.renderToBody(options);
  };
  Rendering.prototype._renderTemplate = function(options) {
    return this.template.render(viewContext, options);
  };
  return Rendering;
})();
Responding = (function() {
  Responding.respondTo = function() {
    var _ref;
    if ((_ref = this._respondTo) == null) {
      this._respondTo = [];
    }
    return this._respondTo = this._respondTo.concat(arguments);
  };
  Responding.prototype.respondWith = function() {
    var callback, data;
    data = arguments[0];
    if (arguments.length > 1 && typeof arguments[arguments.length - 1] === "function") {
      callback = arguments[arguments.length - 1];
    }
    switch (this.format) {
      case "json":
        return this.render({
          json: data
        });
      case "xml":
        return this.render({
          xml: data
        });
      default:
        return this.render({
          action: this.action
        });
    }
  };
  Responding.prototype.call = function(request, response, next) {
    this.request = request;
    this.response = response;
    this.params = this.request.params || {};
    this.cookies = this.request.cookies || {};
    this.query = this.request.query || {};
    this.session = this.request.session || {};
    this.format = this.params.format;
    this.headers = {};
    this.callback = next;
    if (this.format && this.format !== "undefined") {
      this.contentType = Metro.Support.Path.contentType(this.format);
    } else {
      this.contentType = "text/html";
    }
    return this.process();
  };
  Responding.prototype.process = function() {
    this.processQuery();
    return this[this.params.action]();
  };
  Responding.prototype.processQuery = function() {};
  function Responding() {
    this.headers = {};
    this.status = 200;
    this.request = null;
    this.response = null;
    this.contentType = "text/html";
    this.params = {};
    this.query = {};
  }
  return Responding;
})();
Controller = (function() {
  function Controller() {
    Controller.__super__.constructor.apply(this, arguments);
  }
  Controller.Flash = require('./controller/flash');
  Controller.Redirecting = require('./controller/redirecting');
  Controller.Rendering = require('./controller/rendering');
  Controller.Responding = require('./controller/responding');
  Controller.include(Controller.Flash);
  Controller.include(Controller.Redirecting);
  Controller.include(Controller.Rendering);
  Controller.include(Controller.Responding);
  Controller.initialize = function() {
    return Metro.Support.Dependencies.load("" + Metro.root + "/app/controllers");
  };
  Controller.teardown = function() {
    delete this._helpers;
    delete this._layout;
    return delete this._theme;
  };
  Controller.reload = function() {
    this.teardown();
    return this.initialize();
  };
  Controller.helper = function(object) {
    var _ref;
    if ((_ref = this._helpers) == null) {
      this._helpers = [];
    }
    return this._helpers.push(object);
  };
  Controller.layout = function(layout) {
    return this._layout = layout;
  };
  Controller.theme = function(theme) {
    return this._theme = theme;
  };
  Controller.prototype.layout = function() {
    var layout;
    layout = this.constructor._layout;
    if (typeof layout === "function") {
      return layout.apply(this);
    } else {
      return layout;
    }
  };
  Controller.getter("controllerName", Controller, function() {
    return Metro.Support.String.camelize(this.name);
  });
  Controller.getter("controllerName", Controller.prototype, function() {
    return this.constructor.controllerName;
  });
  Controller.prototype.clear = function() {
    this.request = null;
    this.response = null;
    return this.headers = null;
  };
  return Controller;
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
    if (options == null) {
      options = {};
    }
  };
  Associations.hasMany = function(name, options) {
    var reflection;
    if (options == null) {
      options = {};
    }
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
    if (options == null) {
      options = {};
    }
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
    var _ref;
    return (_ref = this._reflections) != null ? _ref : this._reflections = {};
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
    if (!id) {
      return null;
    }
    return global[this.reflections()[name].targetClassName].where({
      id: this.id
    }).first();
  };
  Associations.prototype._setBelongsToAssocation = function(name, value) {
    var id;
    id = this._getBelongsToAssocationId(name);
    if (!id) {
      return null;
    }
    return global[this.reflections()[name].targetClassName].where({
      id: this.id
    }).first();
  };
  return Associations;
})();
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
Metro.Model.Attributes = (function() {
  function Attributes() {}
  Attributes.key = function(key, options) {
    if (options == null) {
      options = {};
    }
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
    var _ref;
    return (_ref = this._keys) != null ? _ref : this._keys = {};
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
    var _base, _ref;
    return (_ref = (_base = this.attributes)[name]) != null ? _ref : _base[name] = this.constructor.keys()[name].defaultValue(this);
  };
  if (!Attributes.hasOwnProperty("get")) {
    Attributes.alias("get", "getAttribute");
  }
  Attributes.prototype.setAttribute = function(name, value) {
    var beforeValue;
    beforeValue = this._trackChangedAttribute(name, value);
    return this.attributes[name] = value;
  };
  if (!Attributes.hasOwnProperty("set")) {
    Attributes.alias("set", "setAttribute");
  }
  return Attributes;
})();
Metro.Model.Callbacks = (function() {
  function Callbacks() {}
  Callbacks.CALLBACKS = ["afterInitialize", "afterFind", "afterTouch", "beforeValidation", "afterValidation", "beforeSave", "aroundSave", "afterSave", "beforeCreate", "aroundCreate", "afterCreate", "beforeUpdate", "aroundUpdate", "afterUpdate", "beforeDestroy", "aroundDestroy", "afterDestroy", "afterCommit", "afterRollback"];
  Callbacks.defineCallbacks = function() {
    var callback, callbacks, options, type, types, _i, _len, _ref, _ref2, _ref3, _results;
    callbacks = Metro.Support.Array.extractArgsAndOptions(arguments);
    options = callbacks.pop();
    if ((_ref = options.terminator) == null) {
      options.terminator = "result == false";
    }
    if ((_ref2 = options.scope) == null) {
      options.scope = ["kind", "name"];
    }
    if ((_ref3 = options.only) == null) {
      options.only = ["before", "around", "after"];
    }
    types = options.only.map(function(type) {
      return Metro.Support.String.camelize("_" + type);
    });
    _results = [];
    for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
      callback = callbacks[_i];
      _results.push((function() {
        var _j, _len2, _results2;
        _results2 = [];
        for (_j = 0, _len2 = types.length; _j < _len2; _j++) {
          type = types[_j];
          _results2.push(this["_define" + type + "Callback"](callback));
        }
        return _results2;
      }).call(this));
    }
    return _results;
  };
  Callbacks._defineBeforeCallback = function(name) {
    return this["before" + (Metro.Support.String.camelize("_" + name))] = function() {
      return this.setCallback.apply(this, [name, "before"].concat(__slice.call(arguments)));
    };
  };
  Callbacks._defineAroundCallback = function(name) {
    return this["around" + (Metro.Support.String.camelize("_" + name))] = function() {
      return this.setCallback.apply(this, [name, "around"].concat(__slice.call(arguments)));
    };
  };
  Callbacks._defineAfterCallback = function(name) {
    return this["after" + (Metro.Support.String.camelize("_" + name))] = function() {
      return this.setCallback.apply(this, [name, "after"].concat(__slice.call(arguments)));
    };
  };
  Callbacks.prototype.createOrUpdate = function() {
    return this.runCallbacks("save", function() {
      return this["super"];
    });
  };
  Callbacks.prototype.create = function() {
    return this.runCallbacks("create", function() {
      return this["super"];
    });
  };
  Callbacks.prototype.update = function() {
    return this.runCallbacks("update", function() {
      return this["super"];
    });
  };
  Callbacks.prototype.destroy = function() {
    return this.runCallbacks("destroy", function() {
      return this["super"];
    });
  };
  return Callbacks;
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
    var _ref;
    return (_ref = this._changes) != null ? _ref : this._changes = {};
  };
  Dirty.prototype._trackChangedAttribute = function(attribute, value) {
    var array, beforeValue, _base, _ref, _ref2;
    array = (_ref = (_base = this.changes)[attribute]) != null ? _ref : _base[attribute] = [];
    beforeValue = (_ref2 = array[0]) != null ? _ref2 : array[0] = this.attributes[attribute];
    array[1] = value;
    if (array[0] === array[1]) {
      array = null;
    }
    if (array) {
      this.changes[attribute] = array;
    } else {
      delete this.changes[attribute];
    }
    return beforeValue;
  };
  return Dirty;
})();
Metro.Model.Factory = (function() {
  function Factory() {}
  Factory.store = function() {
    var _ref;
    return (_ref = this._store) != null ? _ref : this._store = new Metro.Store.Memory;
  };
  Factory.define = function(name, options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    if (options == null) {
      options = {};
    }
    return this.store()[name] = [options, callback];
  };
  Factory.build = function(name, overrides) {
    var attributes, key, value;
    attributes = this.store()[name][1]();
    for (key in overrides) {
      value = overrides[key];
      attributes[key] = value;
    }
    return new (global[name](attributes));
  };
  Factory.create = function(name, overrides) {
    var record;
    record = this.build(name, overrides);
    record.save();
    return record;
  };
  return Factory;
})();
({
  en: {
    metro: {
      model: {
        errors: {
          validation: {
            presence: "{{attribute}} can't be blank",
            minimum: "{{attribute}} must be a minimum of {{value}}"
          }
        }
      }
    }
  }
});
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
    if (amount == null) {
      amount = 1;
    }
  };
  Persistence.prototype.decrement = function(attribute, amount) {
    if (amount == null) {
      amount = 1;
    }
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
    if (options == null) {
      options = {};
    }
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
    if (!(records instanceof Array)) {
      records = [records];
    }
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
      if (!this.validationMethod(record, attribute)) {
        success = false;
      }
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
    var _ref;
    return (_ref = this._validators) != null ? _ref : this._validators = [];
  };
  Validations.prototype.validate = function() {
    var self, success, validator, validators, _i, _len;
    self = this;
    validators = this.constructor.validators();
    success = true;
    this.errors().length = 0;
    for (_i = 0, _len = validators.length; _i < _len; _i++) {
      validator = validators[_i];
      if (!validator.validate(self)) {
        success = false;
      }
    }
    return success;
  };
  Validations.prototype.errors = function() {
    var _ref;
    return (_ref = this._errors) != null ? _ref : this._errors = [];
  };
  return Validations;
})();
Metro.Model = (function() {
  Model.initialize = function() {
    return Metro.Support.Dependencies.load("" + Metro.root + "/app/models");
  };
  Model.teardown = function() {
    return delete this._store;
  };
  Model.store = function() {
    var _ref;
    return (_ref = this._store) != null ? _ref : this._store = new Metro.Store.Memory;
  };
  function Model(attrs) {
    var attributes, definition, definitions, key, name, value;
    if (attrs == null) {
      attrs = {};
    }
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
require('./model/scope');
require('./model/association');
require('./model/associations');
require('./model/attribute');
require('./model/attributes');
require('./model/dirty');
require('./model/observing');
require('./model/persistence');
require('./model/reflection');
require('./model/scopes');
require('./model/serialization');
require('./model/validation');
require('./model/validations');
Metro.Model.include(Metro.Model.Persistence);
Metro.Model.include(Metro.Model.Scopes);
Metro.Model.include(Metro.Model.Serialization);
Metro.Model.include(Metro.Model.Associations);
Metro.Model.include(Metro.Model.Validations);
Metro.Model.include(Metro.Model.Dirty);
Metro.Model.include(Metro.Model.Attributes);
Metro.Observer.Binding = (function() {
  function Binding() {}
  return Binding;
})();
Metro.Observer = (function() {
  function Observer() {}
  return Observer;
})();
require('./observer/binding');
Metro.Presenter = (function() {
  function Presenter() {}
  return Presenter;
})();
Metro.Route.DSL = (function() {
  function DSL() {}
  DSL.prototype.match = function() {
    var _ref;
    if ((_ref = this.scope) == null) {
      this.scope = {};
    }
    return Metro.Route.create(new Metro.Route(this._extractOptions.apply(this, arguments)));
  };
  DSL.prototype.get = function() {
    return this.matchMethod.apply(this, ["get"].concat(__slice.call(arguments)));
  };
  DSL.prototype.post = function() {
    return this.matchMethod.apply(this, ["post"].concat(__slice.call(arguments)));
  };
  DSL.prototype.put = function() {
    return this.matchMethod.apply(this, ["put"].concat(__slice.call(arguments)));
  };
  DSL.prototype["delete"] = function() {
    return this.matchMethod.apply(this, ["delete"].concat(__slice.call(arguments)));
  };
  DSL.prototype.matchMethod = function(method) {
    var options;
    options = arguments.pop();
    options.via = method;
    arguments.push(options);
    this.match(options);
    return this;
  };
  DSL.prototype.scope = function() {};
  DSL.prototype.controller = function(controller, options, block) {
    options.controller = controller;
    return this.scope(options, block);
  };
  DSL.prototype.namespace = function(path, options, block) {
    options = _.extend({
      path: path,
      as: path,
      module: path,
      shallowPath: path,
      shallowPrefix: path
    }, options);
    return this.scope(options, block);
  };
  DSL.prototype.constraints = function(options, block) {
    return this.scope({
      constraints: options
    }, block);
  };
  DSL.prototype.defaults = function(options, block) {
    return this.scope({
      defaults: options
    }, block);
  };
  DSL.prototype.resource = function() {};
  DSL.prototype.resources = function() {};
  DSL.prototype.collection = function() {};
  DSL.prototype.member = function() {};
  DSL.prototype.root = function(options) {
    return this.match('/', _.extend({
      as: "root"
    }, options));
  };
  DSL.prototype._extractOptions = function() {
    var anchor, constraints, controller, defaults, format, method, name, options, path;
    path = Metro.Route.normalizePath(arguments[0]);
    options = arguments[arguments.length - 1] || {};
    options.path = path;
    format = this._extractFormat(options);
    options.path = this._extractPath(options);
    method = this._extractRequestMethod(options);
    constraints = this._extractConstraints(options);
    defaults = this._extractDefaults(options);
    controller = this._extractController(options);
    anchor = this._extractAnchor(options);
    name = this._extractName(options);
    options = _.extend(options, {
      method: method,
      constraints: constraints,
      defaults: defaults,
      name: name,
      format: format,
      controller: controller,
      anchor: anchor,
      ip: options.ip
    });
    return options;
  };
  DSL.prototype._extractFormat = function(options) {};
  DSL.prototype._extractName = function(options) {
    return options.as;
  };
  DSL.prototype._extractConstraints = function(options) {
    return options.constraints || {};
  };
  DSL.prototype._extractDefaults = function(options) {
    return options.defaults || {};
  };
  DSL.prototype._extractPath = function(options) {
    return "" + options.path + ".:format?";
  };
  DSL.prototype._extractRequestMethod = function(options) {
    return options.via || options.requestMethod;
  };
  DSL.prototype._extractAnchor = function(options) {
    return options.anchor;
  };
  DSL.prototype._extractController = function(options) {
    var action, controller, to;
    to = options.to.split('#');
    if (to.length === 1) {
      action = to[0];
    } else {
      controller = to[0];
      action = to[1];
    }
    if (controller == null) {
      controller = options.controller || this.scope.controller;
    }
    if (action == null) {
      action = options.action || this.scope.action;
    }
    controller = controller.toLowerCase().replace(/(?:Controller)?$/, "Controller");
    action = action.toLowerCase();
    return {
      name: controller,
      action: action,
      className: _.camelize("_" + controller)
    };
  };
  return DSL;
})();
Metro.Route = (function() {
  Route.include(Metro.Model.Scopes);
  Route.store = function() {
    var _ref;
    return (_ref = this._store) != null ? _ref : this._store = new Metro.Store.Memory;
  };
  Route.create = function(route) {
    return this.store().create(route);
  };
  Route.normalizePath = function(path) {
    return "/" + path.replace(/^\/|\/$/, "");
  };
  Route.initialize = function() {
    return require("" + Metro.root + "/config/routes");
  };
  Route.teardown = function() {
    this.store().clear();
    delete require.cache[require.resolve("" + Metro.root + "/config/routes")];
    return delete this._store;
  };
  Route.reload = function() {
    this.teardown();
    return this.initialize();
  };
  Route.draw = function(callback) {
    callback.apply(new Metro.Route.DSL(this));
    return this;
  };
  function Route(options) {
    if (options == null) {
      options = options;
    }
    this.path = options.path;
    this.name = options.name;
    this.method = options.method;
    this.ip = options.ip;
    this.defaults = options.defaults || {};
    this.constraints = options.constraints;
    this.options = options;
    this.controller = options.controller;
    this.keys = [];
    this.pattern = this.extractPattern(this.path);
    this.id = this.path;
    if (this.controller) {
      this.id += this.controller.name + this.controller.action;
    }
  }
  Route.prototype.match = function(path) {
    return this.pattern.exec(path);
  };
  Route.prototype.extractPattern = function(path, caseSensitive, strict) {
    var self, _ref;
    if (path instanceof RegExp) {
      return path;
    }
    self = this;
    if (path === "/") {
      return new RegExp('^' + path + '$');
    }
    path = path.replace(/(\(?)(\/)?(\.)?([:\*])(\w+)(\))?(\?)?/g, function(_, open, slash, format, symbol, key, close, optional) {
      var result, splat;
      optional = (!!optional) || (open + close === "()");
      splat = symbol === "*";
      self.keys.push({
        name: key,
        optional: !!optional,
        splat: splat
      });
      if (slash == null) {
        slash = "";
      }
      result = "";
      if (!optional || !splat) {
        result += slash;
      }
      result += "(?:";
      if (format != null) {
        result += splat ? "\\.([^.]+?)" : "\\.([^/.]+?)";
      } else {
        result += splat ? "/?(.+)" : "([^/\\.]+)";
      }
      result += ")";
      if (optional) {
        result += "?";
      }
      return result;
    });
    return new RegExp('^' + path + '$', (_ref = !!caseSensitive) != null ? _ref : {
      '': 'i'
    });
  };
  return Route;
})();
require('./route/dsl');
Metro.Support.Array = {
  extractArgs: function(args) {
    return Array.prototype.slice.call(args, 0, args.length);
  },
  extractArgsAndOptions: function(args) {
    args = Array.prototype.slice.call(args, 0, args.length);
    if (typeof args[args.length - 1] !== 'object') {
      args.push({});
    }
    return args;
  },
  argsOptionsAndCallback: function() {
    var args, callback, last, options;
    args = Array.prototype.slice.call(arguments);
    last = args.length - 1;
    if (typeof args[last] === "function") {
      callback = args[last];
      if (args.length >= 3) {
        if (typeof args[last - 1] === "object") {
          options = args[last - 1];
          args = args.slice(0, (last - 2 + 1) || 9e9);
        } else {
          options = {};
          args = args.slice(0, (last - 1 + 1) || 9e9);
        }
      } else {
        options = {};
      }
    } else if (args.length >= 2 && typeof args[last] === "object") {
      args = args.slice(0, (last - 1 + 1) || 9e9);
      options = args[last];
      callback = null;
    } else {
      options = {};
      callback = null;
    }
    return [args, options, callback];
  },
  sortBy: function(objects) {
    var arrayComparator, callbacks, sortings, valueComparator;
    sortings = Array.prototype.slice.call(arguments, 1, arguments.length);
    callbacks = sortings[sortings.length - 1] instanceof Array ? {} : sortings.pop();
    valueComparator = function(x, y) {
      if (x > y) {
        return 1;
      } else {
        if (x < y) {
          return -1;
        } else {
          return 0;
        }
      }
    };
    arrayComparator = function(a, b) {
      var x, y;
      x = [];
      y = [];
      sortings.forEach(function(sorting) {
        var aValue, attribute, bValue, direction;
        attribute = sorting[0];
        direction = sorting[1];
        aValue = a[attribute];
        bValue = b[attribute];
        if (typeof callbacks[attribute] !== "undefined") {
          aValue = callbacks[attribute](aValue);
          bValue = callbacks[attribute](bValue);
        }
        x.push(direction * valueComparator(aValue, bValue));
        return y.push(direction * valueComparator(bValue, aValue));
      });
      if (x < y) {
        return -1;
      } else {
        return 1;
      }
    };
    sortings = sortings.map(function(sorting) {
      if (!(sorting instanceof Array)) {
        sorting = [sorting, "asc"];
      }
      if (sorting[1] === "desc") {
        sorting[1] = -1;
      } else {
        sorting[1] = 1;
      }
      return sorting;
    });
    return objects.sort(function(a, b) {
      return arrayComparator(a, b);
    });
  }
};
Metro.Support.Callbacks = (function() {
  function Callbacks() {}
  return Callbacks;
})();
moduleKeywords = ['included', 'extended', 'prototype'];
Metro.Support.Class = (function() {
  function Class() {}
  Class.alias = function(to, from) {
    return this.prototype[to] = this.prototype[from];
  };
  Class.alias_method = function(to, from) {
    return this.prototype[to] = this.prototype[from];
  };
  Class.accessor = function(key, self, callback) {
    var _ref;
    if ((_ref = this._accessors) == null) {
      this._accessors = [];
    }
    this._accessors.push(key);
    this.getter(key, self, callback);
    this.setter(key, self);
    return this;
  };
  Class.getter = function(key, self, callback) {
    var _ref;
    if (self == null) {
      self = this.prototype;
    }
    if (!self.hasOwnProperty("_getAttribute")) {
      Object.defineProperty(self, "_getAttribute", {
        enumerable: false,
        configurable: true,
        value: function(key) {
          return this["_" + key];
        }
      });
    }
    if ((_ref = this._getters) == null) {
      this._getters = [];
    }
    this._getters.push(key);
    Object.defineProperty(self, "_" + key, {
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(self, key, {
      enumerable: true,
      configurable: true
    }, {
      get: function() {
        return this["_getAttribute"](key) || (callback ? this["_" + key] = callback.apply(this) : void 0);
      }
    });
    return this;
  };
  Class.setter = function(key, self) {
    var _ref;
    if (self == null) {
      self = this.prototype;
    }
    if (!self.hasOwnProperty("_setAttribute")) {
      Object.defineProperty(self, method, {
        enumerable: false,
        configurable: true,
        value: function(key, value) {
          return this["_" + key] = value;
        }
      });
    }
    if ((_ref = this._setters) == null) {
      this._setters = [];
    }
    this._setters.push(key);
    Object.defineProperty(self, "_" + key, {
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(self, key, {
      enumerable: true,
      configurable: true,
      set: function(value) {
        return this["_setAttribute"](key, value);
      }
    });
    return this;
  };
  Class.classEval = function(block) {
    return block.call(this);
  };
  Class.delegate = function(key, options) {
    var to;
    if (options == null) {
      options = {};
    }
    to = options.to;
    if (typeof this.prototype[to] === "function") {
      return this.prototype[key] = function() {
        var _ref;
        return (_ref = this[to]())[key].apply(_ref, arguments);
      };
    } else {
      return Object.defineProperty(this.prototype, key, {
        enumerable: true,
        configurable: true,
        get: function() {
          return this[to]()[key];
        }
      });
    }
  };
  Class.delegates = function() {
    var args, key, options, _i, _len, _results;
    args = Array.prototype.slice.call(arguments, 0, arguments.length);
    options = args.pop();
    _results = [];
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      key = args[_i];
      _results.push(this.delegate(key, options));
    }
    return _results;
  };
  Class.include = function(obj) {
    var c, child, clone, cloned, included, key, newproto, oldproto, parent, value, _ref;
    if (!obj) {
      throw new Error('include(obj) requires obj');
    }
    this.extend(obj);
    c = this;
    child = this;
    parent = obj;
    clone = function(fct) {
      var clone_, property;
      clone_ = function() {
        return fct.apply(this, arguments);
      };
      clone_.prototype = fct.prototype;
      for (property in fct) {
        if (fct.hasOwnProperty(property) && property !== "prototype") {
          clone_[property] = fct[property];
        }
      }
      return clone_;
    };
    if (child.__super__) {
      oldproto = child.__super__;
    }
    cloned = clone(parent);
    newproto = cloned.prototype;
    _ref = cloned.prototype;
    for (key in _ref) {
      value = _ref[key];
      if (__indexOf.call(moduleKeywords, key) < 0) {
        this.prototype[key] = value;
      }
    }
    if (oldproto) {
      cloned.prototype = oldproto;
    }
    child.__super__ = newproto;
    included = obj.included;
    if (included) {
      included.apply(obj.prototype);
    }
    return this;
  };
  Class.extend = function(obj) {
    var extended, key, value;
    if (!obj) {
      throw new Error('extend(obj) requires obj');
    }
    for (key in obj) {
      value = obj[key];
      if (__indexOf.call(moduleKeywords, key) < 0) {
        this[key] = value;
      }
    }
    extended = obj.extended;
    if (extended) {
      extended.apply(obj);
    }
    return this;
  };
  Class["new"] = function() {
    return (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return typeof result === "object" ? result : child;
    })(this, arguments, function() {});
  };
  Class.instanceMethods = function() {
    var key, result;
    result = [];
    for (key in this.prototype) {
      result.push(key);
    }
    return result;
  };
  Class.classMethods = function() {
    var key, result;
    result = [];
    for (key in this) {
      result.push(key);
    }
    return result;
  };
  Class.prototype.instanceExec = function() {
    var _ref;
    return (_ref = arguments[0]).apply.apply(_ref, [this].concat(__slice.call(arguments.slice(1))));
  };
  Class.prototype.instanceEval = function(block) {
    return block.apply(this);
  };
  Class.prototype.send = function(method) {
    var _ref;
    if (this[method]) {
      return (_ref = this[method]).apply.apply(_ref, arguments);
    } else {
      if (this.methodMissing) {
        return this.methodMissing.apply(this, arguments);
      }
    }
  };
  Class.prototype.methodMissing = function(method) {};
  return Class;
})();
_ref = Metro.Support.Class;
for (key in _ref) {
  value = _ref[key];
  Function.prototype[key] = value;
}
Metro.Support.Concern = (function() {
  function Concern() {
    Concern.__super__.constructor.apply(this, arguments);
  }
  Concern.included = function() {
    var _ref2;
    if ((_ref2 = this._dependencies) == null) {
      this._dependencies = [];
    }
    if (this.hasOwnProperty("ClassMethods")) {
      this.extend(this.ClassMethods);
    }
    if (this.hasOwnProperty("InstanceMethods")) {
      return this.include(this.InstanceMethods);
    }
  };
  Concern._appendFeatures = function() {};
  return Concern;
})();
fs = require('fs');
Metro.Support.Dependencies = (function() {
  function Dependencies() {}
  Dependencies.load = function(directory) {
    var path, paths, _i, _len, _results;
    paths = require('findit').sync(directory);
    _results = [];
    for (_i = 0, _len = paths.length; _i < _len; _i++) {
      path = paths[_i];
      _results.push(this.loadPath(path));
    }
    return _results;
  };
  Dependencies.loadPath = function(path) {
    var keys, klass, self;
    self = this;
    keys = this.keys;
    klass = Metro.Support.Path.basename(path).split(".")[0];
    klass = Metro.Support.String.camelize("_" + klass);
    if (!keys[klass]) {
      keys[klass] = new Metro.Support.Path(path);
      return global[klass] = require(path);
    }
  };
  Dependencies.clear = function() {
    var file, key, _ref2, _results;
    _ref2 = this.keys;
    _results = [];
    for (key in _ref2) {
      file = _ref2[key];
      _results.push(this.clearDependency(key));
    }
    return _results;
  };
  Dependencies.clearDependency = function(key) {
    var file;
    file = this.keys[key];
    delete require.cache[require.resolve(file.path)];
    global[key] = null;
    delete global[key];
    this.keys[key] = null;
    return delete this.keys[key];
  };
  Dependencies.reloadModified = function() {
    var file, key, keys, self, _results;
    self = this;
    keys = this.keys;
    _results = [];
    for (key in keys) {
      file = keys[key];
      _results.push(file.stale() ? (self.clearDependency(key), keys[key] = file, global[key] = require(file.path)) : void 0);
    }
    return _results;
  };
  Dependencies.keys = {};
  return Dependencies;
})();
Metro.Support.I18n = (function() {
  function I18n() {}
  I18n.defaultLanguage = "en";
  I18n.translate = function(key, options) {
    if (options == null) {
      options = {};
    }
    if (options.hasOwnProperty("tense")) {
      key += "." + options.tense;
    }
    if (options.hasOwnProperty("count")) {
      switch (options.count) {
        case 0:
          key += ".none";
          break;
        case 1:
          key += ".one";
          break;
        default:
          key += ".other";
      }
    }
    return this.interpolator().render(this.lookup(key, options.language), {
      locals: options
    });
  };
  I18n.t = I18n.translate;
  I18n.lookup = function(key, language) {
    var part, parts, result, _i, _len;
    if (language == null) {
      language = this.defaultLanguage;
    }
    parts = key.split(".");
    result = this.store[language];
    try {
      for (_i = 0, _len = parts.length; _i < _len; _i++) {
        part = parts[_i];
        result = result[part];
      }
    } catch (error) {
      result = null;
    }
    if (result == null) {
      throw new Error("Translation doesn't exist for '" + key + "'");
    }
    return result;
  };
  I18n.store = {};
  I18n.interpolator = function() {
    var _ref2;
    return (_ref2 = this._interpolator) != null ? _ref2 : this._interpolator = new (require('shift').Mustache);
  };
  return I18n;
})();
IE = (function() {
  function IE() {}
  return IE;
})();
en = {
  date: {
    formats: {
      "default": "%Y-%m-%d",
      short: "%b %d",
      long: "%B %d, %Y"
    },
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    abbrDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    monthNames: [null, "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    abbrMonthNames: [null, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    order: ["year", "month", "day"]
  },
  time: {
    formats: {
      "default": "%a, %d %b %Y %H:%M:%S %z",
      short: "%d %b %H:%M",
      long: "%B %d, %Y %H:%M"
    },
    am: "am",
    pm: "pm"
  },
  support: {
    array: {
      wordsConnector: ", ",
      twoWordsConnector: " and ",
      lastWordConnector: ", and "
    }
  }
};
Metro.Support.Lookup = (function() {
  function Lookup(options) {
    if (options == null) {
      options = {};
    }
    this.root = options.root;
    this.extensions = this._normalizeExtensions(options.extensions);
    this.aliases = this._normalizeAliases(options.aliases || {});
    this.paths = this._normalizePaths(options.paths);
    this.patterns = {};
    this._entries = {};
  }
  Lookup.prototype.find = function(source) {
    var basename, directory, path, paths, result, root, _i, _len;
    source = source.replace(/(?:\/\.{2}\/|^\/)/g, "");
    result = [];
    root = this.root;
    paths = source[0] === "." ? [Metro.Support.Path.absolutePath(source, root)] : this.paths.map(function(path) {
      return Metro.Support.Path.join(path, source);
    });
    for (_i = 0, _len = paths.length; _i < _len; _i++) {
      path = paths[_i];
      directory = Metro.Support.Path.dirname(path);
      basename = Metro.Support.Path.basename(path);
      if (this.pathsInclude(directory)) {
        result = result.concat(this.match(directory, basename));
      }
    }
    return result;
  };
  Lookup.prototype.pathsInclude = function(directory) {
    var path, _i, _len, _ref2;
    _ref2 = this.paths;
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      path = _ref2[_i];
      if (path.substr(0, directory.length) === directory) {
        return true;
      }
    }
    return false;
  };
  Lookup.prototype.match = function(directory, basename) {
    var entries, entry, i, match, matches, pattern, _i, _len, _len2;
    entries = this.entries(directory);
    pattern = this.pattern(basename);
    matches = [];
    for (_i = 0, _len = entries.length; _i < _len; _i++) {
      entry = entries[_i];
      if (Metro.Support.Path.isFile(Metro.Support.Path.join(directory, entry)) && !!entry.match(pattern)) {
        matches.push(entry);
      }
    }
    matches = this.sort(matches, basename);
    for (i = 0, _len2 = matches.length; i < _len2; i++) {
      match = matches[i];
      matches[i] = Metro.Support.Path.join(directory, match);
    }
    return matches;
  };
  Lookup.prototype.sort = function(matches, basename) {
    return matches;
  };
  Lookup.prototype._normalizePaths = function(paths) {
    var path, result, _i, _len;
    result = [];
    for (_i = 0, _len = paths.length; _i < _len; _i++) {
      path = paths[_i];
      if (path !== ".." && path !== ".") {
        result.push(Metro.Support.Path.absolutePath(path, this.root));
      }
    }
    return result;
  };
  Lookup.prototype._normalizeExtension = function(extension) {
    return extension.replace(/^\.?/, ".");
  };
  Lookup.prototype._normalizeExtensions = function(extensions) {
    var extension, result, _i, _len;
    result = [];
    for (_i = 0, _len = extensions.length; _i < _len; _i++) {
      extension = extensions[_i];
      result.push(this._normalizeExtension(extension));
    }
    return result;
  };
  Lookup.prototype._normalizeAliases = function(aliases) {
    var key, result, value;
    if (!aliases) {
      return null;
    }
    result = {};
    for (key in aliases) {
      value = aliases[key];
      result[this._normalizeExtension(key)] = this._normalizeExtensions(value);
    }
    return result;
  };
  Lookup.prototype.escape = function(string) {
    return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };
  Lookup.prototype.escapeEach = function() {
    var args, i, item, result, _len;
    result = [];
    args = arguments[0];
    for (i = 0, _len = args.length; i < _len; i++) {
      item = args[i];
      result[i] = this.escape(item);
    }
    return result;
  };
  Lookup.prototype.entries = function(path) {
    var entries, entry, result, _i, _len;
    if (!this._entries[path]) {
      result = [];
      if (Metro.Support.Path.exists(path)) {
        entries = Metro.Support.Path.entries(path);
      } else {
        entries = [];
      }
      for (_i = 0, _len = entries.length; _i < _len; _i++) {
        entry = entries[_i];
        if (!entry.match(/^\.|~$|^\#.*\#$/)) {
          result.push(entry);
        }
      }
      this._entries[path] = result.sort();
    }
    return this._entries[path];
  };
  Lookup.prototype.pattern = function(source) {
    var _base, _ref2;
    return (_ref2 = (_base = this.patterns)[source]) != null ? _ref2 : _base[source] = this.buildPattern(source);
  };
  Lookup.prototype.buildPattern = function(source) {
    var extension, extensions, slug;
    extension = Metro.Support.Path.extname(source);
    slug = Metro.Support.Path.basename(source, extension);
    extensions = [extension];
    if (this.aliases[extension]) {
      extensions = extensions.concat(this.aliases[extension]);
    }
    return new RegExp("^" + this.escape(slug) + "(?:" + this.escapeEach(extensions).join("|") + ").*");
  };
  return Lookup;
})();
Metro.Support.Naming = (function() {
  function Naming() {}
  return Naming;
})();
Metro.Support.Number = {
  isInt: function(n) {
    return n === +n && n === (n | 0);
  },
  isFloat: function(n) {
    return n === +n && n !== (n | 0);
  }
};
_ = require('underscore');
Metro.Support.Object = {
  isA: function(object, isa) {},
  isHash: function() {
    var object;
    object = arguments[0] || this;
    return _.isObject(object) && !(_.isFunction(object) || _.isArray(object));
  },
  isPresent: function(object) {
    var key, value;
    for (key in object) {
      value = object[key];
      return true;
    }
    return false;
  },
  isBlank: function(object) {
    var key, value;
    for (key in object) {
      value = object[key];
      return false;
    }
    return true;
  }
};
Metro.Support.RegExp = {
  escape: function(string) {
    return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  },
  escapeEach: function() {
    var args, i, item, result, _len;
    result = [];
    args = arguments[0];
    for (i = 0, _len = args.length; i < _len; i++) {
      item = args[i];
      result[i] = this.escape(item);
    }
    return result;
  }
};
_ = require("underscore");
_.mixin(require("underscore.string"));
lingo = require("lingo").en;
Metro.Support.String = {
  camelize: function() {
    return _.camelize("_" + (arguments[0] || this));
  },
  constantize: function() {
    return global[this.camelize.apply(this, arguments)];
  },
  underscore: function() {
    return _.underscored(arguments[0] || this);
  },
  titleize: function() {
    return _.titleize(arguments[0] || this);
  }
};
Metro.Support.Time = (function() {
  Time._lib = function() {
    return require('moment');
  };
  Time.zone = function() {
    return this;
  };
  Time.now = function() {
    return new this();
  };
  function Time() {
    this.moment = this.constructor._lib()();
  }
  Time.prototype.toString = function() {
    return this._date.toString();
  };
  Time.prototype.beginningOfWeek = function() {};
  Time.prototype.week = function() {
    return parseInt(this.moment.format("w"));
  };
  Time.prototype.dayOfWeek = function() {
    return this.moment.day();
  };
  Time.prototype.dayOfMonth = function() {
    return parseInt(this.moment.format("D"));
  };
  Time.prototype.dayOfYear = function() {
    return parseInt(this.moment.format("DDD"));
  };
  Time.prototype.meridiem = function() {
    return this.moment.format("a");
  };
  Time.prototype.zoneName = function() {
    return this.moment.format("z");
  };
  Time.prototype.strftime = function(format) {
    return this.moment.format(format);
  };
  Time.prototype.beginningOfDay = function() {
    this.moment.seconds(0);
    return this;
  };
  Time.prototype.beginningOfWeek = function() {
    this.moment.seconds(0);
    this.moment.subtract('days', 6 - this.dayOfWeek());
    return this;
  };
  Time.prototype.beginningOfMonth = function() {
    this.moment.seconds(0);
    this.moment.subtract('days', 6 - this.dayOfMonth());
    return this;
  };
  Time.prototype.beginningOfYear = function() {
    this.moment.seconds(0);
    return this.moment.subtract('days', 6 - this.dayOfMonth());
  };
  Time.prototype.toDate = function() {
    return this.moment._d;
  };
  return Time;
})();
Metro.Support.Time.TimeWithZone = (function() {
  __extends(TimeWithZone, Metro.Support.Time);
  function TimeWithZone() {
    TimeWithZone.__super__.constructor.apply(this, arguments);
  }
  return TimeWithZone;
})();
Metro.Support = {};
require('./support/array');
require('./support/class');
require('./support/callbacks');
require('./support/concern');
require('./support/dependencies');
require('./support/ie');
require('./support/i18n');
require('./support/lookup');
require('./support/number');
require('./support/object');
require('./support/path');
require('./support/string');
require('./support/regexp');
require('./support/time');
Field = (function() {
  function Field() {}
  return Field;
})();
Form = (function() {
  function Form() {}
  return Form;
})();
Input = (function() {
  function Input() {}
  return Input;
})();
Link = (function() {
  __extends(Link, Metro.Components.Base);
  function Link() {
    Link.__super__.constructor.apply(this, arguments);
  }
  Link.prototype.render = function() {};
  return Link;
})();
Helpers = (function() {
  function Helpers() {}
  Helpers.prototype.stylesheetLinkTag = function(source) {
    return "<link href=\"" + (this.assetPath(source, {
      directory: Metro.Assets.stylesheetDirectory,
      ext: "css"
    })) + "\"></link>";
  };
  Helpers.prototype.assetPath = function(source, options) {
    if (options == null) {
      options = {};
    }
    if (options.digest === void 0) {
      options.digest = !!Metro.env.match(/(development|test)/);
    }
    return Metro.Application.assets().computePublicPath(source, options);
  };
  Helpers.prototype.javascriptIncludeTag = function(path) {};
  Helpers.prototype.titleTag = function(title) {
    return "<title>" + title + "</title>";
  };
  Helpers.prototype.metaTag = function(name, content) {};
  Helpers.prototype.tag = function(name, options) {};
  Helpers.prototype.linkTag = function(title, path, options) {};
  Helpers.prototype.imageTag = function(path, options) {};
  return Helpers;
})();
Metro.View.Lookup = (function() {
  function Lookup() {}
  Lookup.initialize = function() {
    this.resolveLoadPaths();
    this.resolveTemplatePaths();
    return Metro.Support.Dependencies.load("" + Metro.root + "/app/helpers");
  };
  Lookup.teardown = function() {};
  Lookup.resolveLoadPaths = function() {
    var file;
    file = Metro.Support.Path;
    return this.loadPaths = _.map(this.loadPaths, function(path) {
      return file.expandPath(path);
    });
  };
  Lookup.lookup = function(view) {
    var pathsByName, pattern, result, template, templates, _i, _len;
    pathsByName = Metro.View.pathsByName;
    result = pathsByName[view];
    if (result) {
      return result;
    }
    templates = Metro.View.paths;
    pattern = new RegExp(view + "$", "i");
    for (_i = 0, _len = templates.length; _i < _len; _i++) {
      template = templates[_i];
      if (template.split(".")[0].match(pattern)) {
        pathsByName[view] = template;
        return template;
      }
    }
    return null;
  };
  Lookup.resolveTemplatePaths = function() {
    var file, path, templatePaths, _i, _len, _ref2;
    file = require("file");
    templatePaths = this.paths;
    _ref2 = Metro.View.loadPaths;
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      path = _ref2[_i];
      file.walkSync(path, function(_path, _directories, _files) {
        var template, _file, _j, _len2, _results;
        _results = [];
        for (_j = 0, _len2 = _files.length; _j < _len2; _j++) {
          _file = _files[_j];
          template = [_path, _file].join("/");
          _results.push(templatePaths.indexOf(template) === -1 ? templatePaths.push(template) : void 0);
        }
        return _results;
      });
    }
    return templatePaths;
  };
  Lookup.loadPaths = ["./spec/spec-app/app/views"];
  Lookup.paths = [];
  Lookup.pathsByName = {};
  Lookup.engine = "jade";
  Lookup.prettyPrint = false;
  return Lookup;
})();
Rendering = (function() {
  function Rendering() {}
  Rendering.prototype.render = function() {
    var args, callback, options, self, template, _ref2;
    args = Array.prototype.slice.call(arguments, 0, arguments.length);
    if (!(args.length >= 2 && typeof args[args.length - 1] === "function")) {
      throw new Error("You must pass a callback to the render method");
    }
    callback = args.pop();
    if (args.length === 1) {
      if (typeof args[0] === "string") {
        options = {
          template: args[0]
        };
      } else {
        options = args[0];
      }
    } else {
      template = args[0];
      options = args[1];
      options.template = template;
    }
    if (options == null) {
      options = {};
    }
    options.locals = this.context(options);
    if ((_ref2 = options.type) == null) {
      options.type = Metro.View.engine;
    }
    options.engine = Metro.engine(options.type);
    if (options.hasOwnProperty("layout") && options.layout === false) {
      options.layout = false;
    } else {
      options.layout = options.layout || this.controller.layout();
    }
    self = this;
    return this._renderBody(options, function(error, body) {
      return self._renderLayout(body, options, callback);
    });
  };
  Rendering.prototype._renderBody = function(options, callback) {
    var template;
    if (options.text) {
      return callback(null, options.text);
    } else if (options.json) {
      return callback(null, typeof options.json === "string" ? options.json : JSON.stringify(options.json));
    } else {
      if (!options.inline) {
        template = Metro.View.lookup(options.template);
        template = Metro.Support.Path.read(template);
      }
      return options.engine.render(template, options.locals, callback);
    }
  };
  Rendering.prototype._renderLayout = function(body, options, callback) {
    var layout;
    if (options.layout) {
      layout = Metro.View.lookup("layouts/" + options.layout);
      layout = Metro.Support.Path.read(layout);
      options.locals.yield = body;
      return options.engine.render(layout, options.locals, callback);
    } else {
      return callback(null, body);
    }
  };
  Rendering.prototype.context = function(options) {
    var controller, key, locals;
    controller = this.controller;
    locals = {};
    for (key in controller) {
      if (key !== "constructor") {
        locals[key] = controller[key];
      }
    }
    locals = require("underscore").extend(locals, this.locals || {}, options.locals);
    if (Metro.View.prettyPrint) {
      locals.pretty = true;
    }
    return locals;
  };
  return Rendering;
})();
Metro.View = (function() {
  function View(controller) {
    this.controller = controller || (new Metro.Controller);
  }
  return View;
})();
require('./view/helpers');
require('./view/lookup');
require('./view/rendering');
Metro.View.include(Metro.View.Lookup);
Metro.View.include(Metro.View.Rendering);
global._ = require('underscore');
_.mixin(require("underscore.string"));
require('./metro/support');
require('./metro/asset');
require('./metro/application');
require('./metro/store');
require('./metro/model');
require('./metro/view');
require('./metro/controller');
require('./metro/route');
require('./metro/presenter');
require('./metro/middleware');
require('./metro/command');
require('./metro/generator');
require('./metro/spec');
Metro.configuration = null;
Metro.logger = new (require("common-logger"))({
  colorized: true
});
Metro.root = process.cwd();
Metro.publicPath = process.cwd() + "/public";
Metro.env = "test";
Metro.port = 1597;
Metro.cache = null;
Metro.version = "0.2.0";
Metro.configure = function(callback) {
  return callback.apply(this);
};
Metro.env = function() {
  return process.env();
};
Metro.application = Metro.Application.instance;
Metro.globalize = function() {
  var key, value, _ref2, _results;
  _ref2 = Metro.Support.Class;
  _results = [];
  for (key in _ref2) {
    value = _ref2[key];
    _results.push(Function.prototype[key] = value);
  }
  return _results;
};
Metro.raise = function() {
  var args, i, message, node, path, _i, _len;
  args = Array.prototype.slice.call(arguments);
  path = args.shift().split(".");
  message = Metro.locale.en;
  for (_i = 0, _len = path.length; _i < _len; _i++) {
    node = path[_i];
    message = message[node];
  }
  i = 0;
  message = message.replace(/%s/g, function() {
    return args[i++];
  });
  throw new Error(message);
};
Metro.initialize = Metro.Application.initialize;
Metro.teardown = Metro.Application.teardown;
Metro.get = function() {
  return Metro.application().client().get;
};
Metro.locale = {
  en: {
    errors: {
      missingCallback: "You must pass a callback to %s.",
      missingOption: "You must pass in the '%s' option to %s.",
      notFound: "%s not found.",
      store: {
        missingAttribute: "Missing %s in %s for '%s'"
      },
      asset: {
        notFound: "Asset not found: '%s'\n  Lookup paths: [\n%s\n  ]"
      }
    }
  }
};
Metro.engine = function(extension) {
  var _base, _ref2, _ref3;
  if ((_ref2 = this._engine) == null) {
    this._engine = {};
  }
  return (_ref3 = (_base = this._engine)[extension]) != null ? _ref3 : _base[extension] = (function() {
    switch (extension) {
      case "less":
        return new (require("shift").Less);
      case "styl":
      case "stylus":
        return new (require("shift").Stylus);
      case "coffee":
      case "coffee-script":
        return new (require("shift").CoffeeScript);
      case "jade":
        return new (require("shift").Jade);
      case "mustache":
        return new (require("shift").Mustache);
    }
  })();
};