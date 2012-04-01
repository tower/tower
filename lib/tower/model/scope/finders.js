var __slice = Array.prototype.slice;

Tower.Model.Scope.Finders = {
  ClassMethods: {
    finderMethods: ["find", "all", "first", "last", "count", "exists"]
  },
  find: function() {
    return this._find.apply(this, this._extractArgsForFind(arguments));
  },
  first: function(callback) {
    var criteria;
    criteria = this.compile();
    criteria.defaultSort("asc");
    return this.store.findOne(criteria, callback);
  },
  last: function(callback) {
    var criteria;
    criteria = this.compile();
    criteria.defaultSort("desc");
    return this.store.findOne(conditions, options, callback);
  },
  all: function(callback) {
    return this.store.find(this.compile(), callback);
  },
  pluck: function() {
    var attributes;
    attributes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  },
  explain: function() {},
  count: function(callback) {
    return this.store.count(this.compile(), callback);
  },
  exists: function(callback) {
    return this.store.exists(this.compile(), callback);
  },
  batch: function() {
    return this;
  },
  fetch: function() {},
  _find: function(criteria, callback) {
    if (criteria.options.findOne) {
      return this.store.findOne(criteria, callback);
    } else {
      return this.store.find(criteria, callback);
    }
  }
};

module.exports = Tower.Model.Scope.Finders;
