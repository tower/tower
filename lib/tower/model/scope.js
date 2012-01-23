var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Model.Scope = (function() {
  var key, _fn, _i, _len, _ref;
  var _this = this;

  __extends(Scope, Tower.Class);

  Scope.scopes = ["where", "order", "asc", "desc", "limit", "offset", "select", "joins", "includes", "excludes", "paginate", "within", "allIn", "allOf", "alsoIn", "anyIn", "anyOf", "near", "notIn"];

  Scope.finders = ["find", "all", "first", "last", "count"];

  Scope.builders = ["create", "update", "delete", "destroy"];

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
    var callback, criteria, options, query, _ref2;
    _ref2 = this._extractArgs(arguments, {
      ids: true
    }), criteria = _ref2.criteria, callback = _ref2.callback;
    query = criteria.query, options = criteria.options;
    if (query.id && query.id.hasOwnProperty("$in") && query.id.$in.length === 1) {
      return this.store.findOne(query, options, callback);
    } else {
      return this.store.find(query, options, callback);
    }
  };

  Scope.prototype.first = function(callback) {
    var criteria;
    criteria = this.toCriteria("asc");
    return this.store.findOne(criteria.query, criteria.options, callback);
  };

  Scope.prototype.last = function(callback) {
    var criteria;
    criteria = this.toCriteria("desc");
    return this.store.findOne(criteria.query, criteria.options, callback);
  };

  Scope.prototype.all = function(callback) {
    var criteria;
    criteria = this.toCriteria();
    return this.store.find(criteria.query, criteria.options, callback);
  };

  Scope.prototype.count = function(callback) {
    var criteria;
    criteria = this.criteria;
    return this.store.count(criteria.query, criteria.options, callback);
  };

  Scope.prototype.batch = function() {};

  Scope.prototype.build = function() {};

  Scope.prototype.create = function() {
    var attributes, callback, criteria, isArray, options, updates, _ref2;
    var _this = this;
    _ref2 = this._extractArgs(arguments, {
      updates: true,
      options: true,
      ids: false
    }), criteria = _ref2.criteria, updates = _ref2.updates, options = _ref2.options, callback = _ref2.callback;
    attributes = Tower.Support.Object.extend({}, criteria.query, updates);
    if (options.instantiate) {
      isArray = Tower.Support.Object.isArray(attributes);
      return this.store.build(attributes, options, function(error, records) {
        var iterator;
        if (error) return callback(error);
        records = Tower.Support.Object.toArray(records);
        iterator = function(record, next) {
          return record.save(next);
        };
        return Tower.async(records, iterator, function(error) {
          if (!callback) {
            if (error) throw error;
          } else {
            if (error) return callback(error);
            if (isArray) {
              return callback(error, records);
            } else {
              return callback(error, records[0]);
            }
          }
        });
      });
    } else {
      return this.store.create(attributes, options, callback);
    }
  };

  Scope.prototype.update = function() {
    var callback, criteria, iterator, options, updates, _ref2;
    _ref2 = this._extractArgs(arguments, {
      ids: true,
      updates: true,
      options: true
    }), criteria = _ref2.criteria, updates = _ref2.updates, options = _ref2.options, callback = _ref2.callback;
    if (options.instantiate) {
      iterator = function(record, next) {
        return record.updateAttributes(updates, next);
      };
      return this._each(criteria.query, criteria.options, iterator, callback);
    } else {
      return this.store.update(updates, criteria.query, criteria.options, callback);
    }
  };

  Scope.prototype.destroy = function() {
    var callback, criteria, iterator, options, _ref2;
    _ref2 = this._extractArgs(arguments, {
      ids: true,
      options: true
    }), criteria = _ref2.criteria, options = _ref2.options, callback = _ref2.callback;
    if (options.instantiate) {
      iterator = function(record, next) {
        return record.destroy(next);
      };
      return this._each(criteria.query, criteria.options, iterator, callback);
    } else {
      return this.store.destroy(criteria.query, criteria.options, callback);
    }
  };

  Scope.prototype["delete"] = function() {
    return this.destroy.apply(this, arguments);
  };

  Scope.prototype.toCriteria = function(sortDirection) {
    var criteria, sort;
    criteria = this.criteria;
    if (sortDirection || !criteria.options.hasOwnProperty("sort")) {
      criteria = criteria.clone();
      sort = this.model.defaultSort();
      if (sort) criteria[sortDirection || sort.direction](sort.name);
    }
    return criteria;
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

  Scope.prototype._each = function(query, options, iterator, callback) {
    var _this = this;
    return this.store.find(query, options, function(error, records) {
      if (error) {
        return callback.call(_this, error, records);
      } else {
        return Tower.async(records, iterator, function(error) {
          if (!callback) {
            if (error) throw error;
          } else {
            if (callback) return callback.call(_this, error, records);
          }
        });
      }
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
    if (!opts.updates) updates = {};
    updates || (updates = {});
    criteria = this.criteria.clone();
    options || (options = {});
    if (!options.hasOwnProperty("instantiate")) options.instantiate = true;
    if (opts.ids && args.length > 0) ids = _.flatten(args);
    if (ids && ids.length > 0) {
      delete criteria.query.id;
      criteria.where({
        id: {
          $in: ids
        }
      });
    }
    return {
      criteria: criteria,
      updates: updates,
      callback: callback,
      options: options
    };
  };

  return Scope;

}).call(this);

module.exports = Tower.Model.Scope;
