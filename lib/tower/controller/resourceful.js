
Tower.Controller.Resourceful = {
  ClassMethods: {
    resource: function(options) {
      if (options.hasOwnProperty("name")) this._resourceName = options.name;
      if (options.hasOwnProperty("type")) this._resourceType = options.type;
      if (options.hasOwnProperty("collectionName")) {
        this._collectionName = options.collectionName;
      }
      return this;
    },
    resourceType: function() {
      return this._resourceType || (this._resourceType = Tower.Support.String.singularize(this.name.replace(/(Controller)$/, "")));
    },
    resourceName: function() {
      var parts;
      if (this._resourceName) return this._resourceName;
      parts = this.resourceType().split(".");
      return this._resourceName = Tower.Support.String.camelize(parts[parts.length - 1], true);
    },
    collectionName: function() {
      return this._collectionName || (this._collectionName = Tower.Support.String.camelize(this.name.replace(/(Controller)$/, ""), true));
    },
    belongsTo: function(key, options) {
      if (options == null) options = {};
      options.key = key;
      options.type || (options.type = Tower.Support.String.camelize(options.key));
      return this._belongsTo = options;
    },
    actions: function() {
      var action, actions, actionsToRemove, args, options, _i, _len;
      args = Tower.Support.Array.args(arguments);
      if (typeof args[args.length - 1] === "object") {
        options = args.pop();
      } else {
        options = {};
      }
      actions = ["index", "new", "create", "show", "edit", "update", "destroy"];
      actionsToRemove = _.difference(actions, args, options.except || []);
      for (_i = 0, _len = actionsToRemove.length; _i < _len; _i++) {
        action = actionsToRemove[_i];
        this[action] = null;
        delete this[action];
      }
      return this;
    }
  },
  index: function() {
    return this._index.apply(this, arguments);
  },
  "new": function() {
    var _this = this;
    return this._new(function(format) {
      format.html(function() {
        return _this.render("new");
      });
      return format.json(function() {
        return _this.render({
          json: _this.resource,
          status: 200
        });
      });
    });
  },
  create: function(callback) {
    var _this = this;
    return this._create(function(format) {
      format.html(function() {
        return _this.redirectTo({
          action: "show"
        });
      });
      return format.json(function() {
        return _this.render({
          json: _this.resource,
          status: 200
        });
      });
    });
  },
  show: function() {
    var _this = this;
    return this._show(function(format) {
      format.html(function() {
        return _this.render("show");
      });
      return format.json(function() {
        return _this.render({
          json: _this.resource,
          status: 200
        });
      });
    });
  },
  edit: function() {
    var _this = this;
    return this._edit(function(format) {
      format.html(function() {
        return _this.render("edit");
      });
      return format.json(function() {
        return _this.render({
          json: _this.resource,
          status: 200
        });
      });
    });
  },
  update: function() {
    var _this = this;
    return this._update(function(format) {
      format.html(function() {
        return _this.redirectTo({
          action: "show"
        });
      });
      return format.json(function() {
        return _this.render({
          json: _this.resource,
          status: 200
        });
      });
    });
  },
  destroy: function() {
    var _this = this;
    return this._destroy(function(format) {
      format.html(function() {
        return _this.redirectTo({
          action: "index"
        });
      });
      return format.json(function() {
        return _this.render({
          json: _this.resource,
          status: 200
        });
      });
    });
  },
  _index: function(callback) {
    var _this = this;
    return this.findCollection(function(error, collection) {
      return _this.respondWith(collection, callback);
    });
  },
  _new: function(callback) {
    var _this = this;
    return this.buildResource(function(error, resource) {
      if (!resource) return _this.failure(error);
      return _this.respondWith(resource, callback);
    });
  },
  _create: function(callback) {
    var _this = this;
    return this.buildResource(function(error, resource) {
      if (!resource) return _this.failure(error, callback);
      return resource.save(function(error) {
        return _this.respondWithStatus(Tower.Support.Object.isBlank(resource.errors), callback);
      });
    });
  },
  _show: function(callback) {
    var _this = this;
    return this.findResource(function(error, resource) {
      return _this.respondWith(resource, callback);
    });
  },
  _edit: function(callback) {
    var _this = this;
    return this.findResource(function(error, resource) {
      return _this.respondWith(resource, callback);
    });
  },
  _update: function(callback) {
    var _this = this;
    return this.findResource(function(error, resource) {
      if (error) return _this.failure(error, callback);
      return resource.updateAttributes(_this.params[_this.resourceName], function(error) {
        return _this.respondWithStatus(!!!error && Tower.Support.Object.isBlank(resource.errors), callback);
      });
    });
  },
  _destroy: function(callback) {
    var _this = this;
    return this.findResource(function(error, resource) {
      if (error) return _this.failure(error, callback);
      return resource.destroy(function(error) {
        return _this.respondWithStatus(!!!error, callback);
      });
    });
  },
  respondWithScoped: function(callback) {
    var _this = this;
    return this.scoped(function(error, scope) {
      if (error) return _this.failure(error, callback);
      return _this.respondWith(scope.build(), callback);
    });
  },
  respondWithStatus: function(success, callback) {
    var failureResponder, options, successResponder;
    options = {
      records: this.resource || this.collection
    };
    if (callback && callback.length > 1) {
      successResponder = new Tower.Controller.Responder(this, options);
      failureResponder = new Tower.Controller.Responder(this, options);
      callback.call(this, successResponder, failureResponder);
      if (success) {
        return successResponder[format].call(this);
      } else {
        return failureResponder[format].call(this, error);
      }
    } else {
      return Tower.Controller.Responder.respond(this, options, callback);
    }
  },
  buildResource: function(callback) {
    var _this = this;
    return this.scoped(function(error, scope) {
      var resource;
      if (error) return callback.call(_this, error, null);
      _this[_this.resourceName] = _this.resource = resource = scope.build(_this.params[_this.resourceName]);
      if (callback) callback.call(_this, null, resource);
      return resource;
    });
  },
  findResource: function(callback) {
    var _this = this;
    return this.scoped(function(error, scope) {
      if (error) return callback.call(_this, error, null);
      return scope.find(_this.params.id, function(error, resource) {
        _this[_this.resourceName] = _this.resource = resource;
        return callback.call(_this, error, resource);
      });
    });
  },
  findCollection: function(callback) {
    var _this = this;
    return this.scoped(function(error, scope) {
      if (error) return callback.call(_this, error, null);
      return scope.all(function(error, collection) {
        _this[_this.collectionName] = _this.collection = collection;
        if (callback) return callback.call(_this, error, collection);
      });
    });
  },
  findParent: function(callback) {
    var association, param, parentClass;
    var _this = this;
    association = this.constructor._belongsTo;
    if (association) {
      param = association.param || ("" + association.key + "Id");
      parentClass = Tower.constant(association.type);
      return parentClass.find(this.params[param], function(error, parent) {
        if (error && !callback) throw error;
        if (!error) _this.parent = _this[association.key] = parent;
        if (callback) return callback.call(_this, error, parent);
      });
    } else {
      if (callback) callback.call(this, null, false);
      return false;
    }
  },
  scoped: function(callback) {
    var callbackWithScope;
    var _this = this;
    callbackWithScope = function(error, scope) {
      return callback.call(_this, error, scope.where(_this.criteria()));
    };
    if (this.hasParent) {
      return this.findParent(function(error, parent) {
        return callbackWithScope(error, parent[_this.collectionName]());
      });
    } else {
      return callbackWithScope(null, Tower.constant(this.resourceType));
    }
  },
  failure: function(resource, callback) {
    return callback();
  }
};

module.exports = Tower.Controller.Resourceful;
