
Tower.Model.Persistence = {
  ClassMethods: {
    store: function(value) {
      var defaultStore, metadata, store;
      metadata = this.metadata();
      store = metadata.store;
      if (arguments.length === 0 && store) {
        return store;
      }
      defaultStore = this["default"]('store') || Tower.Store.Memory;
      if (typeof value === "function") {
        store = new value({
          name: this.metadata().namePlural,
          type: Tower.namespaced(this.name)
        });
      } else if (typeof value === "object") {
        store || (store = new defaultStore({
          name: this.metadata().namePlural,
          type: Tower.namespaced(this.name)
        }));
        _.extend(store, value);
      } else if (value) {
        store = value;
      }
      store || (store = new defaultStore({
        name: this.metadata().namePlural,
        type: Tower.namespaced(this.name)
      }));
      return metadata.store = store;
    },
    load: function(records) {
      return this.store().load(records);
    }
  },
  InstanceMethods: {
    save: function(options, callback) {
      var _this = this;
      if (this.readOnly) {
        throw new Error("Record is read only");
      }
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      options || (options = {});
      if (options.validate !== false) {
        this.validate(function(error) {
          if (error) {
            if (callback) {
              return callback.call(_this, null, false);
            }
          } else {
            return _this._save(callback);
          }
        });
      } else {
        this._save(callback);
      }
      return;
    },
    updateAttributes: function(attributes, callback) {
      this.set(attributes);
      return this._update(attributes, callback);
    },
    destroy: function(callback) {
      if (this.isNew()) {
        if (callback) {
          callback.call(this, null);
        }
      } else {
        this._destroy(callback);
      }
      return this;
    },
    isPersisted: function() {
      return !!this.persistent;
    },
    isNew: function() {
      return !!!this.isPersisted();
    },
    reload: function() {},
    store: function() {
      return this.constructor.store();
    },
    _save: function(callback) {
      var _this = this;
      this.runCallbacks("save", function(block) {
        var complete;
        complete = _this._callback(block, callback);
        if (_this.isNew()) {
          return _this._create(complete);
        } else {
          return _this._update(_this.toUpdates(), complete);
        }
      });
      return;
    },
    _create: function(callback) {
      var _this = this;
      this.runCallbacks("create", function(block) {
        var complete;
        complete = _this._callback(block, callback);
        return _this.constructor.scoped({
          instantiate: false
        }).create(_this, function(error) {
          if (error && !callback) {
            throw error;
          }
          if (!error) {
            _this._resetChanges();
            _this.persistent = true;
          }
          return complete.call(_this, error);
        });
      });
      return;
    },
    _update: function(updates, callback) {
      var _this = this;
      this.runCallbacks("update", function(block) {
        var complete;
        complete = _this._callback(block, callback);
        return _this.constructor.scoped({
          instantiate: false
        }).update(_this.get("id"), updates, function(error) {
          if (error && !callback) {
            throw error;
          }
          if (!error) {
            _this._resetChanges();
            _this.persistent = true;
          }
          return complete.call(_this, error);
        });
      });
      return;
    },
    _destroy: function(callback) {
      var id,
        _this = this;
      id = this.get('id');
      this.runCallbacks("destroy", function(block) {
        var complete;
        complete = _this._callback(block, callback);
        return _this.constructor.scoped({
          instantiate: false
        }).destroy(_this, function(error) {
          if (error && !callback) {
            throw error;
          }
          if (!error) {
            return _this.destroyRelations(function(error) {
              _this.persistent = false;
              _this._resetChanges();
              delete _this.attributes.id;
              return complete.call(_this, error);
            });
          } else {
            return complete.call(_this, error);
          }
        });
      });
      return;
    }
  }
};

module.exports = Tower.Model.Persistence;
