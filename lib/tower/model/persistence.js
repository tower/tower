
Tower.Model.Persistence = {
  ClassMethods: {
    defaultStore: Tower.Store.Memory,
    store: function(value) {
      if (!value && this._store) return this._store;
      if (typeof value === "object") {
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
    load: function(array) {
      return this.store().load(array);
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
        this.validate(function(error, success) {
          if (success) {
            return _this._save(callback);
          } else {
            if (callback) return callback.call(_this, null, false);
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
      var _this = this;
      if (this.isNew()) {
        if (callback) callback.call(this, null);
      } else {
        this.runCallbacks("destroy", function() {
          return _this.store().destroy({
            id: _this.id
          }, {
            instantiate: false
          }, function(error) {
            if (error && !callback) throw error;
            _this.persistent = false;
            if (!error) delete _this.attributes.id;
            if (callback) return callback.call(_this, error);
          });
        });
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
      return this.runCallbacks("save", function() {
        if (this.isNew()) {
          return this._create(callback);
        } else {
          return this._update(this.toUpdates(), callback);
        }
      });
    },
    _update: function(attributes, callback) {
      var _this = this;
      this.runCallbacks("update", function() {
        return _this.store().update({
          id: _this.id
        }, attributes, {
          instantiate: false
        }, function(error) {
          if (error && !callback) throw error;
          if (!error) _this.changes = {};
          _this.persistent = true;
          if (callback) return callback.call(_this, error);
        });
      });
      return this;
    },
    _create: function(callback) {
      var _this = this;
      this.runCallbacks("create", function() {
        return _this.store().create(_this.attributes, {
          instantiate: false
        }, function(error, docs) {
          if (error && !callback) throw error;
          if (!error) _this.changes = {};
          _this.persistent = true;
          _this.store().load(_this);
          if (callback) return callback.call(_this, error);
        });
      });
      return this;
    }
  }
};

module.exports = Tower.Model.Persistence;
