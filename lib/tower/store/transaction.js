var __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
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

Tower.Store.Transaction = (function(_super) {
  var Transaction;

  function Transaction() {
    return Transaction.__super__.constructor.apply(this, arguments);
  }

  Transaction = __extends(Transaction, _super);

  __defineProperty(Transaction,  "init", function() {
    return this.records = [];
  });

  __defineProperty(Transaction,  "add", function(record) {
    return this.records.push(record);
  });

  __defineProperty(Transaction,  "remove", function(record) {
    return this.records.splice(1, _.indexOf(this.records, record));
  });

  __defineProperty(Transaction,  "adopt", function(record) {
    var transaction;
    transaction = record.get('transaction');
    if (transaction !== this) {
      transaction.remove(record);
      return this.add(record);
    }
  });

  __defineProperty(Transaction,  "committed", function() {
    var record, records, _i, _len, _results;
    records = this.records;
    _results = [];
    for (_i = 0, _len = records.length; _i < _len; _i++) {
      record = records[_i];
      _results.push(record.committed());
    }
    return _results;
  });

  __defineProperty(Transaction,  "rollback", function() {
    var record, records, _i, _len, _results;
    records = this.records;
    _results = [];
    for (_i = 0, _len = records.length; _i < _len; _i++) {
      record = records[_i];
      _results.push(record.rollback());
    }
    return _results;
  });

  return Transaction;

})(Tower.Class);
