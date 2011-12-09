(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Metro.Model.Scope = (function() {

    __extends(Scope, Metro.Object);

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

    Scope.prototype.paginate = function() {
      this.conditions.push(["paginate", arguments]);
      return this;
    };

    Scope.prototype.within = function() {
      this.conditions.push(["within", arguments]);
      return this;
    };

    Scope.prototype.all = function(query, callback) {
      return this.store().all(Metro.Support.Object.extend(this.query(), query), callback);
    };

    Scope.prototype.first = function(query, callback) {
      return this.store().first(this.query(), callback);
    };

    Scope.prototype.last = function(query, callback) {
      return this.store().last(query, this.query(), callback);
    };

    Scope.prototype.store = function() {
      return Metro.constant(this.sourceClassName).store();
    };

    Scope.prototype.deleteAll = function() {};

    Scope.prototype.destroyAll = function() {};

    Scope.prototype.updateAll = function() {};

    Scope.prototype.find = function() {};

    Scope.prototype.build = function(attributes, callback) {
      return this.store().build(Metro.Support.Object.extend(this.query(), attributes), callback);
    };

    Scope.prototype.create = function(attributes, callback) {
      return this.store().create(Metro.Support.Object.extend(this.query(), attributes), callback);
    };

    Scope.prototype.updateAttribute = function(key, value, callback) {
      var attributes;
      attributes = {};
      return this.store().update(this.query(), attributes, callback);
    };

    Scope.prototype.updateAttributes = function(attributes, callback) {};

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

  module.exports = Metro.Model.Scope;

}).call(this);
