
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
      var action, baseClassName, belongsTo, callbackChain, callbacks, className, collectionName, helpers, metadata, mimes, params, renderers, resourceName, resourceType, result, superMetadata, _ref;
      className = this.name;
      metadata = this.metadata[className];
      if (metadata) {
        return metadata;
      }
      baseClassName = this.baseClass().name;
      if (baseClassName !== className) {
        superMetadata = this.baseClass().metadata();
      } else {
        superMetadata = {};
      }
      resourceType = _.singularize(this.name.replace(/(Controller)$/, ""));
      resourceName = this._compileResourceName(resourceType);
      collectionName = Tower.Support.String.camelize(this.name.replace(/(Controller)$/, ""), true);
      params = superMetadata.params ? _.clone(superMetadata.params) : {};
      renderers = superMetadata.renderers ? _.clone(superMetadata.renderers) : {};
      mimes = superMetadata.mimes ? _.clone(superMetadata.mimes) : {
        json: {},
        html: {}
      };
      helpers = superMetadata.helpers ? superMetadata.helpers.concat() : [];
      belongsTo = superMetadata.belongsTo ? superMetadata.belongsTo.concat() : [];
      callbacks = {};
      if (superMetadata.callbacks) {
        _ref = superMetadata.callbacks;
        for (action in _ref) {
          callbackChain = _ref[action];
          callbacks[action] = callbackChain.clone();
        }
      }
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
      var accept, acceptFormat, _base, _ref, _ref1;
      this.request = request;
      this.response = response;
      this.params = this.request.params || {};
      this.cookies = this.request.cookies || {};
      this.query = this.request.query || {};
      this.session = this.request.session || {};
      if (!this.params.format) {
        accept = (_ref = this.request) != null ? (_ref1 = _ref.headers) != null ? _ref1["accept"] : void 0 : void 0;
        acceptFormat = accept != null ? accept.split(",") : void 0;
        if (accept === void 0) {
          try {
            this.params.format = require('mime').extension(this.request.header("content-type"));
          } catch (_error) {}
        } else {
          try {
            this.params.format = require('mime').extension(acceptFormat[0]);
          } catch (_error) {}
        }
        (_base = this.params).format || (_base.format = "html");
      }
      this.format = this.params.format;
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
      return this.response = null;
    },
    metadata: function() {
      return this.constructor.metadata();
    }
  }
};

module.exports = Tower.Controller.Instrumentation;
