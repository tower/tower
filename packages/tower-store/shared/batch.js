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

Tower.StoreBatch = (function(_super) {
  var StoreBatch;

  function StoreBatch() {
    return StoreBatch.__super__.constructor.apply(this, arguments);
  }

  StoreBatch = __extends(StoreBatch, _super);

  StoreBatch.reopen({
    autocommit: Tower.isServer,
    bulk: false,
    init: function() {
      this._super.apply(this, arguments);
      return Ember.set(this, 'buckets', {
        clean: Ember.Map.create(),
        created: Ember.Map.create(),
        updated: Ember.Map.create(),
        deleted: Ember.Map.create()
      });
    },
    removeCleanRecords: function() {
      var clean,
        _this = this;
      clean = this.getBucket("clean");
      return clean.forEach(function(type, records) {
        return records.forEach(function(record) {
          return _this.remove(record);
        });
      });
    },
    add: function(record) {
      return this.adopt(record);
    },
    remove: function(record) {
      var defaultTransaction;
      defaultTransaction = Ember.getPath(this, 'store.defaultTransaction');
      return defaultTransaction.adopt(record);
    },
    adopt: function(record) {
      var oldTransaction;
      oldTransaction = record.get('transaction');
      if (oldTransaction) {
        oldTransaction.removeFromBucket('clean', record);
      }
      this.addToBucket('clean', record);
      return record.set('transaction', this);
    },
    addToBucket: function(kind, record) {
      var bucket, records, type;
      bucket = Ember.get(Ember.get(this, 'buckets'), kind);
      type = this.getType(record);
      records = bucket.get(type);
      if (!records) {
        records = Ember.OrderedSet.create();
        bucket.set(type, records);
      }
      return records.add(record);
    },
    removeFromBucket: function(kind, record) {
      var bucket, records, type;
      bucket = this.getBucket(kind);
      type = this.getType(record);
      records = bucket.get(type);
      if (records) {
        return records.remove(record);
      }
    },
    getBucket: function(kind) {
      return Ember.get(Ember.get(this, 'buckets'), kind);
    },
    getType: function(recordOrCursor) {
      if (recordOrCursor instanceof Tower.ModelCursor) {
        return recordOrCursor.getType();
      } else {
        return recordOrCursor.constructor;
      }
    },
    recordBecameClean: function(kind, record) {
      var defaultTransaction;
      this.removeFromBucket(kind, record);
      defaultTransaction = Ember.getPath(this, 'store.defaultTransaction');
      if (defaultTransaction) {
        return defaultTransaction.adopt(record);
      }
    },
    recordBecameDirty: function(kind, record) {
      this.removeFromBucket('clean', record);
      return this.addToBucket(kind, record);
    },
    commit: function(callback) {
      var commitDetails, iterate, store,
        _this = this;
      iterate = function(bucketType, fn, binding) {
        var dirty;
        dirty = _this.getBucket(bucketType);
        return dirty.forEach(function(type, records) {
          var array;
          if (records.isEmpty()) {
            return;
          }
          array = [];
          records.forEach(function(record) {
            record.send("willCommit");
            return array.push(record);
          });
          return fn.call(binding, type, array);
        });
      };
      commitDetails = {
        updated: {
          eachType: function(fn, binding) {
            return iterate("updated", fn, binding);
          }
        },
        created: {
          eachType: function(fn, binding) {
            return iterate("created", fn, binding);
          }
        },
        deleted: {
          eachType: function(fn, binding) {
            return iterate("deleted", fn, binding);
          }
        }
      };
      this.removeCleanRecords();
      store = Ember.get(this, "store");
      return store.commit(commitDetails, callback);
    }
  });

  return StoreBatch;

})(Tower.Class);

module.exports = Tower.StoreBatch;
