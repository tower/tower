(function() {
  var key, _i, _j, _len, _len2, _ref, _ref2;

  Metro.Model.Scopes = {
    ClassMethods: {
      scope: function(name, scope) {
        return this[name] = scope instanceof Metro.Model.Scope ? scope : this.where(scope);
      },
      scoped: function() {
        return new Metro.Model.Scope(Metro.namespaced(this.name));
      }
    }
  };

  _ref = Metro.Model.Scope.scopes;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    key = _ref[_i];
    Metro.Model.Scopes.ClassMethods[key](function() {
      var _ref2;
      (_ref2 = this.scoped())[key].apply(_ref2, arguments);
      return this;
    });
  }

  _ref2 = Metro.Model.Scope.finders;
  for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
    key = _ref2[_j];
    Metro.Model.Scopes.ClassMethods[key](function() {
      var _ref3;
      return (_ref3 = this.scoped())[key].apply(_ref3, arguments);
    });
  }

  module.exports = Metro.Model.Scopes;

}).call(this);
