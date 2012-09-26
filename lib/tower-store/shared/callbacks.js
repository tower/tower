var _;

_ = Tower._;

Tower.StoreCallbacks = {
  runBeforeInsert: function(criteria, callback) {
    return callback();
  },
  runAfterInsert: function(criteria, callback) {
    return callback();
  },
  runBeforeUpdate: function(criteria, callback) {
    if (criteria.throughRelation) {
      return criteria.appendThroughConditions(callback);
    } else {
      return callback();
    }
  },
  runAfterUpdate: function(criteria, callback) {
    return callback();
  },
  runBeforeDestroy: function(criteria, callback) {
    if (criteria.throughRelation) {
      return criteria.appendThroughConditions(callback);
    } else {
      return callback();
    }
  },
  runAfterDestroy: function(criteria, callback) {
    return callback();
  },
  runBeforeFind: function(criteria, callback) {
    if (criteria.throughRelation) {
      return criteria.appendThroughConditions(callback);
    } else {
      return callback();
    }
  },
  runAfterFind: function(criteria, callback, records) {
    if (criteria.get('includes') && criteria.get('includes').length) {
      return criteria.eagerLoad(records, callback);
    } else {
      return callback();
    }
  }
};

module.exports = Tower.StoreCallbacks;
