var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Store.Memory = (function() {

  __extends(Memory, Tower.Store);

  Memory.stores = function() {
    return this._stores || (this._stores = []);
  };

  Memory.clear = function() {
    var store, stores, _i, _len;
    stores = this.stores();
    for (_i = 0, _len = stores.length; _i < _len; _i++) {
      store = stores[_i];
      store.clear();
    }
    this._stores.length = 0;
    return this._stores;
  };

  function Memory(options) {
    Memory.__super__.constructor.call(this, options);
    this.constructor.stores().push(this);
    this.records = {};
    this.lastId = 0;
  }

  return Memory;

})();

require('./memory/finders');

require('./memory/persistence');

require('./memory/serialization');

Tower.Store.Memory.include(Tower.Store.Memory.Finders);

Tower.Store.Memory.include(Tower.Store.Memory.Persistence);

Tower.Store.Memory.include(Tower.Store.Memory.Serialization);

module.exports = Tower.Store.Memory;
