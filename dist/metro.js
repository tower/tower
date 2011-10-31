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
        if (!validator.validate(self)) {
          success = false;
        }
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
  Metro.View = (function() {
    function View(controller) {
      this.controller = controller || (new Metro.Controller);
    }
    return View;
  })();
  Metro.View.Helpers = (function() {
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
      var file, path, templatePaths, _i, _len, _ref;
      file = require("file");
      templatePaths = this.paths;
      _ref = Metro.View.loadPaths;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        path = _ref[_i];
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
  Metro.View.Rendering = (function() {
    function Rendering() {}
    Rendering.prototype.render = function() {
      var args, callback, options, self, template;
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
      options || (options = {});
      options.locals = this.context(options);
      options.type || (options.type = Metro.View.engine);
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
  Metro.View.include(Metro.View.Lookup);
  Metro.View.include(Metro.View.Rendering);
  Metro.Controller = (function() {
    function Controller() {
      Controller.__super__.constructor.apply(this, arguments);
    }
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
      this._helpers || (this._helpers = []);
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
  Metro.Controller.Flash = (function() {
    function Flash() {
      Flash.__super__.constructor.apply(this, arguments);
    }
    return Flash;
  })();
  Metro.Controller.Redirecting = (function() {
    function Redirecting() {}
    Redirecting.prototype.redirectTo = function() {};
    return Redirecting;
  })();
  Metro.Controller.Rendering = (function() {
    function Rendering() {
      Rendering.__super__.constructor.apply(this, arguments);
    }
    Rendering.prototype.render = function() {
      var args, callback, finish, self, view, _base;
      args = Array.prototype.slice.call(arguments, 0, arguments.length);
      if (args.length >= 2 && typeof args[args.length - 1] === "function") {
        callback = args.pop();
      }
      view = new Metro.View(this);
      (_base = this.headers)["Content-Type"] || (_base["Content-Type"] = this.contentType);
      self = this;
      args.push(finish = function(error, body) {
        self.body = body;
        self.body || (self.body = error.toString());
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
  Metro.Controller.Responding = (function() {
    Responding.respondTo = function() {
      this._respondTo || (this._respondTo = []);
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
  Metro.Controller.include(Metro.Controller.Flash);
  Metro.Controller.include(Metro.Controller.Redirecting);
  Metro.Controller.include(Metro.Controller.Rendering);
  Metro.Controller.include(Metro.Controller.Responding);
  Metro.Route = (function() {
    Route.include(Metro.Model.Scopes);
    Route.store = function() {
      return this._store || (this._store = new Metro.Store.Memory);
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
      options || (options = options);
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
        slash || (slash = "");
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
  /*
  * Metro.Route.DSL
  */
  Metro.Route.DSL = (function() {
    function DSL() {}
    DSL.prototype.match = function() {
      this.scope || (this.scope = {});
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
    /*
      * Scopes routes to a specific namespace. For example:
      * 
      * ```coffeescript
      * namespace "admin", ->
      *   resources "posts"
      * ```
      * 
      * This generates the following routes:
      * 
      *       adminPosts GET    /admin/posts(.:format)          admin/posts#index
      *       adminPosts POST   /admin/posts(.:format)          admin/posts#create
      *    newAdminPost GET    /admin/posts/new(.:format)      admin/posts#new
      *   editAdminPost GET    /admin/posts/:id/edit(.:format) admin/posts#edit
      *        adminPost GET    /admin/posts/:id(.:format)      admin/posts#show
      *        adminPost PUT    /admin/posts/:id(.:format)      admin/posts#update
      *        adminPost DELETE /admin/posts/:id(.:format)      admin/posts#destroy
      * 
      * ## Options
      * 
      * The +:path+, +:as+, +:module+, +:shallowPath+ and +:shallowPrefix+
      * options all default to the name of the namespace.
      * 
      * For options, see <tt>Base#match</tt>. For +:shallowPath+ option, see
      * <tt>Resources#resources</tt>.
      * 
      * ## Examples
      * 
      * ``` coffeescript
      * # accessible through /sekret/posts rather than /admin/posts
      * namespace "admin", path: "sekret", ->
      *   resources "posts"
      * 
      * # maps to <tt>Sekret::PostsController</tt> rather than <tt>Admin::PostsController</tt>
      * namespace "admin", module: "sekret", ->
      *   resources "posts"
      * 
      * # generates +sekretPostsPath+ rather than +adminPostsPath+
      * namespace "admin", as: "sekret", ->
      *   resources "posts"
      * ```
      * 
      * @param {String} path
      */
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
      controller || (controller = options.controller || this.scope.controller);
      action || (action = options.action || this.scope.action);
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
  Metro.Store = {
    defaultLimit: 100,
    reservedOperators: {
      "_sort": "_sort",
      "_limit": "_limit"
    },
    queryOperators: {
      ">=": "gte",
      "gte": "gte",
      ">": "gt",
      "gt": "gt",
      "<=": "lte",
      "lte": "lte",
      "<": "lt",
      "lt": "lt",
      "in": "in",
      "nin": "nin",
      "any": "any",
      "all": "all",
      "=~": "m",
      "m": "m",
      "!~": "nm",
      "nm": "nm",
      "=": "eq",
      "eq": "eq",
      "!=": "neq",
      "neq": "neq",
      "null": "null",
      "notNull": "notNull"
    }
  };
  Metro.Store.Memory = (function() {
    function Memory() {
      this.records = {};
      this.lastId = 0;
    }
    Memory.prototype.addIndex = function() {
      var attributes;
      attributes = Array.prototype.slice.call(arguments, 0, arguments.length);
      this.index[attributes] = key;
      return this;
    };
    Memory.prototype.removeIndex = function() {
      var attributes;
      attributes = Array.prototype.slice.call(arguments, 0, arguments.length);
      delete this.index[attributes];
      return this;
    };
    Memory.prototype.find = function(query, callback) {
      var key, limit, record, records, result, sort;
      result = [];
      records = this.records;
      if (Metro.Support.Object.isPresent(query)) {
        sort = query._sort;
        limit = query._limit || Metro.Store.defaultLimit;
        for (key in records) {
          record = records[key];
          if (this.matches(record, query)) {
            result.push(record);
          }
        }
        if (sort) {
          result = this.sort(result, query._sort);
        }
        if (limit) {
          result = result.slice(0, (limit - 1 + 1) || 9e9);
        }
      } else {
        for (key in records) {
          record = records[key];
          result.push(record);
        }
      }
      if (callback) {
        callback(result);
      }
      return result;
    };
    Memory.alias("select", "find");
    Memory.prototype.first = function(query, callback) {
      var result;
      result = this.find(query, function(records) {
        if (callback) {
          return callback(records[0]);
        }
      });
      return result[0];
    };
    Memory.prototype.last = function(query, callback) {
      var result;
      result = this.find(query, function(records) {
        if (callback) {
          return callback(records[records.length - 1]);
        }
      });
      return result[result.length - 1];
    };
    Memory.prototype.all = function(query, callback) {
      return this.find(query, callback);
    };
    Memory.prototype.length = function(query, callback) {
      return this.find(query, function(records) {
        if (callback) {
          return callback(records.length);
        }
      }).length;
    };
    Memory.alias("count", "length");
    Memory.prototype.remove = function(query, callback) {
      var _records;
      _records = this.records;
      return this.select(query, function(records) {
        var record, _i, _len;
        for (_i = 0, _len = records.length; _i < _len; _i++) {
          record = records[_i];
          _records.splice(_records.indexOf(record), 1);
        }
        if (callback) {
          return callback(records);
        }
      });
    };
    Memory.prototype.clear = function() {
      return this.records = [];
    };
    Memory.prototype.toArray = function() {
      return this.records;
    };
    Memory.prototype.create = function(record) {
      var _ref;
      if (!record.id) {
        Metro.raise("errors.store.missingAttribute", "id", "Store#create", record);
      }
      if ((_ref = record.id) == null) {
        record.id = this.generateId();
      }
      return this.records[record.id] = record;
    };
    Memory.prototype.update = function(record) {
      if (!record.id) {
        Metro.raise("errors.store.missingAttribute", "id", "Store#update", record);
      }
      return this.records[record.id] = record;
    };
    Memory.prototype.destroy = function(record) {
      return this.find(id).destroy();
    };
    Memory.prototype.sort = function() {
      var _ref;
      return (_ref = Metro.Support.Array).sortBy.apply(_ref, arguments);
    };
    Memory.prototype.matches = function(record, query) {
      var key, recordValue, self, success, value;
      self = this;
      success = true;
      for (key in query) {
        value = query[key];
        if (!!Metro.Store.reservedOperators[key]) {
          continue;
        }
        recordValue = record[key];
        if (typeof value === 'object') {
          success = self._matchesOperators(record, recordValue, value);
        } else {
          if (typeof value === "function") {
            value = value.call(record);
          }
          success = recordValue === value;
        }
        if (!success) {
          return false;
        }
      }
      return true;
    };
    Memory.prototype.generateId = function() {
      return this.lastId++;
    };
    Memory.prototype._matchesOperators = function(record, recordValue, operators) {
      var key, operator, self, success, value;
      success = true;
      self = this;
      for (key in operators) {
        value = operators[key];
        if (operator = Metro.Store.queryOperators[key]) {
          if (typeof value === "function") {
            value = value.call(record);
          }
          switch (operator) {
            case "gt":
              success = self._isGreaterThan(recordValue, value);
              break;
            case "gte":
              success = self._isGreaterThanOrEqualTo(recordValue, value);
              break;
            case "lt":
              success = self._isLessThan(recordValue, value);
              break;
            case "lte":
              success = self._isLessThanOrEqualTo(recordValue, value);
              break;
            case "eq":
              success = self._isEqualTo(recordValue, value);
              break;
            case "neq":
              success = self._isNotEqualTo(recordValue, value);
              break;
            case "m":
              success = self._isMatchOf(recordValue, value);
              break;
            case "nm":
              success = self._isNotMatchOf(recordValue, value);
              break;
            case "any":
              success = self._anyIn(recordValue, value);
              break;
            case "all":
              success = self._allIn(recordValue, value);
          }
          if (!success) {
            return false;
          }
        } else {
          return recordValue === operators;
        }
      }
      return true;
    };
    Memory.prototype._isGreaterThan = function(recordValue, value) {
      return recordValue && recordValue > value;
    };
    Memory.prototype._isGreaterThanOrEqualTo = function(recordValue, value) {
      return recordValue && recordValue >= value;
    };
    Memory.prototype._isLessThan = function(recordValue, value) {
      return recordValue && recordValue < value;
    };
    Memory.prototype._isLessThanOrEqualTo = function(recordValue, value) {
      return recordValue && recordValue <= value;
    };
    Memory.prototype._isEqualTo = function(recordValue, value) {
      return recordValue === value;
    };
    Memory.prototype._isNotEqualTo = function(recordValue, value) {
      return recordValue !== value;
    };
    Memory.prototype._isMatchOf = function(recordValue, value) {
      return !!(typeof recordValue === "string" ? recordValue.match(value) : recordValue.exec(value));
    };
    Memory.prototype._isNotMatchOf = function(recordValue, value) {
      return !!!(typeof recordValue === "string" ? recordValue.match(value) : recordValue.exec(value));
    };
    Memory.prototype._anyIn = function(recordValue, array) {
      var value, _i, _len;
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        value = array[_i];
        if (recordValue.indexOf(value) > -1) {
          return true;
        }
      }
      return false;
    };
    Memory.prototype._allIn = function(recordValue, value) {
      var _i, _len;
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        value = array[_i];
        if (recordValue.indexOf(value) === -1) {
          return false;
        }
      }
      return true;
    };
    Memory.prototype.toString = function() {
      return this.constructor.name;
    };
    return Memory;
  })();
}).call(this);
