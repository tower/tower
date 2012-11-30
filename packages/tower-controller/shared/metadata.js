var _;

_ = Tower._;

Tower.ControllerMetadata = {
  ClassMethods: {
    baseClass: function() {
      if (this.__super__ && this.__super__.constructor.baseClass && this.__super__.constructor !== Tower.Controller) {
        return this.__super__.constructor.baseClass();
      } else {
        return this;
      }
    },
    metadata: function() {
      var action, baseClassName, belongsTo, callbackChain, callbacks, className, collectionName, helpers, layout, metadata, mimes, params, renderers, resourceName, resourceType, result, scopeNames, scopes, subscriptions, superMetadata, _ref;
      this._metadata || (this._metadata = {});
      className = this.className();
      metadata = this._metadata[className];
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
      collectionName = _.camelize(className.replace(/(Controller)$/, ''), true);
      params = _.copyObject(superMetadata.params);
      renderers = _.copyObject(superMetadata.renderers);
      scopes = _.copyObject(superMetadata.scopes);
      scopeNames = _.copyArray(superMetadata.scopeNames);
      mimes = superMetadata.mimes ? _.clone(superMetadata.mimes) : {
        json: {},
        html: {}
      };
      helpers = _.copyArray(superMetadata.helpers);
      belongsTo = _.copyArray(superMetadata.belongsTo);
      subscriptions = _.copyArray(superMetadata.subscriptions);
      layout = superMetadata.layout;
      callbacks = {};
      if (superMetadata.callbacks) {
        _ref = superMetadata.callbacks;
        for (action in _ref) {
          callbackChain = _ref[action];
          callbacks[action] = callbackChain.clone();
        }
      }
      result = this._metadata[className] = {
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
        subscriptions: subscriptions,
        layout: layout,
        scopes: scopes,
        scopeNames: scopeNames
      };
      return result;
    },
    _compileResourceName: function(type) {
      var parts, resourceName;
      parts = type.split('.');
      return resourceName = _.camelize(parts[parts.length - 1], true);
    }
  }
};
