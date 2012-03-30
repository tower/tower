var key, _fn, _i, _len, _ref,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
  _this = this;

Tower.Model.Scope = (function(_super) {

  __extends(Scope, _super);

  function Scope(options) {
    if (options == null) options = {};
    this.model = options.model;
    this.criteria = options.criteria || new Tower.Model.Criteria;
    this.store = this.model.store();
  }

  Scope.prototype.toQuery = function(sortDirection) {
    return this.toCriteria(sortDirection).toQuery();
  };

  Scope.prototype.compile = function(sortDirection) {
    var criteria, sort;
    criteria = this.criteria.clone();
    if (sortDirection || !criteria._order.length > 0) {
      sort = this.model.defaultSort();
      if (sort) criteria[sortDirection || sort.direction](sort.name);
    }
    return criteria;
  };

  Scope.prototype.toCriteria = Scope.prototype.compile;

  Scope.prototype.merge = function(scope) {
    return this.criteria.merge(scope.criteria);
  };

  Scope.prototype.clone = function() {
    return new this.constructor({
      model: this.model,
      criteria: this.criteria.clone()
    });
  };

  Scope.prototype._extractArgsForBuild = function(args) {
    var callback, criteria;
    criteria = this.criteria.clone();
    args = Tower.Support.Array.args(args);
    callback = Tower.Support.Array.extractBlock(args);
    criteria.addData(args);
    return [criteria, callback];
  };

  Scope.prototype._extractArgsForCreate = function(args) {
    return this._extractArgsForBuild(args);
  };

  Scope.prototype._extractArgsForUpdate = function(args) {
    var callback, criteria, ids, object, updates, _i, _len;
    criteria = this.criteria.clone();
    args = _.flatten(Tower.Support.Array.args(args));
    callback = Tower.Support.Array.extractBlock(args);
    updates = args.pop();
    if (!(updates && typeof updates === "object")) {
      throw new Error("Must pass in updates hash");
    }
    if (args.length) {
      ids = [];
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        object = args[_i];
        if (object == null) continue;
        ids.push(object instanceof Tower.Model ? object.get('id') : object);
      }
      criteria.where({
        id: {
          $in: ids
        }
      });
    }
    return [criteria, callback];
  };

  Scope.prototype._extractArgsForDestroy = function(args) {
    return this._extractArgsForFind(args);
  };

  Scope.prototype._extractArgsForFind = function(args) {
    var callback, criteria, ids, object, _i, _len;
    criteria = this.criteria.clone();
    args = _.flatten(Tower.Support.Array.args(args));
    callback = Tower.Support.Array.extractBlock(args);
    if (args.length) {
      ids = [];
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        object = args[_i];
        if (object == null) continue;
        ids.push(object instanceof Tower.Model ? object.get('id') : object);
      }
      criteria.where({
        id: {
          $in: ids
        }
      });
    }
    return [criteria, callback];
  };

  return Scope;

})(Tower.Class);

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
