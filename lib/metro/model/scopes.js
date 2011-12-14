
  Metro.Model.Scopes = {
    ClassMethods: {
      scope: function(name, scope) {
        return this[name] = scope instanceof Metro.Model.Scope ? scope : this.where(scope);
      },
      scoped: function() {
        return new Metro.Model.Scope({
          model: this
        });
      }
    }
  };

  (function() {
    var key, _i, _len, _ref, _results;
    _ref = Metro.Model.Scope.scopes;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      _results.push(Metro.Model.Scopes.ClassMethods[key] = function() {
        var _ref2;
        return (_ref2 = this.scoped())[key].apply(_ref2, arguments);
      });
    }
    return _results;
  })();

  (function() {
    var key, _i, _len, _ref, _results;
    _ref = Metro.Model.Scope.finders;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      _results.push(Metro.Model.Scopes.ClassMethods[key] = function() {
        var _ref2;
        return (_ref2 = this.scoped())[key].apply(_ref2, arguments);
      });
    }
    return _results;
  })();

  module.exports = Metro.Model.Scopes;
