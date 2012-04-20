var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Store.Memory = (function(_super) {

  __extends(Memory, _super);

  Memory.name = 'Memory';

  Memory.stores = function() {
    return this._stores || (this._stores = []);
  };

  Memory.clean = function(callback) {
    var store, stores, _i, _len;
    stores = this.stores();
    for (_i = 0, _len = stores.length; _i < _len; _i++) {
      store = stores[_i];
      store.clean();
    }
    return callback();
  };

  function Memory(options) {
    Memory.__super__.constructor.call(this, options);
    this.initialize();
  }

  Memory.prototype.initialize = function() {
    this.constructor.stores().push(this);
    this.records = {};
    return this.lastId = 0;
  };

  Memory.prototype.clean = function() {
    this.records = {};
    return this.lastId = 0;
  };

  return Memory;

})(Tower.Store);

require('./memory/finders');

require('./memory/persistence');

require('./memory/serialization');

Tower.Store.Memory.include(Tower.Store.Memory.Finders);

Tower.Store.Memory.include(Tower.Store.Memory.Persistence);

Tower.Store.Memory.include(Tower.Store.Memory.Serialization);

module.exports = Tower.Store.Memory;
