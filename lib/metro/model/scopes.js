
  Metro.Model.Scopes = {
    ClassMethods: {
      scope: function(name, scope) {
        return this[name] = scope instanceof Metro.Model.Scope ? scope : this.where(scope);
      },
      where: function() {
        var _ref;
        return (_ref = this.scoped()).where.apply(_ref, arguments);
      },
      order: function() {
        var _ref;
        return (_ref = this.scoped()).order.apply(_ref, arguments);
      },
      limit: function() {
        var _ref;
        return (_ref = this.scoped()).limit.apply(_ref, arguments);
      },
      select: function() {
        var _ref;
        return (_ref = this.scoped()).select.apply(_ref, arguments);
      },
      joins: function() {
        var _ref;
        return (_ref = this.scoped()).joins.apply(_ref, arguments);
      },
      includes: function() {
        var _ref;
        return (_ref = this.scoped()).includes.apply(_ref, arguments);
      },
      within: function() {
        var _ref;
        return (_ref = this.scoped()).within.apply(_ref, arguments);
      },
      scoped: function() {
        return new Metro.Model.Scope(Metro.namespaced(this.name));
      },
      all: function(callback) {
        return this.store().all(callback);
      },
      first: function(callback) {
        return this.store().first(callback);
      },
      last: function(callback) {
        return this.store().last(callback);
      },
      find: function(id, callback) {
        return this.store().find(id, callback);
      },
      count: function(query, callback) {
        return this.store().count(query, callback);
      },
      exists: function(callback) {
        return this.store().exists(callback);
      }
    }
  };

  module.exports = Metro.Model.Scopes;
