(function() {
  var Scopes;
  Scopes = (function() {
    function Scopes() {}
    Scopes.scope = function(name, scope) {
      return this[name] = scope instanceof Metro.Model.Scope ? scope : this.where(scope);
    };
    Scopes.where = function() {
      var _ref;
      return (_ref = this.scoped()).where.apply(_ref, arguments);
    };
    Scopes.order = function() {
      var _ref;
      return (_ref = this.scoped()).order.apply(_ref, arguments);
    };
    Scopes.limit = function() {
      var _ref;
      return (_ref = this.scoped()).limit.apply(_ref, arguments);
    };
    Scopes.select = function() {
      var _ref;
      return (_ref = this.scoped()).select.apply(_ref, arguments);
    };
    Scopes.joins = function() {
      var _ref;
      return (_ref = this.scoped()).joins.apply(_ref, arguments);
    };
    Scopes.includes = function() {
      var _ref;
      return (_ref = this.scoped()).includes.apply(_ref, arguments);
    };
    Scopes.within = function() {
      var _ref;
      return (_ref = this.scoped()).within.apply(_ref, arguments);
    };
    Scopes.scoped = function() {
      return new Metro.Model.Scope(this.name);
    };
    Scopes.all = function(callback) {
      return this.store().all(callback);
    };
    Scopes.first = function(callback) {
      return this.store().first(callback);
    };
    Scopes.last = function(callback) {
      return this.store().last(callback);
    };
    Scopes.find = function(id, callback) {
      return this.store().find(id, callback);
    };
    Scopes.each = function(callback) {
      return this.store().each(callback);
    };
    Scopes.count = function(callback) {
      return this.store().count(callback);
    };
    return Scopes;
  })();
  module.exports = Scopes;
}).call(this);
