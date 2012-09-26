var Future, _;

Future = null;

_ = Tower._;

Tower.ModelCursorSync = {
  included: function() {
    return Future || (Future = (function() {
      try {
        return require('fibers/future');
      } catch (_error) {}
    })());
  },
  find: function() {
    return this._returnInFuture(this._find);
  },
  count: function() {
    return this._returnInFuture(this._count);
  },
  exists: function() {
    return this._returnInFuture(this._exists);
  },
  insert: function(callback) {
    return this._returnInFuture(this._insert, callback);
  },
  update: function(callback) {
    return this._returnInFuture(this._update, callback);
  },
  destroy: function(callback) {
    return this._returnInFuture(this._destroy, callback);
  },
  _returnInFuture: function(method, callback) {
    var error, future, result, _ref,
      _this = this;
    future = new Future;
    method.call(this, function(error, result) {
      return future["return"]([error, result]);
    });
    _ref = future.wait(), error = _ref[0], result = _ref[1];
    if (callback) {
      callback.call(this, error, result);
      return result;
    } else {
      if (error) {
        throw error;
      }
      return result;
    }
  }
};
