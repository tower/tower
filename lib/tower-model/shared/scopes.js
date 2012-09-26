var key, _, _fn, _fn1, _fn2, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;

_ = Tower._;

Tower.ModelScopes = {
  ClassMethods: {
    scope: function(name, scope) {
      scope = scope instanceof Tower.ModelScope ? scope : this.where(scope);
      return this[name] = function() {
        return this.scoped().where(scope.cursor);
      };
    },
    scoped: function(options) {
      var cursor, defaultScope;
      if (options == null) {
        options = {};
      }
      cursor = this.cursor(options);
      if (!options.noDefault) {
        defaultScope = this.defaults().scope;
      }
      if (defaultScope) {
        return defaultScope.where(cursor);
      } else {
        return new Tower.ModelScope(cursor);
      }
    },
    cursor: function(options) {
      var cursor;
      if (options == null) {
        options = {};
      }
      options.model = this;
      cursor = Tower.ModelCursor.make();
      cursor.make(options);
      if (this.baseClass().className() !== this.className()) {
        cursor.where({
          type: this.className()
        });
      }
      return cursor;
    },
    unscoped: function() {
      return this.scoped({
        noDefault: true
      });
    },
    toCursor: function() {
      return this.cursor.apply(this, arguments);
    }
  }
};

_ref = Tower.ModelScope.queryMethods;
_fn = function(key) {
  return Tower.ModelScopes.ClassMethods[key] = function() {
    var _ref1;
    return (_ref1 = this.scoped())[key].apply(_ref1, arguments);
  };
};
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  key = _ref[_i];
  _fn(key);
}

_ref1 = Tower.ModelScope.finderMethods;
_fn1 = function(key) {
  return Tower.ModelScopes.ClassMethods[key] = function() {
    var _ref2;
    return (_ref2 = this.scoped())[key].apply(_ref2, arguments);
  };
};
for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
  key = _ref1[_j];
  _fn1(key);
}

_ref2 = Tower.ModelScope.persistenceMethods;
_fn2 = function(key) {
  return Tower.ModelScopes.ClassMethods[key] = function() {
    var _ref3;
    return (_ref3 = this.scoped())[key].apply(_ref3, arguments);
  };
};
for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
  key = _ref2[_k];
  _fn2(key);
}

module.exports = Tower.ModelScopes;
