
Tower.Store.Callbacks = {
  runBeforeCreate: function(criteria, callback) {
    return callback();
  },
  runAfterCreate: function(criteria, callback) {
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
  runAfterFind: function(criteria, callback) {
    return callback();
  }
};

module.exports = Tower.Store.Callbacks;
