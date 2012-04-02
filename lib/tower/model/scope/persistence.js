
Tower.Model.Scope.Persistence = {
  ClassMethods: {
    persistenceMethods: ["create", "update", "destroy"]
  },
  build: function() {
    var args, callback, criteria;
    criteria = this.criteria.clone();
    args = _.args(arguments);
    callback = _.extractBlock(args);
    criteria.addData(args);
    return criteria.build(callback);
  },
  create: function() {
    var args, callback, criteria;
    criteria = this.criteria.clone();
    args = _.args(arguments);
    callback = _.extractBlock(args);
    criteria.addData(args);
    return criteria.create(callback);
  },
  update: function() {
    var args, callback, criteria, ids, object, updates, _i, _len;
    criteria = this.criteria.clone();
    args = _.flatten(_.args(arguments));
    callback = _.extractBlock(args);
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
    return criteria.update(callback);
  },
  destroy: function() {
    var args, callback, criteria, ids, object, _i, _len;
    criteria = this.criteria.clone();
    args = _.flatten(_.args(arguments));
    callback = _.extractBlock(args);
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
    return criteria.destroy(callback);
  },
  _create: function(scope, callback) {
    var criteria, iterator, records, returnArray,
      _this = this;
    criteria = scope.criteria;
    if (criteria.values.options.instantiate) {
      returnArray = criteria.returnArray;
      criteria.returnArray = true;
      records = this.build(scope);
      criteria.returnArray = returnArray;
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
          if (returnArray) {
            return callback(error, records);
          } else {
            return callback(error, records[0]);
          }
        }
      });
    } else {
      return this.store.create(criteria, callback);
    }
  },
  _update: function(criteria, callback) {
    var iterator;
    if (criteria.instantiate) {
      iterator = function(record, next) {
        return record.updateAttributes(criteria.data, next);
      };
      return this._each(criteria, iterator, callback);
    } else {
      return this.store.update(criteria, callback);
    }
  },
  _destroy: function(criteria, callback) {
    var iterator;
    if (criteria.instantiate) {
      iterator = function(record, next) {
        return record.destroy(next);
      };
      return this._each(criteria, iterator, callback);
    } else {
      return this.store.destroy(criteria, callback);
    }
  },
  _each: function(criteria, iterator, callback) {
    var _this = this;
    return this.store.find(criteria, function(error, records) {
      if (error) {
        return callback.call(_this, error, records);
      } else {
        return Tower.parallel(records, iterator, function(error) {
          if (!callback) {
            if (error) throw error;
          } else {
            if (callback) return callback.call(_this, error, records);
          }
        });
      }
    });
  }
};

module.exports = Tower.Model.Scope.Persistence;
