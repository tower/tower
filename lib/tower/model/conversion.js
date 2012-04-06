
Tower.Model.Conversion = {
  ClassMethods: {
    baseClass: function() {
      if (this.__super__ && this.__super__.constructor.baseClass && this.__super__.constructor !== Tower.Model) {
        return this.__super__.constructor.baseClass();
      } else {
        return this;
      }
    },
    toParam: function() {
      if (this === Tower.Model) return;
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
    metadata: function() {
      var className, classNamePlural, controllerName, indexes, metadata, modelName, name, namePlural, namespace, paramName, paramNamePlural;
      className = this.name;
      metadata = this.metadata[className];
      if (metadata) return metadata;
      namespace = Tower.namespace();
      name = Tower.Support.String.camelize(className, true);
      namePlural = Tower.Support.String.pluralize(name);
      classNamePlural = Tower.Support.String.pluralize(className);
      paramName = Tower.Support.String.parameterize(name);
      paramNamePlural = Tower.Support.String.parameterize(namePlural);
      modelName = "" + namespace + "." + className;
      controllerName = "" + namespace + "." + classNamePlural + "Controller";
      indexes = {};
      return this.metadata[className] = {
        name: name,
        namePlural: namePlural,
        className: className,
        classNamePlural: classNamePlural,
        paramName: paramName,
        paramNamePlural: paramNamePlural,
        modelName: modelName,
        controllerName: controllerName,
        indexes: indexes
      };
    }
  },
  toLabel: function() {
    return this.metadata().className;
  },
  toPath: function() {
    var param, result;
    result = this.constructor.toParam();
    if (result === void 0) return "/";
    param = this.toParam();
    if (param) result += "/" + param;
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
};

module.exports = Tower.Model.Conversion;
