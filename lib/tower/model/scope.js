var key, _fn, _i, _len, _ref,
  __defineStaticProperty = function(clazz, key, value) {
  if(typeof clazz.__defineStaticProperty == 'function') return clazz.__defineStaticProperty(key, value);
  return clazz[key] = value;
},
  __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __slice = [].slice,
  _this = this;

Tower.Model.Scope = (function() {

  __defineStaticProperty(Scope,  "finderMethods", ['find', 'all', 'first', 'last', 'count', 'exists', 'instantiate', 'pluck']);

  __defineStaticProperty(Scope,  "persistenceMethods", ['insert', 'update', 'destroy', 'build']);

  __defineStaticProperty(Scope,  "queryMethods", ['where', 'order', 'sort', 'asc', 'desc', 'gte', 'gt', 'lte', 'lt', 'limit', 'offset', 'select', 'joins', 'includes', 'excludes', 'paginate', 'page', 'allIn', 'allOf', 'alsoIn', 'anyIn', 'anyOf', 'notIn', 'near', 'within']);

  __defineStaticProperty(Scope,  "queryOperators", {
    '>=': '$gte',
    '$gte': '$gte',
    '>': '$gt',
    '$gt': '$gt',
    '<=': '$lte',
    '$lte': '$lte',
    '<': '$lt',
    '$lt': '$lt',
    '$in': '$in',
    '$nin': '$nin',
    '$any': '$any',
    '$all': '$all',
    '=~': '$regex',
    '$m': '$regex',
    '$regex': '$regex',
    '$match': '$match',
    '$notMatch': '$notMatch',
    '!~': '$nm',
    '$nm': '$nm',
    '=': '$eq',
    '$eq': '$eq',
    '!=': '$neq',
    '$neq': '$neq',
    '$null': '$null',
    '$notNull': '$notNull'
  });

  function Scope(cursor) {
    this.cursor = cursor;
  }

  __defineProperty(Scope,  "has", function(object) {
    return this.cursor.has(object);
  });

  __defineProperty(Scope,  "build", function() {
    var args, callback, cursor;
    cursor = this.compile();
    args = _.args(arguments);
    callback = _.extractBlock(args);
    cursor.addData(args);
    return cursor.build(callback);
  });

  __defineProperty(Scope,  "insert", function() {
    var args, callback, cursor;
    cursor = this.compile();
    args = _.args(arguments);
    callback = _.extractBlock(args);
    cursor.addData(args);
    return cursor.insert(callback);
  });

  __defineProperty(Scope,  "update", function() {
    var args, callback, cursor, updates;
    cursor = this.compile();
    args = _.flatten(_.args(arguments));
    callback = _.extractBlock(args);
    updates = args.pop();
    if (!(updates && typeof updates === 'object')) {
      throw new Error('Must pass in updates hash');
    }
    cursor.addData(updates);
    cursor.addIds(args);
    return cursor.update(callback);
  });

  __defineProperty(Scope,  "destroy", function() {
    var args, callback, cursor;
    cursor = this.compile();
    args = _.flatten(_.args(arguments));
    callback = _.extractBlock(args);
    cursor.addIds(args);
    return cursor.destroy(callback);
  });

  __defineProperty(Scope,  "add", function() {
    var args, callback, cursor;
    cursor = this.compile();
    args = _.args(arguments);
    callback = _.extractBlock(args);
    cursor.addData(args);
    return cursor.add(callback);
  });

  __defineProperty(Scope,  "remove", function() {
    var args, callback, cursor;
    cursor = this.compile();
    args = _.flatten(_.args(arguments));
    callback = _.extractBlock(args);
    cursor.addIds(args);
    return cursor.remove(callback);
  });

  __defineProperty(Scope,  "find", function() {
    var args, callback, cursor;
    cursor = this.compile();
    args = _.flatten(_.args(arguments));
    callback = _.extractBlock(args);
    cursor.addIds(args);
    return cursor.find(callback);
  });

  __defineProperty(Scope,  "first", function(callback) {
    var cursor;
    cursor = this.compile();
    return cursor.findOne(callback);
  });

  __defineProperty(Scope,  "last", function(callback) {
    var cursor;
    cursor = this.compile();
    cursor.reverseSort();
    return cursor.findOne(callback);
  });

  __defineProperty(Scope,  "all", function(callback) {
    return this.compile().find(callback);
  });

  __defineProperty(Scope,  "pluck", function() {
    var attributes;
    attributes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this.compile().find(callback);
  });

  __defineProperty(Scope,  "explain", function() {
    return this.compile().explain(callback);
  });

  __defineProperty(Scope,  "count", function(callback) {
    return this.compile().count(callback);
  });

  __defineProperty(Scope,  "exists", function(callback) {
    return this.compile().exists(callback);
  });

  __defineProperty(Scope,  "batch", function() {
    return this;
  });

  __defineProperty(Scope,  "fetch", function() {});

  __defineProperty(Scope,  "options", function(options) {
    return _.extend(this.cursor.options, options);
  });

  __defineProperty(Scope,  "compile", function() {
    return this.cursor.clone();
  });

  __defineProperty(Scope,  "clone", function() {
    return new this.constructor(this.cursor.clone());
  });

  return Scope;

})();

_ref = Tower.Model.Scope.queryMethods;
_fn = function(key) {
  return Tower.Model.Scope.prototype[key] = function() {
    var clone, _ref1;
    clone = this.clone();
    (_ref1 = clone.cursor)[key].apply(_ref1, arguments);
    return clone;
  };
};
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  key = _ref[_i];
  _fn(key);
}

module.exports = Tower.Model.Scope;
