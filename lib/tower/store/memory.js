var __defineStaticProperty = function(clazz, key, value) {
  if(typeof clazz.__defineStaticProperty == 'function') return clazz.__defineStaticProperty(key, value);
  return clazz[key] = value;
},
  __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) { 
    if(typeof parent.__extend == 'function') return parent.__extend(child);
      
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if(typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.Store.Memory = (function(_super) {
  var Memory;

  function Memory() {
    return Memory.__super__.constructor.apply(this, arguments);
  }

  Memory = __extends(Memory, _super);

  __defineStaticProperty(Memory,  "stores", function() {
    return this._stores || (this._stores = []);
  });

  __defineStaticProperty(Memory,  "clean", function(callback) {
    var store, stores, _i, _len;
    stores = this.stores();
    for (_i = 0, _len = stores.length; _i < _len; _i++) {
      store = stores[_i];
      store.clean();
    }
    return callback();
  });

  __defineProperty(Memory,  "init", function(options) {
    this._super.apply(this, arguments);
    return this.initialize();
  });

  __defineProperty(Memory,  "initialize", function() {
    this.constructor.stores().push(this);
    this.records = {};
    this.lastId = 1;
    return Ember.set(this, 'batch', new Tower.Store.Batch);
  });

  __defineProperty(Memory,  "clean", function() {
    this.records = {};
    return this.lastId = 1;
  });

  __defineProperty(Memory,  "commit", function() {
    return Ember.get(this, 'batch').commit();
  });

  return Memory;

})(Tower.Store);

require('./memory/finders');

require('./memory/persistence');

require('./memory/serialization');

Tower.Store.Memory.include(Tower.Store.Memory.Finders);

Tower.Store.Memory.include(Tower.Store.Memory.Persistence);

Tower.Store.Memory.include(Tower.Store.Memory.Serialization);

module.exports = Tower.Store.Memory;
