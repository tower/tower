
Tower.Model.Metadata = {
  ClassMethods: {
    baseClass: function() {
      if (this.__super__ && this.__super__.constructor.baseClass && this.__super__.constructor !== Tower.Model) {
        return this.__super__.constructor.baseClass();
      } else {
        return this;
      }
    },
    parentClass: function() {
      if (this.__super__ && this.__super__.constructor.parentClass) {
        return this.__super__.constructor;
      } else {
        return this;
      }
    },
    isSubClass: function() {
      return this.baseClass().className() !== this.className();
    },
    toParam: function() {
      if (this === Tower.Model) {
        return;
      }
      return this.metadata().paramNamePlural;
    },
    toKey: function() {
      return this.metadata().paramName;
    },
    url: function(options) {
      var url;
      return this._url = (function() {
        switch (typeof options) {
          case "object":
            if (options.parent) {
              return url = "/" + (Tower.Support.String.parameterize(Tower.Support.String.pluralize(options.parent))) + "/:" + (Tower.Support.String.camelize(options.parent, true)) + "/" + (this.toParam());
            }
            break;
          default:
            return options;
        }
      }).call(this);
    },
    _relationship: false,
    relationship: function(value) {
      if (value == null) {
        value = true;
      }
      return this._relationship = value;
    },
    defaults: function(object) {
      var key, value;
      if (object) {
        for (key in object) {
          value = object[key];
          this["default"](key, value);
        }
      }
      return this.metadata().defaults;
    },
    "default": function(key, value) {
      var method;
      if (arguments.length === 1) {
        return this.metadata().defaults[key];
      } else {
        method = "_setDefault" + (Tower.Support.String.camelize(key));
        if (this[method]) {
          return this[method](value);
        } else {
          return this.metadata().defaults[key] = value;
        }
      }
    },
    metadata: function() {
      var baseClassName, callbacks, className, classNamePlural, controllerName, defaults, fields, indexes, metadata, modelName, name, namePlural, namespace, paramName, paramNamePlural, relations, superMetadata, validators;
      className = this.className();
      metadata = this.metadata[className];
      if (metadata) {
        return metadata;
      }
      baseClassName = this.parentClass().className();
      if (baseClassName !== className) {
        superMetadata = this.parentClass().metadata();
      } else {
        superMetadata = {};
      }
      namespace = Tower.namespace();
      name = Tower.Support.String.camelize(className, true);
      namePlural = Tower.Support.String.pluralize(name);
      classNamePlural = Tower.Support.String.pluralize(className);
      paramName = Tower.Support.String.parameterize(name);
      paramNamePlural = Tower.Support.String.parameterize(namePlural);
      modelName = "" + namespace + "." + className;
      controllerName = "" + namespace + "." + classNamePlural + "Controller";
      fields = superMetadata.fields ? _.clone(superMetadata.fields) : {};
      indexes = superMetadata.indexes ? _.clone(superMetadata.indexes) : {};
      validators = superMetadata.validators ? _.clone(superMetadata.validators) : [];
      relations = superMetadata.relations ? _.clone(superMetadata.relations) : {};
      defaults = superMetadata.defaults ? _.clone(superMetadata.defaults) : {};
      callbacks = superMetadata.callbacks ? _.clone(superMetadata.callbacks) : {};
      return this.metadata[className] = {
        name: name,
        namePlural: namePlural,
        className: className,
        classNamePlural: classNamePlural,
        paramName: paramName,
        paramNamePlural: paramNamePlural,
        modelName: modelName,
        controllerName: controllerName,
        indexes: indexes,
        validators: validators,
        fields: fields,
        relations: relations,
        defaults: defaults,
        callbacks: callbacks
      };
    },
    _setDefaultScope: function(scope) {
      return this.metadata().defaults.scope = scope instanceof Tower.Model.Scope ? scope : this.where(scope);
    },
    callbacks: function() {
      return this.metadata().callbacks;
    }
  },
  InstanceMethods: {
    toLabel: function() {
      return this.metadata().className;
    },
    toPath: function() {
      var param, result;
      result = this.constructor.toParam();
      if (result === void 0) {
        return "/";
      }
      param = this.toParam();
      if (param) {
        result += "/" + param;
      }
      return result;
    },
    toParam: function() {
      var id;
      id = this.get("id");
      if (id != null) {
        return String(id);
      } else {
        return null;
      }
    },
    toKey: function() {
      return this.constructor.tokey();
    },
    toCacheKey: function() {},
    metadata: function() {
      return this.constructor.metadata();
    }
  }
};

module.exports = Tower.Model.Metadata;
