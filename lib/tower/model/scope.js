var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Model.Scope = (function() {
  var key, _fn, _i, _len, _ref;
  var _this = this;

  __extends(Scope, Tower.Class);

  Scope.scopes = ["where", "order", "asc", "desc", "limit", "offset", "select", "joins", "includes", "excludes", "paginate", "within", "allIn", "allOf", "alsoIn", "anyIn", "anyOf", "near", "notIn"];

  Scope.finders = ["find", "all", "first", "last", "count", "exists"];

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
    var callback, conditions, criteria, options, _ref2, _ref3;
    _ref2 = this._extractArgs(arguments, {
      ids: true
    }), criteria = _ref2.criteria, options = _ref2.options, callback = _ref2.callback;
    _ref3 = criteria.toQuery(), conditions = _ref3.conditions, options = _ref3.options;
    return this._find(conditions, options, callback);
  };

  Scope.prototype.first = function(callback) {
    var conditions, options, _ref2;
    _ref2 = this.toQuery("asc"), conditions = _ref2.conditions, options = _ref2.options;
    return this.store.findOne(conditions, options, callback);
  };

  Scope.prototype.last = function(callback) {
    var conditions, options, _ref2;
    _ref2 = this.toQuery("desc"), conditions = _ref2.conditions, options = _ref2.options;
    return this.store.findOne(conditions, options, callback);
  };

  Scope.prototype.all = function(callback) {
    var conditions, options, _ref2;
    _ref2 = this.toQuery(), conditions = _ref2.conditions, options = _ref2.options;
    return this.store.find(conditions, options, callback);
  };

  Scope.prototype.count = function(callback) {
    var conditions, options, _ref2;
    _ref2 = this.toQuery(), conditions = _ref2.conditions, options = _ref2.options;
    return this.store.count(conditions, options, callback);
  };

  Scope.prototype.exists = function(callback) {
    var conditions, options, _ref2;
    _ref2 = this.toQuery(), conditions = _ref2.conditions, options = _ref2.options;
    return this.store.exists(conditions, options, callback);
  };

  Scope.prototype.batch = function() {};

  Scope.prototype.fetch = function() {};

  Scope.prototype.sync = function() {};

  Scope.prototype.transaction = function() {};

  Scope.prototype.build = function(attributes, options) {
    var conditions, _ref2;
    _ref2 = this.toCreate(), conditions = _ref2.conditions, options = _ref2.options;
    return this._build(attributes, conditions, options);
  };

  Scope.prototype.create = function() {
    var callback, criteria, data, options, _ref2;
    _ref2 = this._extractArgs(arguments, {
      data: true
    }), criteria = _ref2.criteria, data = _ref2.data, options = _ref2.options, callback = _ref2.callback;
    criteria.mergeOptions(options);
    return this._create(criteria, data, options, callback);
  };

  Scope.prototype.update = function() {
    var callback, criteria, data, options, _ref2;
    _ref2 = this._extractArgs(arguments, {
      ids: true,
      data: true
    }), criteria = _ref2.criteria, data = _ref2.data, options = _ref2.options, callback = _ref2.callback;
    criteria.mergeOptions(options);
    return this._update(criteria, data, options, callback);
  };

  Scope.prototype.destroy = function() {
    var callback, criteria, options, _ref2;
    _ref2 = this._extractArgs(arguments, {
      ids: true
    }), criteria = _ref2.criteria, options = _ref2.options, callback = _ref2.callback;
    criteria.mergeOptions(options);
    return this._destroy(criteria, options, callback);
  };

  Scope.prototype.toQuery = function(sortDirection) {
    return this.toCriteria(sortDirection).toQuery();
  };

  Scope.prototype.toCriteria = function(sortDirection) {
    var criteria, sort;
    criteria = this.criteria.clone();
    if (sortDirection || !criteria._order.length > 0) {
      sort = this.model.defaultSort();
      if (sort) criteria[sortDirection || sort.direction](sort.name);
    }
    return criteria;
  };

  Scope.prototype.toCreate = function() {
    return this.toQuery();
  };

  Scope.prototype.toUpdate = function() {
    return this.toQuery();
  };

  Scope.prototype.toDestroy = function() {};

  Scope.prototype.merge = function(scope) {
    return this.criteria.merge(scope.criteria);
  };

  Scope.prototype.clone = function() {
    return new this.constructor({
      model: this.model,
      criteria: this.criteria.clone()
    });
  };

  Scope.prototype._find = function(conditions, options, callback) {
    if (conditions.id && conditions.id.hasOwnProperty("$in") && conditions.id.$in.length === 1) {
      return this.store.findOne(conditions, options, callback);
    } else {
      return this.store.find(conditions, options, callback);
    }
  };

  Scope.prototype._build = function(attributes, conditions, options) {
    var object, result, _j, _len2;
    if (Tower.Support.Object.isArray(attributes)) {
      result = [];
      for (_j = 0, _len2 = attributes.length; _j < _len2; _j++) {
        object = attributes[_j];
        result.push(this.store.serializeModel(Tower.Support.Object.extend({}, conditions, object)));
      }
      return result;
    } else {
      return this.store.serializeModel(Tower.Support.Object.extend({}, conditions, attributes));
    }
  };

  Scope.prototype._create = function(criteria, data, opts, callback) {
    var isArray, iterator, records;
    var _this = this;
    if (opts.instantiate) {
      isArray = Tower.Support.Object.isArray(data);
      records = Tower.Support.Object.toArray(this.build(data));
      iterator = function(record, next) {
        if (record) {
          return record.save(next);
        } else {
          return next();
        }
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
    } else {
      return this.store.create(data, opts, callback);
    }
  };

  Scope.prototype._update = function(criteria, data, opts, callback) {
    var conditions, iterator, options, _ref2;
    _ref2 = criteria.toQuery(), conditions = _ref2.conditions, options = _ref2.options;
    if (opts.instantiate) {
      iterator = function(record, next) {
        return record.updateAttributes(data, next);
      };
      return this._each(conditions, options, iterator, callback);
    } else {
      return this.store.update(data, conditions, options, callback);
    }
  };

  Scope.prototype._destroy = function(criteria, opts, callback) {
    var conditions, iterator, options, _ref2;
    _ref2 = criteria.toQuery(), conditions = _ref2.conditions, options = _ref2.options;
    if (opts.instantiate) {
      iterator = function(record, next) {
        return record.destroy(next);
      };
      return this._each(conditions, options, iterator, callback);
    } else {
      return this.store.destroy(conditions, options, callback);
    }
  };

  Scope.prototype._each = function(conditions, options, iterator, callback) {
    var _this = this;
    return this.store.find(conditions, options, function(error, records) {
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
    var callback, criteria, data, ids, last, options;
    if (opts == null) opts = {};
    args = Tower.Support.Array.args(args);
    callback = Tower.Support.Array.extractBlock(args);
    last = args[args.length - 1];
    if (opts.data && (Tower.Support.Object.isHash(last) || Tower.Support.Object.isArray(last))) {
      data = args.pop();
    }
    if (Tower.Support.Object.isHash(args[args.length - 1])) {
      if (data) {
        options = data;
        data = args.pop();
      } else {
        options = args.pop();
      }
    }
    if (!opts.data) data = {};
    data || (data = {});
    criteria = this.criteria.clone();
    options || (options = {});
    if (!options.hasOwnProperty("instantiate")) options.instantiate = true;
    if (opts.ids && args.length > 0) ids = _.flatten(args);
    if (ids && ids.length > 0) {
      criteria.where({
        id: {
          $in: _.map(ids, function(idOrRecord) {
            if (idOrRecord instanceof Tower.Model) {
              return idOrRecord.get("id");
            } else {
              return idOrRecord;
            }
          })
        }
      });
    }
    return {
      criteria: criteria,
      data: data,
      callback: callback,
      options: options
    };
  };

  return Scope;

}).call(this);

module.exports = Tower.Model.Scope;
