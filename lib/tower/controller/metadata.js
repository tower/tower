
Tower.Controller.Metadata = {
  ClassMethods: {
    baseClass: function() {
      if (this.__super__ && this.__super__.constructor.baseClass && this.__super__.constructor !== Tower.Controller) {
        return this.__super__.constructor.baseClass();
      } else {
        return this;
      }
    },
    metadata: function() {
      var action, baseClassName, belongsTo, callbackChain, callbacks, className, collectionName, helpers, metadata, mimes, params, renderers, resourceName, resourceType, result, subscriptions, superMetadata, _ref;
      className = this.className();
      metadata = this.metadata[className];
      if (metadata) {
        return metadata;
      }
      baseClassName = this.baseClass().className();
      if (baseClassName !== className) {
        superMetadata = this.baseClass().metadata();
      } else {
        superMetadata = {};
      }
      resourceType = _.singularize(className.replace(/(Controller)$/, ''));
      resourceName = this._compileResourceName(resourceType);
      collectionName = Tower.Support.String.camelize(className.replace(/(Controller)$/, ''), true);
      params = _.copyObject(superMetadata.params);
      renderers = _.copyObject(superMetadata.renderers);
      mimes = superMetadata.mimes ? _.clone(superMetadata.mimes) : {
        json: {},
        html: {}
      };
      helpers = _.copyArray(superMetadata.helpers);
      belongsTo = _.copyArray(superMetadata.belongsTo);
      subscriptions = _.copyArray(superMetadata.subscriptions);
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
        belongsTo: belongsTo,
        subscriptions: subscriptions
      };
      return result;
    },
    _compileResourceName: function(type) {
      var parts, resourceName;
      parts = type.split('.');
      return resourceName = Tower.Support.String.camelize(parts[parts.length - 1], true);
    }
  }
};

module.exports = Tower.Controller.Metadata;
