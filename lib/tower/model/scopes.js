var key, _fn, _fn1, _fn2, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;

Tower.Model.Scopes = {
  ClassMethods: {
    scope: function(name, scope) {
      scope = scope instanceof Tower.Model.Scope ? scope : this.where(scope);
      return this[name] = function() {
        return this.scoped().where(scope.criteria);
      };
    },
    scoped: function(options) {
      var criteria, defaultScope;
      criteria = this.criteria(options);
      defaultScope = this.defaults().scope;
      if (defaultScope) {
        return defaultScope.where(criteria);
      } else {
        return new Tower.Model.Scope(criteria);
      }
    },
    criteria: function(options) {
      var criteria;
      if (options == null) {
        options = {};
      }
      options.model = this;
      criteria = new Tower.Model.Criteria(options);
      if (this.baseClass().className() !== this.className()) {
        criteria.where({
          type: this.className()
        });
      }
      return criteria;
    }
  }
};

_ref = Tower.Model.Scope.queryMethods;
_fn = function(key) {
  return Tower.Model.Scopes.ClassMethods[key] = function() {
    var _ref1;
    return (_ref1 = this.scoped())[key].apply(_ref1, arguments);
  };
};
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  key = _ref[_i];
  _fn(key);
}

_ref1 = Tower.Model.Scope.finderMethods;
_fn1 = function(key) {
  return Tower.Model.Scopes.ClassMethods[key] = function() {
    var _ref2;
    return (_ref2 = this.scoped())[key].apply(_ref2, arguments);
  };
};
for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
  key = _ref1[_j];
  _fn1(key);
}

_ref2 = Tower.Model.Scope.persistenceMethods;
_fn2 = function(key) {
  return Tower.Model.Scopes.ClassMethods[key] = function() {
    var _ref3;
    return (_ref3 = this.scoped())[key].apply(_ref3, arguments);
  };
};
for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
  key = _ref2[_k];
  _fn2(key);
}

module.exports = Tower.Model.Scopes;
