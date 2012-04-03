var key, _fn, _i, _len, _ref,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
  __slice = Array.prototype.slice,
  _this = this;

Tower.Model.Scope = (function(_super) {

  __extends(Scope, _super);

  Scope.finderMethods = ["find", "all", "first", "last", "count", "exists", "instantiate", "pluck"];

  Scope.persistenceMethods = ["create", "update", "destroy", "build"];

  Scope.queryMethods = ["where", "order", "sort", "asc", "desc", "limit", "offset", "select", "joins", "includes", "excludes", "paginate", "within", "allIn", "allOf", "alsoIn", "anyIn", "anyOf", "near", "notIn"];

  Scope.queryOperators = {
    ">=": "$gte",
    "$gte": "$gte",
    ">": "$gt",
    "$gt": "$gt",
    "<=": "$lte",
    "$lte": "$lte",
    "<": "$lt",
    "$lt": "$lt",
    "$in": "$in",
    "$nin": "$nin",
    "$any": "$any",
    "$all": "$all",
    "=~": "$regex",
    "$m": "$regex",
    "$regex": "$regex",
    "$match": "$match",
    "$notMatch": "$notMatch",
    "!~": "$nm",
    "$nm": "$nm",
    "=": "$eq",
    "$eq": "$eq",
    "!=": "$neq",
    "$neq": "$neq",
    "$null": "$null",
    "$notNull": "$notNull"
  };

  function Scope(criteria) {
    this.criteria = criteria;
  }

  Scope.prototype.build = function() {
    var args, callback, criteria;
    criteria = this.compile();
    args = _.args(arguments);
    callback = _.extractBlock(args);
    criteria.addData(args);
    return criteria.build(callback);
  };

  Scope.prototype.create = function() {
    var args, callback, criteria;
    criteria = this.compile();
    args = _.args(arguments);
    callback = _.extractBlock(args);
    criteria.addData(args);
    return criteria.create(callback);
  };

  Scope.prototype.update = function() {
    var args, callback, criteria, updates;
    criteria = this.compile();
    args = _.flatten(_.args(arguments));
    callback = _.extractBlock(args);
    updates = args.pop();
    if (!(updates && typeof updates === "object")) {
      throw new Error("Must pass in updates hash");
    }
    criteria.addData(updates);
    criteria.addIds(args);
    return criteria.update(callback);
  };

  Scope.prototype.destroy = function() {
    var args, callback, criteria;
    criteria = this.compile();
    args = _.flatten(_.args(arguments));
    callback = _.extractBlock(args);
    criteria.addIds(args);
    return criteria.destroy(callback);
  };

  Scope.prototype.find = function() {
    var args, callback, criteria;
    criteria = this.compile();
    args = _.flatten(_.args(arguments));
    callback = _.extractBlock(args);
    criteria.addIds(args);
    return criteria.find(callback);
  };

  Scope.prototype.first = function(callback) {
    var criteria;
    criteria = this.compile();
    return criteria.findOne(callback);
  };

  Scope.prototype.last = function(callback) {
    var criteria;
    criteria = this.compile();
    criteria.reverseSort();
    return criteria.findOne(callback);
  };

  Scope.prototype.all = function(callback) {
    return this.compile().find(callback);
  };

  Scope.prototype.pluck = function() {
    var attributes;
    attributes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this.compile().find(callback);
  };

  Scope.prototype.explain = function() {
    return this.compile().explain(callback);
  };

  Scope.prototype.count = function(callback) {
    return this.compile().count(callback);
  };

  Scope.prototype.exists = function(callback) {
    return this.compile().exists(callback);
  };

  Scope.prototype.batch = function() {
    return this;
  };

  Scope.prototype.fetch = function() {};

  Scope.prototype.options = function(options) {
    return _.extend(this.criteria.options, options);
  };

  Scope.prototype.compile = function() {
    return this.criteria.clone();
  };

  Scope.prototype.clone = function() {
    return new this.constructor(this.criteria.clone());
  };

  return Scope;

})(Tower.Class);

_ref = Tower.Model.Scope.queryMethods;
_fn = function(key) {
  return Tower.Model.Scope.prototype[key] = function() {
    var clone, _ref2;
    clone = this.clone();
    (_ref2 = clone.criteria)[key].apply(_ref2, arguments);
    return clone;
  };
};
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  key = _ref[_i];
  _fn(key);
}

module.exports = Tower.Model.Scope;
