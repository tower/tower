
Tower.Model.Scope.Finders = {
  ClassMethods: {
    finderMethods: ["find", "all", "first", "last", "count", "exists"]
  },
  find: function() {
    var callback, conditions, criteria, options, _ref, _ref2;
    _ref = this._extractArgs(arguments, {
      ids: true
    }), criteria = _ref.criteria, options = _ref.options, callback = _ref.callback;
    _ref2 = criteria.toQuery(), conditions = _ref2.conditions, options = _ref2.options;
    return this._find(conditions, options, callback);
  },
  first: function(callback) {
    var conditions, options, _ref;
    _ref = this.toQuery("asc"), conditions = _ref.conditions, options = _ref.options;
    return this.store.findOne(conditions, options, callback);
  },
  last: function(callback) {
    var conditions, options, _ref;
    _ref = this.toQuery("desc"), conditions = _ref.conditions, options = _ref.options;
    return this.store.findOne(conditions, options, callback);
  },
  all: function(callback) {
    var conditions, options, _ref;
    _ref = this.toQuery(), conditions = _ref.conditions, options = _ref.options;
    return this.store.find(conditions, options, callback);
  },
  count: function(callback) {
    var conditions, options, _ref;
    _ref = this.toQuery(), conditions = _ref.conditions, options = _ref.options;
    return this.store.count(conditions, options, callback);
  },
  exists: function(callback) {
    var conditions, options, _ref;
    _ref = this.toQuery(), conditions = _ref.conditions, options = _ref.options;
    return this.store.exists(conditions, options, callback);
  },
  batch: function() {},
  fetch: function() {},
  _find: function(conditions, options, callback) {
    if (conditions.id && conditions.id.hasOwnProperty("$in") && conditions.id.$in.length === 1) {
      return this.store.findOne(conditions, options, callback);
    } else {
      return this.store.find(conditions, options, callback);
    }
  }
};

module.exports = Tower.Model.Scope.Finders;
