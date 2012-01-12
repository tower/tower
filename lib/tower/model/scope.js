var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Model.Scope = (function() {
  var key, _fn, _i, _len, _ref;
  var _this = this;

  __extends(Scope, Tower.Class);

  Scope.scopes = ["where", "order", "asc", "desc", "limit", "offset", "select", "joins", "includes", "excludes", "paginate", "within", "allIn", "allOf", "alsoIn", "anyIn", "anyOf", "near", "notIn"];

  Scope.finders = ["find", "all", "first", "last", "count"];

  Scope.builders = ["build", "create", "update", "delete", "destroy"];

  function Scope(options) {
    if (options == null) options = {};
    this.model = options.model;
    this.criteria = options.criteria || new Tower.Model.Criteria;
    this.store = this.model.store();
  }

  _ref = Scope.scopes;
  _fn = function(key) {
    return Scope.prototype[key] = function() {
      var clone, _ref2;
      clone = this.clone();
      (_ref2 = clone.criteria)[key].apply(_ref2, arguments);
      return clone;
    };
  };
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    key = _ref[_i];
    _fn(key);
  }

  Scope.prototype.find = function() {
    var callback, criteria, _ref2;
    _ref2 = this._extractArgs(arguments, {
      ids: true
    }), criteria = _ref2.criteria, callback = _ref2.callback;
    return this.store.find(criteria.query, criteria.options, callback);
  };

  Scope.prototype.all = function(callback) {
    return this.store.find(this.criteria.query, this.criteria.options, callback);
  };

  Scope.prototype.first = function(callback) {
    return this.store.findOne(this.criteria.query, this.criteria.options, callback);
  };

  Scope.prototype.last = function(callback) {
    return this.store.findOne(this.criteria.query, this.criteria.options, callback);
  };

  Scope.prototype.count = function(callback) {
    return this.store.count(this.criteria.query, this.criteria.options, callback);
  };

  Scope.prototype.build = function(attributes, callback) {
    return this.store.build(Tower.Support.Object.extend(this.criteria.query, attributes), this.criteria.options, callback);
  };

  Scope.prototype.create = function(attributes, callback) {
    return this.store.create(Tower.Support.Object.extend({}, this.criteria.query, attributes), this.criteria.options, callback);
  };

  Scope.prototype.update = function() {
    var callback, criteria, options, updates, _ref2;
    var _this = this;
    _ref2 = this._extractArgs(arguments, {
      ids: true,
      updates: true,
      options: true
    }), criteria = _ref2.criteria, updates = _ref2.updates, options = _ref2.options, callback = _ref2.callback;
    if (options.instantiate || options.validate) {
      return this.store.all(criteria.query, criteria.options, function(error, records) {
        var iterator;
        if (error) {
          return callback.call(_this, error, records);
        } else {
          iterator = function(record, next) {
            return record.updateAttributes(updates, next);
          };
          return Tower.async.forEachSeries(records, iterator, callback);
        }
      });
    } else {
      return this.store.update(updates, criteria.query, criteria.options, callback);
    }
  };

  Scope.prototype["delete"] = function() {
    var callback, criteria, options, _ref2;
    var _this = this;
    _ref2 = this._extractArgs(arguments, {
      ids: true,
      options: true
    }), criteria = _ref2.criteria, options = _ref2.options, callback = _ref2.callback;
    if (options.instantiate || options.validate) {
      return this.store.all(criteria.query, criteria.options, function(error, records) {
        var iterator;
        if (error) {
          return callback.call(_this, error, records);
        } else {
          iterator = function(record, next) {
            return record.destroy(next);
          };
          return Tower.async.forEachSeries(records, iterator, callback);
        }
      });
    } else {
      return this.store["delete"](criteria.query, criteria.options, callback);
    }
  };

  Scope.prototype.destroy = function() {
    return this["delete"].apply(this, arguments);
  };

  Scope.prototype.merge = function(scope) {
    return this.criteria.merge(scope.criteria);
  };

  Scope.prototype.clone = function() {
    return new this.constructor({
      model: this.model,
      criteria: this.criteria.clone()
    });
  };

  Scope.prototype._extractArgs = function(args, opts) {
    var callback, criteria, ids, options, updates;
    if (opts == null) opts = {};
    args = Tower.Support.Array.args(args);
    if (typeof args[args.length - 1] === "function") {
      callback = args.pop();
    } else {
      callback = void 0;
    }
    if (opts.updates && Tower.Support.Object.isHash(args[args.length - 1])) {
      updates = args.pop();
    }
    if (Tower.Support.Object.isHash(args[args.length - 1])) {
      if (updates) {
        options = updates;
        updates = args.pop();
      } else {
        options = args.pop();
      }
    }
    if (!opts.updates) updates = void 0;
    options || (options = {});
    if (!options.hasOwnProperty("instantiate")) options.instantiate = true;
    if (!(!options.instantiate || options.hasOwnProperty("validate"))) {
      options.validate = true;
    }
    if (opts.ids && args.length > 0) ids = _.flatten(args);
    criteria = this.criteria;
    if (ids && ids.length > 0) {
      criteria = criteria.clone();
      delete criteria.query.id;
      criteria.where({
        id: {
          $in: ids
        }
      });
    }
    return {
      criteria: criteria,
      options: options,
      updates: updates,
      callback: callback
    };
  };

  return Scope;

}).call(this);

module.exports = Tower.Model.Scope;
