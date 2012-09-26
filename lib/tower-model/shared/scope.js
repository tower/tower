var key, _, _fn, _i, _len, _ref,
  __defineStaticProperty = function(clazz, key, value) {
  if (typeof clazz.__defineStaticProperty == 'function') return clazz.__defineStaticProperty(key, value);
  return clazz[key] = value;
},
  __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __slice = [].slice,
  _this = this;

_ = Tower._;

Tower.ModelScope = (function() {

  __defineStaticProperty(ModelScope,  "finderMethods", ['find', 'all', 'first', 'last', 'count', 'exists', 'fetch', 'instantiate', 'pluck', 'live', 'toArray']);

  __defineStaticProperty(ModelScope,  "persistenceMethods", ['insert', 'update', 'create', 'destroy', 'build']);

  __defineStaticProperty(ModelScope,  "queryMethods", ['where', 'order', 'sort', 'asc', 'desc', 'gte', 'gt', 'lte', 'lt', 'limit', 'offset', 'select', 'joins', 'includes', 'excludes', 'paginate', 'page', 'allIn', 'allOf', 'alsoIn', 'anyIn', 'anyOf', 'notIn', 'near', 'within']);

  __defineStaticProperty(ModelScope,  "queryOperators", {
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
    '$notNull': '$notNull',
    '$near': '$near'
  });

  function ModelScope(cursor) {
    this.cursor = cursor;
  }

  __defineProperty(ModelScope,  "has", function(object) {
    return this.cursor.has(object);
  });

  __defineProperty(ModelScope,  "live", function() {
    return this;
  });

  __defineProperty(ModelScope,  "build", function() {
    var args, callback, cursor;
    cursor = this.compile();
    args = _.compact(_.args(arguments));
    callback = _.extractBlock(args);
    cursor.addData(args);
    return cursor.build(callback);
  });

  __defineProperty(ModelScope,  "insert", function() {
    var args, callback, cursor;
    cursor = this.compile();
    args = _.compact(_.args(arguments));
    callback = _.extractBlock(args);
    cursor.addData(args);
    return cursor.insert(callback);
  });

  __defineProperty(ModelScope,  "create", ModelScope.prototype.insert);

  __defineProperty(ModelScope,  "update", function() {
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

  __defineProperty(ModelScope,  "destroy", function() {
    var args, callback, cursor;
    cursor = this.compile();
    args = _.flatten(_.args(arguments));
    callback = _.extractBlock(args);
    cursor.addIds(args);
    return cursor.destroy(callback);
  });

  __defineProperty(ModelScope,  "add", function() {
    var args, callback, cursor;
    cursor = this.compile();
    args = _.args(arguments);
    callback = _.extractBlock(args);
    cursor.addData(args);
    return cursor.add(callback);
  });

  __defineProperty(ModelScope,  "remove", function() {
    var args, callback, cursor;
    cursor = this.compile();
    args = _.flatten(_.args(arguments));
    callback = _.extractBlock(args);
    cursor.addIds(args);
    return cursor.remove(callback);
  });

  __defineProperty(ModelScope,  "load", function(records) {
    return this.cursor.load(records);
  });

  __defineProperty(ModelScope,  "reset", function() {
    return this.cursor.reset();
  });

  __defineProperty(ModelScope,  "getEach", function() {
    var _ref;
    return (_ref = this.cursor).getEach.apply(_ref, arguments);
  });

  __defineProperty(ModelScope,  "find", function() {
    var args, callback, cursor;
    cursor = this.compile();
    args = _.flatten(_.args(arguments));
    callback = _.extractBlock(args);
    cursor.addIds(args);
    return cursor.find(callback);
  });

  __defineProperty(ModelScope,  "first", function(callback) {
    var cursor;
    cursor = this.compile();
    return cursor.findOne(callback);
  });

  __defineProperty(ModelScope,  "last", function(callback) {
    var cursor;
    cursor = this.compile();
    cursor.reverseSort();
    return cursor.findOne(callback);
  });

  __defineProperty(ModelScope,  "all", function(callback) {
    return this.compile().all(callback);
  });

  __defineProperty(ModelScope,  "toArray", function() {
    return this.all().toArray();
  });

  __defineProperty(ModelScope,  "pluck", function() {
    var attributes;
    attributes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this.compile().find(callback);
  });

  __defineProperty(ModelScope,  "explain", function() {
    return this.compile().explain(callback);
  });

  __defineProperty(ModelScope,  "count", function(callback) {
    return this.compile().count(callback);
  });

  __defineProperty(ModelScope,  "exists", function(callback) {
    return this.compile().exists(callback);
  });

  __defineProperty(ModelScope,  "fetch", function(callback) {
    return this.compile().fetch(callback);
  });

  __defineProperty(ModelScope,  "batch", function() {
    return this;
  });

  __defineProperty(ModelScope,  "options", function(options) {
    return _.extend(this.cursor.options, options);
  });

  __defineProperty(ModelScope,  "compile", function(cloneContent) {
    if (cloneContent == null) {
      cloneContent = true;
    }
    return this.cursor.clone(cloneContent);
  });

  __defineProperty(ModelScope,  "toCursor", function() {
    return this.compile();
  });

  __defineProperty(ModelScope,  "toJSON", function() {
    return this.cursor.toParams();
  });

  __defineProperty(ModelScope,  "clone", function() {
    return new this.constructor(this.cursor.clone(false));
  });

  return ModelScope;

})();

_ref = Tower.ModelScope.queryMethods;
_fn = function(key) {
  return Tower.ModelScope.prototype[key] = function() {
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

module.exports = Tower.ModelScope;
