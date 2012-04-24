var __defineProperty = function(clazz, key, value) {
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

Tower.Store.Transaction = (function(_super) {
  var Transaction;

  function Transaction() {
    return Transaction.__super__.constructor.apply(this, arguments);
  }

  Transaction = __extends(Transaction, _super);

  __defineProperty(Transaction,  "autocommit", true);

  __defineProperty(Transaction,  "init", function() {
    this._super.apply(this, arguments);
    return Ember.set(this, "buckets", {
      clean: Ember.Map.create(),
      created: Ember.Map.create(),
      updated: Ember.Map.create(),
      deleted: Ember.Map.create()
    });
  });

  __defineProperty(Transaction,  "recordBecameDirty", function() {});

  __defineProperty(Transaction,  "recordBecameClean", function() {});

  return Transaction;

})(Tower.Class);
