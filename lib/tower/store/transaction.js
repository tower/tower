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
    return Ember.set(this, 'buckets', {
      clean: Ember.Map.create(),
      created: Ember.Map.create(),
      updated: Ember.Map.create(),
      deleted: Ember.Map.create()
    });
  });

  __defineProperty(Transaction,  "create", function(record, callback) {});

  __defineProperty(Transaction,  "update", function(record) {});

  __defineProperty(Transaction,  "add", function(record) {
    return this.adopt(record);
  });

  __defineProperty(Transaction,  "remove", function(record) {
    var defaultTransaction;
    defaultTransaction = Ember.getPath(this, 'store.defaultTransaction');
    return defaultTransaction.adopt(record);
  });

  __defineProperty(Transaction,  "adopt", function(record) {
    var oldTransaction;
    oldTransaction = Ember.get(record, 'transaction');
    if (oldTransaction) {
      oldTransaction.removeFromBucket('clean', record);
    }
    this.addToBucket('clean', record);
    return Ember.set(record, 'transaction', this);
  });

  __defineProperty(Transaction,  "recordBecameDirty", function(kind, record) {
    this.removeFromBucket('clean', record);
    return this.addToBucket(kind, record);
  });

  __defineProperty(Transaction,  "addToBucket", function(kind, record) {
    var bucket, records, type;
    bucket = Ember.get(Ember.get(this, 'buckets'), kind);
    type = record.constructor;
    records = bucket.get(type);
    if (!records) {
      records = Ember.OrderedSet.create();
      bucket.set(type, records);
    }
    return records.add(record);
  });

  __defineProperty(Transaction,  "removeFromBucket", function(kind, record) {
    var bucket, records, type;
    bucket = Ember.get(Ember.get(this, 'buckets'), kind);
    type = record.constructor;
    records = bucket.get(type);
    if (records) {
      return records.remove(record);
    }
  });

  __defineProperty(Transaction,  "recordBecameClean", function(kind, record) {
    var defaultTransaction;
    this.removeFromBucket(kind, record);
    defaultTransaction = Ember.getPath(this, 'store.defaultTransaction');
    if (defaultTransaction) {
      return defaultTransaction.adopt(record);
    }
  });

  return Transaction;

})(Tower.Class);
