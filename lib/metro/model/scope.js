var Scope;
Scope = (function() {
  function Scope(sourceClassName) {
    this.sourceClassName = sourceClassName;
    this.conditions = [];
  }
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
  Scope.prototype.within = function() {
    this.conditions.push(["within", arguments]);
    return this;
  };
  Scope.prototype.all = function(callback) {
    return this.store().all(this.query(), callback);
  };
  Scope.prototype.first = function(callback) {
    return this.store().first(this.query(), callback);
  };
  Scope.prototype.last = function(callback) {
    return this.store().last(this.query(), callback);
  };
  Scope.prototype.sourceClass = function() {
    return global[this.sourceClassName];
  };
  Scope.prototype.store = function() {
    return global[this.sourceClassName].store();
  };
  Scope.prototype.query = function() {
    var condition, conditions, item, key, result, value, _i, _len;
    conditions = this.conditions;
    result = {};
    for (_i = 0, _len = conditions.length; _i < _len; _i++) {
      condition = conditions[_i];
      switch (condition[0]) {
        case "where":
          item = condition[1][0];
          for (key in item) {
            value = item[key];
            result[key] = value;
          }
          break;
        case "order":
          result._sort = condition[1][0];
      }
    }
    return result;
  };
  return Scope;
})();
module.exports = Scope;