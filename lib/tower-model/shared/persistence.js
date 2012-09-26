var _;

_ = Tower._;

Tower.ModelPersistence = {
  ClassMethods: {
    "new": Ember.Object.create,
    store: function(value) {
      var defaultStore, metadata, store, type;
      metadata = this.metadata();
      store = metadata.store;
      if (arguments.length === 0 && store) {
        return store;
      }
      defaultStore = this["default"]('store') || Tower.Model["default"]('store') || Tower.StoreMemory;
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
    },
    unload: function(records) {
      return this.store().unload(records);
    },
    empty: function() {
      return this.store().clean();
    }
  },
  InstanceMethods: {
    store: Ember.computed(function() {
      return this.constructor.store();
    }),
    save: function(options, callback) {
      var _this = this;
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});
      if (this.get('isSaving')) {
        if (callback) {
          callback.call(this);
        }
        return true;
      }
      this.set('isSaving', true);
      this.get('transaction').adopt(this);
      if (this.readOnly) {
        throw new Error('Record is read only');
      }
      if (options.validate !== false) {
        return this.validate(function(error) {
          error || (error = _.isPresent(_this.get('errors')));
          if (error) {
            _this.set('isValid', false);
            _this.set('isSaving', false);
            if (callback) {
              return callback.call(_this);
            } else {
              throw new Error(_.flatten(_.values(_this.errors)).join('. '));
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
      this.assignAttributes(attributes);
      return this.save(callback);
    },
    updateAttribute: function(key, value, options, callback) {
      switch (typeof options) {
        case 'string':
          options = {
            operation: options
          };
          break;
        case 'function':
          callback = options;
          options = {};
      }
      options || (options = {});
      if (options.atomic) {
        return this.atomicUpdateAttribute(key, value, options.operation, callback);
      } else {
        this.modifyAttribute(options.operation, key, value);
        return this.save(options, callback);
      }
    },
    atomicallyUpdateAttributes: function(attributes, callback) {},
    atomicallyUpdateAttribute: function(key, value, operation, callback) {
      var updates;
      if (typeof operation === 'function') {
        callback = operation;
        operation = void 0;
      }
      this.modifyAttribute(operation, key, value);
      this.get('data').strip(key);
      updates = {};
      updates[key] = value;
      return this.constructor.scoped({
        instantiate: false,
        noDefault: true
      }).update(this.get('id'), updates, callback);
    },
    destroy: function(callback) {
      if (this.get('isNew')) {
        this.set('isDeleted', true);
        callback.call(this, callback ? null : void 0);
      } else {
        this._destroy(callback);
      }
      return this;
    },
    reload: function(callback) {
      var _this = this;
      this.constructor.find(this.get('id'), function(error, freshRecord) {
        _this._merge(freshRecord);
        if (callback) {
          return callback.call(_this, error);
        }
      });
      return this;
    },
    _merge: function(record) {
      _.extend(this.get('attributes'), record.get('attributes'));
      this.propertyDidChange('data');
      _.extend(this.get('changedAttributes'), record.get('changedAttributes'));
      if (record.get('previousChanges')) {
        _.extend(this.get('previousChanges'), record.get('previousChanges'));
      }
      return this;
    },
    refresh: function(callback) {
      var _this = this;
      this.set('isSyncing', true);
      this.constructor.where({
        id: this.get('id')
      }).limit(1).fetch(function(error, freshRecord) {
        _this._merge(freshRecord);
        _this.set('isSyncing', false);
        if (callback) {
          return callback.call(_this, error);
        }
      });
      return this;
    },
    rollback: function() {
      _.extend(this.get('attributes'), this.get('changedAttributes'));
      _.clean(this.get('changedAttributes'), {});
      return this.propertyDidChange('data');
    },
    commit: function() {
      this.set('previousChanges', this.get('changes'));
      _.clean(this.get('changedAttributes'));
      return this.set('isDirty', false);
    },
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
      return void 0;
    },
    _create: function(callback) {
      var _this = this;
      this.runCallbacks('create', function(block) {
        var complete;
        complete = Tower.callbackChain(block, callback);
        return _this.constructor.scoped({
          instantiate: false,
          noDefault: true
        }).insert(_this, function(error) {
          if (error && !callback) {
            throw error;
          }
          _this.set('isSaving', false);
          if (!error) {
            _this.set('isNew', false);
            _this.commit();
          }
          return complete.call(_this, error);
        });
      });
      return void 0;
    },
    _update: function(callback) {
      var _this = this;
      this.runCallbacks('update', function(block) {
        var complete;
        complete = Tower.callbackChain(block, callback);
        return _this.constructor.scoped({
          instantiate: false,
          noDefault: true
        }).update(_this.get('id'), _this, function(error) {
          if (error && !callback) {
            throw error;
          }
          _this.set('isSaving', false);
          if (!error) {
            _this.set('isNew', false);
            _this.commit();
          }
          return complete.call(_this, error);
        });
      });
      return void 0;
    },
    _destroy: function(callback) {
      var _this = this;
      this.runCallbacks('destroy', function(block) {
        var complete;
        complete = Tower.callbackChain(block, callback);
        return _this.constructor.scoped({
          instantiate: false,
          noDefault: true
        }).destroy(_this, function(error) {
          if (error && !callback) {
            throw error;
          }
          if (!error) {
            return _this.destroyRelations(function(error) {
              _this.set('isNew', false);
              _this.set('isDeleted', true);
              return complete.call(_this, error);
            });
          } else {
            return complete.call(_this, error);
          }
        });
      });
      return void 0;
    }
  }
};

module.exports = Tower.ModelPersistence;
