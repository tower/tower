(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; }, __slice = Array.prototype.slice;

  Tower.Model.Scope = (function() {
    var key, _fn, _i, _len, _ref;

    __extends(Scope, Tower.Class);

    Scope.scopes = ["where", "order", "asc", "desc", "limit", "offset", "select", "joins", "includes", "excludes", "paginate", "within"];

    Scope.finders = ["find", "all", "first", "last", "count"];

    Scope.builders = ["build", "create", "update", "updateAll", "delete", "deleteAll", "destroy", "destroyAll"];

    function Scope(options) {
      if (options == null) options = {};
      this.model = options.model;
      this.criteria = options.criteria || new Tower.Model.Criteria;
    }

    _ref = Scope.scopes;
    _fn = function(_key) {
      return this.prototype[_key] = function() {
        var _ref2;
        (_ref2 = this.criteria)[_key].apply(_ref2, arguments);
        return this;
      };
    };
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      _fn.call(Scope, key);
    }

    Scope.prototype.find = function() {
      var callback, ids, _j, _ref2;
      ids = 2 <= arguments.length ? __slice.call(arguments, 0, _j = arguments.length - 1) : (_j = 0, []), callback = arguments[_j++];
      return (_ref2 = this.store()).find.apply(_ref2, __slice.call(ids).concat([this.criteria.query], [this.criteria.options], [callback]));
    };

    Scope.prototype.all = function(callback) {
      console.log(this.criteria.query);
      return this.store().all(this.criteria.query, this.criteria.options, callback);
    };

    Scope.prototype.first = function(callback) {
      return this.store().first(this.criteria.query, this.criteria.options, callback);
    };

    Scope.prototype.last = function(callback) {
      return this.store().last(this.criteria.query, this.criteria.options, callback);
    };

    Scope.prototype.count = function(callback) {
      return this.store().count(this.criteria.query, this.criteria.options, callback);
    };

    Scope.prototype.build = function(attributes, callback) {
      return this.store().build(Tower.Support.Object.extend(this.criteria.query, attributes), this.criteria.options, callback);
    };

    Scope.prototype.create = function(attributes, callback) {
      return this.store().create(Tower.Support.Object.extend(this.criteria.query, attributes), this.criteria.options, callback);
    };

    Scope.prototype.update = function() {
      var callback, ids, updates, _j, _ref2;
      ids = 3 <= arguments.length ? __slice.call(arguments, 0, _j = arguments.length - 2) : (_j = 0, []), updates = arguments[_j++], callback = arguments[_j++];
      return (_ref2 = this.store()).update.apply(_ref2, __slice.call(ids).concat([updates], [this.criteria.query], [this.criteria.options], [callback]));
    };

    Scope.prototype.updateAll = function(updates, callback) {
      return this.store().updateAll(updates, this.criteria.query, this.criteria.options, callback);
    };

    Scope.prototype["delete"] = function() {
      var callback, ids, _j, _ref2;
      ids = 2 <= arguments.length ? __slice.call(arguments, 0, _j = arguments.length - 1) : (_j = 0, []), callback = arguments[_j++];
      return (_ref2 = this.store())["delete"].apply(_ref2, __slice.call(ids).concat([this.criteria.query], [this.criteria.options], [callback]));
    };

    Scope.prototype.deleteAll = function(callback) {
      return this.store().deleteAll(this.criteria.query, this.criteria.options, callback);
    };

    Scope.prototype.destroy = function() {
      var callback, ids, _j, _ref2;
      ids = 2 <= arguments.length ? __slice.call(arguments, 0, _j = arguments.length - 1) : (_j = 0, []), callback = arguments[_j++];
      return (_ref2 = this.store())["delete"].apply(_ref2, __slice.call(ids).concat([this.criteria.query], [this.criteria.options], [callback]));
    };

    Scope.prototype.destroyAll = function(callback) {
      return this.store().deleteAll(this.criteria.query, this.criteria.options, callback);
    };

    Scope.prototype.store = function() {
      return this.model.store();
    };

    Scope.prototype.merge = function(scope) {
      return this.criteria.merge(scope.criteria);
    };

    Scope.prototype.clone = function() {
      return new this({
        model: this.model,
        criteria: this.criteria.clone()
      });
    };

    return Scope;

  })();

  module.exports = Tower.Model.Scope;

}).call(this);
