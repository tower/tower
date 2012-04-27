
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
      if (typeof value === 'function') {
        store = new value({
          name: metadata.namePlural,
          type: Tower.namespaced(metadata.className)
        });
      } else if (typeof value === 'object') {
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
    save: function(options, callback) {
      this.get('transaction').adopt(this);
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});
      options.callback = callback;
      return this.send('save', options);
    },
    updateAttributes: function(attributes, callback) {
      this.set(attributes);
      return this._update(attributes, callback);
    },
    destroy: function(callback) {
      if (this.get('isNew')) {
        if (callback) {
          callback.call(this, null);
        }
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
        complete = _this._callback(block, callback);
        if (_this.get('isNew')) {
          return _this._create(complete);
        } else {
          return _this._update(_this.toUpdates(), complete);
        }
      });
      return;
    },
    _create: function(callback) {
      var _this = this;
      this.runCallbacks('create', function(block) {
        var complete;
        complete = _this._callback(block, callback);
        return _this.constructor.scoped({
          instantiate: false
        }).create(_this, function(error) {
          if (error && !callback) {
            throw error;
          }
          if (!error) {
            _this.persistent = true;
          }
          return complete.call(_this, error);
        });
      });
      return;
    },
    _update: function(updates, callback) {
      var _this = this;
      this.runCallbacks('update', function(block) {
        var complete;
        complete = _this._callback(block, callback);
        return _this.constructor.scoped({
          instantiate: false
        }).update(_this.get('id'), updates, function(error) {
          if (error && !callback) {
            throw error;
          }
          if (!error) {
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
      this.runCallbacks('destroy', function(block) {
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
