
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
    },
    transaction: function(block) {
      var transaction;
      transaction = new Tower.Store.Transaction;
      if (block) {
        block.call(this, transaction);
      }
      return transaction;
    }
  },
  InstanceMethods: {
    transaction: Ember.computed(function() {
      return new Tower.Store.Transaction;
    }).cacheable(),
    withTransaction: function(block) {
      var transaction;
      transaction = this.get('transaction');
      if (block) {
        block.call(this, transaction);
      }
      return transaction;
    },
    save: function(options, callback) {
      return this.send('save', options, callback);
    },
    updateAttributes: function(attributes, callback) {
      this.set(attributes);
      return this.send('update', callback);
    },
    destroy: function(callback) {
      return this.send('destroy', callback);
    },
    reload: function() {}
  }
};

module.exports = Tower.Model.Persistence;
