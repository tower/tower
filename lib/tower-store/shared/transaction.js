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

Tower.StoreTransaction = (function(_super) {
  var StoreTransaction;

  function StoreTransaction() {
    return StoreTransaction.__super__.constructor.apply(this, arguments);
  }

  StoreTransaction = __extends(StoreTransaction, _super);

  StoreTransaction.reopen({
    init: function() {
      return this.records = [];
    },
    add: function(record) {
      return this.records.push(record);
    },
    remove: function(record) {
      return this.records.splice(1, _.indexOf(this.records, record));
    },
    adopt: function(record) {
      var transaction;
      transaction = record.get('transaction');
      if (transaction !== this) {
        transaction.remove(record);
        return this.add(record);
      }
    },
    committed: function() {
      var record, records, _i, _len, _results;
      records = this.records;
      _results = [];
      for (_i = 0, _len = records.length; _i < _len; _i++) {
        record = records[_i];
        _results.push(record.committed());
      }
      return _results;
    },
    rollback: function() {
      var record, records, _i, _len, _results;
      records = this.records;
      _results = [];
      for (_i = 0, _len = records.length; _i < _len; _i++) {
        record = records[_i];
        _results.push(record.rollback());
      }
      return _results;
    }
  });

  return StoreTransaction;

})(Tower.Class);
