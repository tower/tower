
Tower.Controller.Instrumentation = {
  ClassMethods: {
    baseClass: function() {
      if (this.__super__ && this.__super__.constructor.baseClass && this.__super__.constructor !== Tower.Controller) {
        return this.__super__.constructor.baseClass();
      } else {
        return this;
      }
    },
    metadata: function() {
      var baseClassName, belongsTo, callbacks, className, collectionName, helpers, metadata, mimes, params, renderers, resourceName, resourceType, result, superMetadata;
      className = this.name;
      metadata = this.metadata[className];
      if (metadata) return metadata;
      baseClassName = this.baseClass().name;
      if (baseClassName !== className) {
        superMetadata = this.baseClass().metadata();
      } else {
        superMetadata = {};
      }
      resourceType = Tower.Support.String.singularize(this.name.replace(/(Controller)$/, ""));
      resourceName = this._compileResourceName(resourceType);
      collectionName = Tower.Support.String.camelize(this.name.replace(/(Controller)$/, ""), true);
      params = superMetadata.params ? _.clone(superMetadata.params) : {};
      callbacks = superMetadata.callbacks ? _.clone(superMetadata.callbacks) : {};
      renderers = superMetadata.renderers ? _.clone(superMetadata.renderers) : {};
      mimes = superMetadata.mimes ? _.clone(superMetadata.mimes) : {
        json: {},
        html: {}
      };
      helpers = superMetadata.helpers ? superMetadata.helpers.concat() : [];
      belongsTo = superMetadata.belongsTo ? superMetadata.belongsTo.concat() : [];
      result = this.metadata[className] = {
        className: className,
        resourceName: resourceName,
        resourceType: resourceType,
        collectionName: collectionName,
        params: params,
        renderers: renderers,
        mimes: mimes,
        callbacks: callbacks,
        helpers: helpers,
        belongsTo: belongsTo
      };
      return result;
    },
    _compileResourceName: function(type) {
      var parts, resourceName;
      parts = type.split(".");
      return resourceName = Tower.Support.String.camelize(parts[parts.length - 1], true);
    }
  },
  InstanceMethods: {
    call: function(request, response, next) {
      this.request = request;
      this.response = response;
      this.params = this.request.params || {};
      this.cookies = this.request.cookies || {};
      this.query = this.request.query || {};
      this.session = this.request.session || {};
      this.format = this.params.format || "html";
      this.action = this.params.action;
      this.headers = {};
      this.callback = next;
      return this.process();
    },
    process: function() {
      var _this = this;
      this.processQuery();
      if (!Tower.env.match(/(test|production)/)) {
        console.log("  Processing by " + this.constructor.name + "#" + this.action + " as " + (this.format.toUpperCase()));
        console.log("  Parameters:");
        console.log(this.params);
      }
      return this.runCallbacks("action", {
        name: this.action
      }, function(callback) {
        return _this[_this.action].call(_this, callback);
      });
    },
    processQuery: function() {},
    clear: function() {
      this.request = null;
      this.response = null;
      return this.headers = null;
    },
    metadata: function() {
      return this.constructor.metadata();
    }
  }
};

module.exports = Tower.Controller.Instrumentation;
