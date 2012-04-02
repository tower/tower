var __slice = Array.prototype.slice;

Tower.Model.Scope.Finders = {
  ClassMethods: {
    finderMethods: ["find", "all", "first", "last", "count", "exists", "instantiate"]
  },
  find: function() {
    var args, callback, criteria, ids, object, _i, _len;
    criteria = this.criteria.clone();
    args = _.flatten(_.args(arguments));
    callback = _.extractBlock(args);
    if (args.length) {
      ids = [];
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        object = args[_i];
        if (object == null) continue;
        ids.push(object instanceof Tower.Model ? object.get('id') : object);
      }
      criteria.where({
        id: {
          $in: ids
        }
      });
    }
    return criteria.find(callback);
  },
  first: function(callback) {
    var criteria;
    criteria = this.compile();
    criteria.defaultSort("asc");
    return criteria.findOne(callback);
  },
  last: function(callback) {
    var criteria;
    criteria = this.compile();
    criteria.defaultSort("desc");
    return criteria.findOne(callback);
  },
  all: function(callback) {
    return this.compile().find(callback);
  },
  pluck: function() {
    var attributes;
    attributes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this.compile().find(callback);
  },
  explain: function() {
    return this.compile().explain(callback);
  },
  count: function(callback) {
    return this.compile().count(callback);
  },
  exists: function(callback) {
    return this.compile().exists(callback);
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
