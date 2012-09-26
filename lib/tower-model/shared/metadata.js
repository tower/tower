var _;

_ = Tower._;

Tower.ModelMetadata = {
  ClassMethods: {
    isModel: true,
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
        return void 0;
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
          case 'object':
            if (options.parent) {
              return url = "/" + (Tower.SupportString.parameterize(Tower.SupportString.pluralize(options.parent))) + "/:" + (Tower.SupportString.camelize(options.parent, true)) + "/" + (this.toParam());
            }
            break;
          default:
            return options;
        }
      }).call(this);
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
        method = "_setDefault" + (_.camelize(key));
        if (this[method]) {
          return this[method](value);
        } else {
          return this.metadata().defaults[key] = value;
        }
      }
    },
    metadata: function() {
      var baseClassName, callbacks, className, classNamePlural, controllerName, defaults, fields, indexes, metadata, modelName, name, namePlural, namespace, paramName, paramNamePlural, relations, superMetadata, validators;
      this._metadata || (this._metadata = {});
      className = this.className();
      metadata = this._metadata[className];
      if (metadata) {
        return metadata;
      }
      baseClassName = this.parentClass().className();
      if (baseClassName !== className) {
        superMetadata = this.parentClass().metadata();
      } else {
        superMetadata = {};
      }
      name = _.camelize(className, true);
      namePlural = _.pluralize(name);
      classNamePlural = _.pluralize(className);
      paramName = _.parameterize(name);
      paramNamePlural = _.parameterize(namePlural);
      if (baseClassName !== className) {
        namespace = Tower.namespace();
        modelName = "" + namespace + "." + className;
        controllerName = "" + namespace + "." + classNamePlural + "Controller";
      }
      fields = superMetadata.fields ? _.clone(superMetadata.fields) : {};
      indexes = superMetadata.indexes ? _.clone(superMetadata.indexes) : {};
      validators = superMetadata.validators ? _.clone(superMetadata.validators) : [];
      relations = superMetadata.relations ? _.clone(superMetadata.relations) : {};
      defaults = superMetadata.defaults ? _.clone(superMetadata.defaults) : {};
      callbacks = superMetadata.callbacks ? _.clone(superMetadata.callbacks) : {};
      return this._metadata[className] = {
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
      var defaults;
      defaults = this.metadata().defaults;
      if (scope instanceof Tower.ModelScope) {
        return defaults.scope = scope;
      } else if (scope) {
        return defaults.scope = this.where(scope);
      } else {
        return delete defaults.scope;
      }
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
        return '/';
      }
      param = this.toParam();
      if (param) {
        result += "/" + param;
      }
      return result;
    },
    toParam: function() {
      var id;
      id = this.get('id');
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
    },
    toString: function() {
      var array, attributes, key, result, value;
      attributes = this.get('attributes');
      array = [];
      if (attributes.hasOwnProperty('id')) {
        array.push("id=" + (JSON.stringify(attributes.id)));
        delete attributes.id;
      }
      result = [];
      for (key in attributes) {
        value = attributes[key];
        result.push("" + key + "=" + (JSON.stringify(value)));
      }
      result = array.concat(result.sort()).join(', ');
      return "#<" + (this.constructor.toString()) + ":" + (Ember.guidFor(this)) + " " + result + ">";
    }
  }
};

module.exports = Tower.ModelMetadata;
