var key, _fn, _i, _len, _ref;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; }, _this = this;

Tower.Model.Scope = (function() {

  __extends(Scope, Tower.Class);

  function Scope(options) {
    if (options == null) options = {};
    this.model = options.model;
    this.criteria = options.criteria || new Tower.Model.Criteria;
    this.store = this.model.store();
  }

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
        if (Tower.Support.Object.isBaseObject(args[args.length - 1])) {
          options = args.pop();
        }
      }
    }
    if (!opts.data) data = {};
    data || (data = {});
    criteria = this.criteria.clone();
    options || (options = {});
    if (!options.hasOwnProperty("instantiate")) options.instantiate = true;
    if (opts.ids && args.length > 0) ids = _.flatten(args);
    if (ids && ids.length > 0) {
      ids = _.map(ids, function(idOrRecord) {
        if (idOrRecord instanceof Tower.Model) {
          return idOrRecord.get("id");
        } else {
          return idOrRecord;
        }
      });
      criteria.where({
        id: {
          $in: ids
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

})();

require('./scope/finders');

require('./scope/persistence');

require('./scope/queries');

Tower.Model.Scope.include(Tower.Model.Scope.Finders);

Tower.Model.Scope.include(Tower.Model.Scope.Persistence);

Tower.Model.Scope.include(Tower.Model.Scope.Queries);

_ref = Tower.Model.Scope.queryMethods;
_fn = function(key) {
  return Tower.Model.Scope.prototype[key] = function() {
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

module.exports = Tower.Model.Scope;
