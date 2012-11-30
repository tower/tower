var Future, _;

Future = null;

_ = Tower._;

Tower.future = void 0;

Tower.ModelCursorSync = {
  included: function() {
    return Future || (Future = (function() {
      try {
        return require('fibers/future');
      } catch (_error) {}
    })());
  },
  find: function(callback) {
    return this._returnInFuture(this._find, callback);
  },
  count: function(callback) {
    return this._returnInFuture(this._count, callback);
  },
  exists: function(callback) {
    return this._returnInFuture(this._exists, callback);
  },
  insert: function(callback) {
    if (this.instantiate) {
      return this._returnInFuture(this._insert, callback);
    } else {
      return this._insert(callback);
    }
  },
  update: function(callback) {
    if (this.instantiate) {
      return this._returnInFuture(this._update, callback);
    } else {
      return this._update(callback);
    }
  },
  destroy: function(callback) {
    if (this.instantiate) {
      return this._returnInFuture(this._destroy, callback);
    } else {
      return this._destroy(callback);
    }
  },
  _returnInFuture: function(method, callback) {
    result;

    var error, future, result, _ref,
      _this = this;
    future = Tower.future;
    if (future) {
      method.call(this, callback);
    } else {
      Tower.future = future = new Future;
      method.call(this, function(error, data) {
        return future["return"]([error, data]);
      });
      _ref = future.wait(), error = _ref[0], result = _ref[1];
      Tower.future = void 0;
      if (callback) {
        callback.call(this, error, result);
      } else {
        if (error) {
          throw error;
        }
      }
    }
    return result;
  }
};
