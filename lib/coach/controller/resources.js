
  Coach.Controller.Resources = {
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
        return this._resourceType || (this._resourceType = Coach.Support.String.singularize(this.name.replace(/(Controller)$/, "")));
      },
      resourceName: function() {
        return this._resourceName || (this._resourceName = Coach.Support.String.camelize(this.resourceType(), true));
      },
      collectionName: function() {
        return this._collectionName || (this._collectionName = Coach.Support.String.pluralize(this.resourceName()));
      },
      belongsTo: function(key, options) {
        if (options == null) options = {};
        options.key = key;
        options.type || (options.type = Coach.Support.String.camelize(options.key));
        return this._belongsTo = options;
      },
      actions: function() {
        var action, actions, actionsToRemove, args, options, _i, _len;
        args = Coach.Support.Array.args(arguments);
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
      return this._new.apply(this, arguments);
    },
    create: function() {
      return this._create.apply(this, arguments);
    },
    show: function() {
      return this._show.apply(this, arguments);
    },
    edit: function() {
      return this._edit.apply(this, arguments);
    },
    update: function() {
      return this._update.apply(this, arguments);
    },
    destroy: function() {
      return this._destroy.apply(this, arguments);
    },
    _index: function(callback) {
      return this.respondWithScoped(callback);
    },
    _new: function(callback) {
      return this.respondWithScoped(callback);
    },
    _create: function(callback) {
      var _this = this;
      return this.buildResource(function(error, resource) {
        if (!resource) return _this.failure(error);
        return resource.save(function(error, success) {
          return _this.respondWithStatus(success, callback);
        });
      });
    },
    _show: function(callback) {
      return this.respondWithScoped(callback);
    },
    _update: function(callback) {
      var _this = this;
      return this.findResource(function(error, resource) {
        if (!resource) return _this.failure(error);
        return resource.updateAttribute(_this.params[_this.resourceName], function(error, success) {
          return _this.respondWithStatus(success, callback);
        });
      });
    },
    _destroy: function(callback) {
      var _this = this;
      return this.findResource(function(error, resource) {
        if (!resource) return _this.failure(error);
        return resource.destroy(function(error, success) {
          return _this.respondWithStatus(success, callback);
        });
      });
    },
    respondWithScoped: function(callback) {
      var _this = this;
      return this.scoped(function(error, resource) {
        if (error) return _this.failure(error);
        return _this.respondWith(resource, callback);
      });
    },
    respondWithStatus: function(success, callback) {
      var failureResponder, format, formats, responder, successResponder;
      format = this.params.format || "html";
      formats = this.constructor.respondTo().concat();
      switch (callback.length) {
        case 0:
        case 1:
          responder = new Coach.Controller.Responder(formats);
          callback.call(this, responder);
          return responder[format].call(this);
        default:
          successResponder = new Coach.Controller.Responder(formats);
          failureResponder = new Coach.Controller.Responder(formats);
          callback.call(this, successResponder, failureResponder);
          if (success) {
            return successResponder[format].call(this);
          } else {
            return failureResponder[format].call(this, error);
          }
      }
    },
    buildResource: function(callback) {
      var _this = this;
      return this.scoped(function(scope) {
        var resource;
        _this[_this.resourceName] = _this.resource = resource = scope.build(_this.params[_this.resourceName]);
        if (callback) callback.call(_this, null, resource);
        return resource;
      });
    },
    findResource: function(callback) {
      var _this = this;
      return this.scoped(function(scope) {
        return scope.find(_this.params.id, function(error, resource) {
          _this[_this.resourceName] = _this.resource = resource;
          return callback.call(_this, error, resource);
        });
      });
    },
    findParent: function(callback) {
      var association, param, parentClass;
      var _this = this;
      association = this.constructor._belongsTo;
      if (association) {
        param = association.param || ("" + association.key + "Id");
        parentClass = Coach.constant(association.type);
        return parentClass.find(this.params[param], function(error, parent) {
          return _this.parent = _this[association.key] = parent;
        });
      } else {
        if (callback) callback.call(this, null, false);
        return false;
      }
    },
    scoped: function(callback) {
      var _this = this;
      if (this._scope) {
        if (callback) callback.call(this, this._scope);
        return this._scope;
      }
      if (this.hasParent) {
        return this.findParent(function(error, parent) {
          return callback.call(_this, error, _this.parent[_this.collectionName]);
        });
      } else {
        return callback.call(this, null, Coach.constant(this.resourceType));
      }
    }
  };

  module.exports = Coach.Controller.Resources;
