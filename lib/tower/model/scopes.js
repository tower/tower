(function() {
  var key, _fn, _fn2, _i, _j, _len, _len2, _ref, _ref2;

  Tower.Model.Scopes = {
    ClassMethods: {
      scope: function(name, scope) {
        return this[name] = scope instanceof Tower.Model.Scope ? scope : this.where(scope);
      },
      scoped: function() {
        var scope;
        scope = new Tower.Model.Scope({
          model: this
        });
        if (this.baseClass().name !== this.name) {
          scope.where({
            type: this.name
          });
        }
        return scope;
      }
    }
  };

  _ref = Tower.Model.Scope.scopes;
  _fn = function(_key) {
    return Tower.Model.Scopes.ClassMethods[_key] = function() {
      var _ref2;
      return (_ref2 = this.scoped())[_key].apply(_ref2, arguments);
    };
  };
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    key = _ref[_i];
    _fn(key);
  }

  _ref2 = Tower.Model.Scope.finders;
  _fn2 = function(_key) {
    return Tower.Model.Scopes.ClassMethods[_key] = function() {
      var _ref3;
      return (_ref3 = this.scoped())[_key].apply(_ref3, arguments);
    };
  };
  for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
    key = _ref2[_j];
    _fn2(key);
  }

  module.exports = Tower.Model.Scopes;

}).call(this);
