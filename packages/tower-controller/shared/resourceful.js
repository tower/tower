var _;

_ = Tower._;

Tower.ControllerResourceful = {
  ClassMethods: {
    resource: function(options) {
      var metadata;
      metadata = this.metadata();
      if (typeof options === 'string') {
        options = {
          name: options,
          type: _.camelize(options),
          collectionName: _.pluralize(options)
        };
      }
      if (options.name) {
        metadata.resourceName = options.name;
      }
      if (options.type) {
        metadata.resourceType = options.type;
        if (!options.name) {
          metadata.resourceName = this._compileResourceName(options.type);
        }
      }
      if (options.collectionName) {
        metadata.collectionName = options.collectionName;
      }
      return this;
    },
    belongsTo: function(key, options) {
      var belongsTo;
      belongsTo = this.metadata().belongsTo;
      if (!key) {
        return belongsTo;
      }
      options || (options = {});
      options.key = key;
      options.type || (options.type = _.camelize(options.key));
      this.param("" + key + "Id", {
        exact: true,
        type: 'Id'
      });
      return belongsTo.push(options);
    },
    hasParent: function() {
      var belongsTo;
      belongsTo = this.belongsTo();
      return belongsTo.length > 0;
    },
    actions: function() {
      var action, actions, actionsToRemove, args, options, _i, _len;
      args = _.flatten(_.args(arguments));
      options = _.extractOptions(args);
      actions = ['index', 'new', 'create', 'show', 'edit', 'update', 'destroy'];
      actionsToRemove = _.difference(actions, args, options.except || []);
      for (_i = 0, _len = actionsToRemove.length; _i < _len; _i++) {
        action = actionsToRemove[_i];
        this[action] = null;
        delete this[action];
      }
      return this;
    }
  },
  respondWithScoped: function(callback) {
    var _this = this;
    return this.scoped(function(error, scope) {
      if (error) {
        return _this.failure(error, callback);
      }
      return _this.respondWith(scope.build(), callback);
    });
  },
  respondWithStatus: function(success, callback) {
    var failureResponder, options, successResponder;
    options = {
      records: this.resource || this.collection
    };
    if (callback && callback.length > 1) {
      successResponder = new Tower.ControllerResponder(this, options);
      failureResponder = new Tower.ControllerResponder(this, options);
      callback.call(this, successResponder, failureResponder);
      if (success) {
        return successResponder._respond();
      } else {
        return failureResponder._respond();
      }
    } else {
      return Tower.ControllerResponder.respond(this, options, callback);
    }
  },
  buildResource: function(callback) {
    var _this = this;
    return this.scoped(function(error, scope) {
      var resource;
      if (error) {
        return callback.call(_this, error, null);
      }
      resource = scope.build(_this.params[_this.resourceName]);
      _this.set('resource', resource);
      _this.set(_this.resourceName, resource);
      if (callback) {
        callback.call(_this, null, resource);
      }
      return resource;
    });
  },
  createResource: function(callback) {
    var _this = this;
    return this.scoped(function(error, scope) {
      var resource;
      if (error) {
        return callback.call(_this, error, null);
      }
      resource = null;
      scope.insert(_this.params[_this.resourceName], function(error, resource) {
        _this.set('resource', resource);
        _this.set(_this.resourceName, resource);
        if (callback) {
          return callback.call(_this, null, resource);
        }
      });
      return resource;
    });
  },
  findResource: function(callback) {
    var _this = this;
    return this.scoped(function(error, scope) {
      if (error) {
        return callback.call(_this, error, null);
      }
      return scope.find(_this.params.id, function(error, resource) {
        _this.set('resource', resource);
        _this.set(_this.resourceName, resource);
        return callback.call(_this, error, resource);
      });
    });
  },
  findCollection: function(callback) {
    var _this = this;
    return this.scoped(function(error, scope) {
      if (error) {
        return callback.call(_this, error, null);
      }
      return scope.all(function(error, collection) {
        _this.set('collection', collection);
        _this.set(_this.collectionName, collection);
        if (callback) {
          return callback.call(_this, error, collection);
        }
      });
    });
  },
  findParent: function(callback) {
    var parentClass, relation,
      _this = this;
    relation = this.findParentRelation();
    if (relation) {
      parentClass = Tower.constant(relation.type);
      return parentClass.find(this.params[relation.param], function(error, parent) {
        if (error && !callback) {
          throw error;
        }
        if (!error) {
          _this.set('parent', parent);
          _this.set(relation.key, parent);
        }
        if (callback) {
          return callback.call(_this, error, parent);
        }
      });
    } else {
      if (callback) {
        callback.call(this, null, false);
      }
      return false;
    }
  },
  findParentRelation: function() {
    var belongsTo, param, params, relation, _i, _len;
    belongsTo = this.constructor.belongsTo();
    params = this.params;
    if (belongsTo.length > 0) {
      for (_i = 0, _len = belongsTo.length; _i < _len; _i++) {
        relation = belongsTo[_i];
        param = relation.param || ("" + relation.key + "Id");
        if (params.hasOwnProperty(param)) {
          relation = _.extend({}, relation);
          relation.param = param;
          return relation;
        }
      }
      return null;
    } else {
      return null;
    }
  },
  scoped: function(callback) {
    var callbackWithScope,
      _this = this;
    callbackWithScope = function(error, scope) {
      return callback.call(_this, error, scope.where(_this.cursor()));
    };
    if (this.hasParent) {
      this.findParent(function(error, parent) {
        if (error || !parent) {
          return callbackWithScope(error, Tower.constant(_this.resourceType));
        } else {
          return callbackWithScope(error, parent.get(_this.collectionName));
        }
      });
    } else {
      callbackWithScope(null, Tower.constant(this.resourceType));
    }
    return void 0;
  },
  resourceKlass: function() {
    return Tower.constant(Tower.namespaced(this.resourceType));
  },
  failure: function(resource, callback) {
    callback();
    return void 0;
  }
};
