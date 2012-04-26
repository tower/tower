(function() {
  var key, _fn, _fn2, _fn3, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3;

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
        if (options == null) options = {};
        options.model = this;
        criteria = new Tower.Model.Criteria(options);
        if (this.baseClass().name !== this.name) {
          criteria.where({
            type: this.name
          });
        }
        return criteria;
      }
    }
  };

  _ref = Tower.Model.Scope.queryMethods;
  _fn = function(key) {
    return Tower.Model.Scopes.ClassMethods[key] = function() {
      var _ref2;
      return (_ref2 = this.scoped())[key].apply(_ref2, arguments);
    };
  };
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    key = _ref[_i];
    _fn(key);
  }

  _ref2 = Tower.Model.Scope.finderMethods;
  _fn2 = function(key) {
    return Tower.Model.Scopes.ClassMethods[key] = function() {
      var _ref3;
      return (_ref3 = this.scoped())[key].apply(_ref3, arguments);
    };
  };
  for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
    key = _ref2[_j];
    _fn2(key);
  }

  _ref3 = Tower.Model.Scope.persistenceMethods;
  _fn3 = function(key) {
    return Tower.Model.Scopes.ClassMethods[key] = function() {
      var _ref4;
      return (_ref4 = this.scoped())[key].apply(_ref4, arguments);
    };
  };
  for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
    key = _ref3[_k];
    _fn3(key);
  }

  module.exports = Tower.Model.Scopes;

}).call(this);
