
Tower.Model.Persistence = {
  ClassMethods: {
    defaultStore: Tower.Store.Memory,
    store: function(value) {
      if (!value && this._store) return this._store;
      if (typeof value === "function") {
        this._store = new value({
          name: this.collectionName(),
          className: Tower.namespaced(this.name)
        });
      } else if (typeof value === "object") {
        this._store || (this._store = new this.defaultStore({
          name: this.collectionName(),
          className: Tower.namespaced(this.name)
        }));
        Tower.Support.Object.extend(this._store, value);
      } else if (value) {
        this._store = value;
      }
      this._store || (this._store = new this.defaultStore({
        name: this.collectionName(),
        className: Tower.namespaced(this.name)
      }));
      return this._store;
    },
    load: function(records) {
      return this.store().load(records);
    },
    collectionName: function() {
      return Tower.Support.String.camelize(Tower.Support.String.pluralize(this.name), true);
    },
    resourceName: function() {
      return Tower.Support.String.camelize(this.name, true);
    }
  },
  InstanceMethods: {
    save: function(options, callback) {
      var _this = this;
      if (this.readOnly) throw new Error("Record is read only");
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      options || (options = {});
      if (options.validate !== false) {
        this.validate(function(error) {
          if (error) {
            if (callback) return callback.call(_this, null, false);
          } else {
            return _this._save(callback);
          }
        });
      } else {
        this._save(callback);
      }
      return this;
    },
    updateAttributes: function(attributes, callback) {
      return this._update(attributes, callback);
    },
    destroy: function(callback) {
      if (this.isNew()) {
        if (callback) callback.call(this, null);
      } else {
        this._destroy(callback);
      }
      return this;
    },
    "delete": function(callback) {
      return this.destroy(callback);
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
      return this.runCallbacks("save", function(block) {
        var complete;
        complete = _this._callback(block, callback);
        if (_this.isNew()) {
          return _this._create(complete);
        } else {
          return _this._update(_this.toUpdates(), complete);
        }
      });
    },
    _create: function(callback) {
      var _this = this;
      this.runCallbacks("create", function(block) {
        var complete;
        complete = _this._callback(block, callback);
        return _this.constructor.create(_this, {
          instantiate: false
        }, function(error) {
          if (error && !callback) throw error;
          if (!error) {
            _this.changes = {};
            _this.persistent = true;
            _this.updateSyncAction("create");
          }
          return complete.call(_this, error);
        });
      });
      return this;
    },
    _update: function(updates, callback) {
      var _this = this;
      this.runCallbacks("update", function(block) {
        var complete;
        complete = _this._callback(block, callback);
        return _this.constructor.update(_this.get("id"), updates, {
          instantiate: false
        }, function(error) {
          if (error && !callback) throw error;
          if (!error) {
            _this.changes = {};
            _this.persistent = true;
            _this.updateSyncAction("update");
          }
          return complete.call(_this, error);
        });
      });
      return this;
    },
    _destroy: function(callback) {
      var _this = this;
      this.runCallbacks("destroy", function(block) {
        var complete;
        complete = _this._callback(block, callback);
        return _this.constructor.destroy(_this, {
          instantiate: false
        }, function(error) {
          if (error && !callback) throw error;
          if (!error) {
            _this.persistent = false;
            _this.changes = {};
            delete _this.attributes.id;
            _this.updateSyncAction("destroy");
          }
          return complete.call(_this, error);
        });
      });
      return this;
    },
    updateSyncAction: function() {}
  }
};

module.exports = Tower.Model.Persistence;
