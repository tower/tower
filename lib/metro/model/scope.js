(function() {
  var Scope;
  Scope = (function() {
    function Scope(sourceClassName, store) {
      this.sourceClassName = sourceClassName;
      this.store = store;
      this.conditions = [];
    }
    Scope.prototype.anyIn = function() {
      this.conditions.push(["anyIn", arguments]);
      return this;
    };
    Scope.prototype.allIn = function() {
      this.conditions.push(["allIn", arguments]);
      return this;
    };
    Scope.prototype.where = function() {
      this.conditions.push(["where", arguments]);
      return this;
    };
    Scope.prototype.order = function() {
      this.conditions.push(["order", arguments]);
      return this;
    };
    Scope.prototype.limit = function() {
      this.conditions.push(["limit", arguments]);
      return this;
    };
    Scope.prototype.select = function() {
      this.conditions.push(["select", arguments]);
      return this;
    };
    Scope.prototype.joins = function() {
      this.conditions.push(["joins", arguments]);
      return this;
    };
    Scope.prototype.includes = function() {
      this.conditions.push(["includes", arguments]);
      return this;
    };
    Scope.prototype.all = function(callback) {
      return this.store.all(this.conditions, callback);
    };
    Scope.prototype.first = function(callback) {
      return this.store.first(this.conditions, callback);
    };
    Scope.prototype.last = function(callback) {
      return this.store.last(this.conditions, callback);
    };
    Scope.prototype.sourceClass = function() {
      return global[this.sourceClassName];
    };
    return Scope;
  })();
  module.exports = Scope;
}).call(this);
