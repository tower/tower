
Tower.Model.Persistence = {
  ClassMethods: {
    "new": Ember.Object.create,
    store: function(value) {
      var defaultStore, metadata, store, type;
      metadata = this.metadata();
      store = metadata.store;
      if (arguments.length === 0 && store) {
        return store;
      }
      defaultStore = this["default"]('store') || Tower.Store.Memory;
      type = typeof value;
      if (type === 'function') {
        store = new value({
          name: metadata.namePlural,
          type: Tower.namespaced(metadata.className)
        });
      } else if (type === 'object') {
        store || (store = new defaultStore({
          name: metadata.namePlural,
          type: Tower.namespaced(metadata.className)
        }));
        _.extend(store, value);
      } else if (value) {
        store = value;
      }
      store || (store = new defaultStore({
        name: metadata.namePlural,
        type: Tower.namespaced(metadata.className)
      }));
      return metadata.store = store;
    },
    load: function(records) {
      return this.store().load(records);
    }
  },
  InstanceMethods: {
    store: Ember.computed(function() {
      return this.constructor.store();
    }),
    save: function(options, callback) {
      var _this = this;
      this.set('isSaving', true);
      this.get('transaction').adopt(this);
      if (this.readOnly) {
        throw new Error('Record is read only');
      }
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});
      if (options.validate !== false) {
        return this.validate(function(error) {
          if (error) {
            _this.set('isValid', false);
            if (callback) {
              return callback.call(_this, null);
            }
          } else {
            _this.set('isValid', true);
            return _this._save(callback);
          }
        });
      } else {
        return this._save(callback);
      }
    },
    updateAttributes: function(attributes, callback) {
      this.setProperties(attributes);
      return this.save(callback);
    },
    destroy: function(callback) {
      if (this.get('isNew')) {
        callback.call(this, callback ? null : void 0);
      } else {
        this._destroy(callback);
      }
      return this;
    },
    reload: function() {},
    _save: function(callback) {
      var _this = this;
      this.runCallbacks('save', function(block) {
        var complete;
        complete = Tower.callbackChain(block, callback);
        if (_this.get('isNew')) {
          return _this._create(complete);
        } else {
          return _this._update(complete);
        }
      });
      return;
    },
    _create: function(callback) {
      var _this = this;
      this.runCallbacks('create', function(block) {
        var complete;
        complete = Tower.callbackChain(block, callback);
        return _this.constructor.scoped({
          instantiate: false
        }).insert(_this, function(error) {
          if (error && !callback) {
            throw error;
          }
          _this.set('isSaving', false);
          if (!error) {
            _this.set('isNew', false);
            _this.get('data').commit();
          }
          return complete.call(_this, error);
        });
      });
      return;
    },
    _update: function(callback) {
      var _this = this;
      this.runCallbacks('update', function(block) {
        var complete;
        complete = Tower.callbackChain(block, callback);
        return _this.constructor.scoped({
          instantiate: false
        }).update(_this.get('id'), _this, function(error) {
          if (error && !callback) {
            throw error;
          }
          _this.set('isSaving', false);
          if (!error) {
            _this.set('isNew', false);
            _this.get('data').commit();
          }
          return complete.call(_this, error);
        });
      });
      return;
    },
    _destroy: function(callback) {
      var _this = this;
      this.runCallbacks('destroy', function(block) {
        var complete;
        complete = Tower.callbackChain(block, callback);
        return _this.constructor.scoped({
          instantiate: false
        }).destroy(_this, function(error) {
          if (error && !callback) {
            throw error;
          }
          if (!error) {
            return _this.destroyRelations(function(error) {
              _this.set('isNew', false);
              _this.set('isDeleted', true);
              _this.get('data').set('id', void 0);
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
