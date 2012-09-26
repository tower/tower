var __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) {
    if (typeof parent.__extend == 'function') return parent.__extend(child);
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if (typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.StoreMemory = (function(_super) {
  var StoreMemory;

  function StoreMemory() {
    return StoreMemory.__super__.constructor.apply(this, arguments);
  }

  StoreMemory = __extends(StoreMemory, _super);

  StoreMemory.reopenClass({
    stores: function() {
      return this._stores || (this._stores = []);
    },
    clean: function(callback) {
      var store, stores, _i, _len;
      stores = this.stores();
      for (_i = 0, _len = stores.length; _i < _len; _i++) {
        store = stores[_i];
        store.clean();
      }
      if (callback) {
        return callback();
      }
    }
  });

  StoreMemory.reopen({
    init: function(options) {
      this._super.apply(this, arguments);
      return this.initialize();
    },
    initialize: function() {
      this.constructor.stores().push(this);
      this.records = Ember.Map.create();
      this.lastId = 1;
      return Ember.set(this, 'batch', new Tower.StoreBatch);
    },
    clean: function() {
      return this.records = Ember.Map.create();
    },
    commit: function() {
      return Ember.get(this, 'batch').commit();
    }
  });

  return StoreMemory;

})(Tower.Store);

require('./memory/calculations');

require('./memory/finders');

require('./memory/persistence');

require('./memory/serialization');

Tower.StoreMemory.include(Tower.StoreMemoryCalculations);

Tower.StoreMemory.include(Tower.StoreMemoryFinders);

Tower.StoreMemory.include(Tower.StoreMemoryPersistence);

Tower.StoreMemory.include(Tower.StoreMemorySerialization);

module.exports = Tower.StoreMemory;
