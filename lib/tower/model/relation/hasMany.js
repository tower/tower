var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Model.Relation.HasMany = (function(_super) {

  __extends(HasMany, _super);

  function HasMany() {
    HasMany.__super__.constructor.apply(this, arguments);
  }

  HasMany.Criteria = (function(_super2) {

    __extends(Criteria, _super2);

    function Criteria() {
      Criteria.__super__.constructor.apply(this, arguments);
    }

    Criteria.prototype.isHasMany = true;

    Criteria.prototype.has = function(object) {
      var records;
      object = _.castArray(object);
      records = [];
      if (!records.length) return false;
      return false;
    };

    Criteria.prototype.validate = function(callback) {
      if (!this.owner.isPersisted()) {
        throw new Error("You cannot call create unless the parent is saved");
      }
      return callback.call(this);
    };

    Criteria.prototype.create = function(callback) {
      var _this = this;
      return this.validate(function(error) {
        return _this.createReferenced(callback);
      });
    };

    Criteria.prototype.update = function(callback) {
      var _this = this;
      return this.validate(function(error) {
        return _this.updateReferenced(callback);
      });
    };

    Criteria.prototype.destroy = function(callback) {
      var _this = this;
      return this.validate(function(error) {
        return _this.destroyReferenced(callback);
      });
    };

    Criteria.prototype.find = function(callback) {
      var _this = this;
      return this.validate(function(error) {
        return _this.findReferenced(callback);
      });
    };

    Criteria.prototype.count = function(callback) {
      var _this = this;
      return this.validate(function(error) {
        _this.compileForFind();
        return _this._runBeforeFindCallbacksOnStore(function() {
          return _this._count(function(error, record) {
            if (!error) {
              return _this._runAfterFindCallbacksOnStore(function() {
                if (callback) return callback.call(_this, error, record);
              });
            } else {
              if (callback) return callback.call(_this, error, record);
            }
          });
        });
      });
    };

    Criteria.prototype.exists = function(callback) {
      var _this = this;
      return this.validate(function(error) {
        _this.compileForFind();
        return _this._runBeforeFindCallbacksOnStore(function() {
          return _this._exists(function(error, record) {
            if (!error) {
              return _this._runAfterFindCallbacksOnStore(function() {
                if (callback) return callback.call(_this, error, record);
              });
            } else {
              if (callback) return callback.call(_this, error, record);
            }
          });
        });
      });
    };

    Criteria.prototype.createReferenced = function(callback) {
      var _this = this;
      this.compileForCreate();
      return this._runBeforeCreateCallbacksOnStore(function() {
        return _this._create(function(error, record) {
          if (!error) {
            return _this._runAfterCreateCallbacksOnStore(function() {
              if (_this.updateOwnerRecord()) {
                return _this.owner.updateAttributes(_this.ownerAttributes(record), function(error) {
                  if (callback) return callback.call(_this, error, record);
                });
              } else {
                if (callback) return callback.call(_this, error, record);
              }
            });
          } else {
            if (callback) return callback.call(_this, error, record);
          }
        });
      });
    };

    Criteria.prototype.updateReferenced = function(callback) {
      var _this = this;
      this.compileForUpdate();
      return this._runBeforeUpdateCallbacksOnStore(function() {
        return _this._update(function(error, record) {
          if (!error) {
            return _this._runAfterUpdateCallbacksOnStore(function() {
              if (callback) return callback.call(_this, error, record);
            });
          } else {
            if (callback) return callback.call(_this, error, record);
          }
        });
      });
    };

    Criteria.prototype.destroyReferenced = function(callback) {
      var _this = this;
      this.compileForDestroy();
      return this._runBeforeDestroyCallbacksOnStore(function() {
        return _this._destroy(function(error, record) {
          if (!error) {
            return _this._runAfterDestroyCallbacksOnStore(function() {
              if (callback) return callback.call(_this, error, record);
            });
          } else {
            if (callback) return callback.call(_this, error, record);
          }
        });
      });
    };

    Criteria.prototype.findReferenced = function(callback) {
      var _this = this;
      this.compileForFind();
      return this._runBeforeFindCallbacksOnStore(function() {
        return _this._find(function(error, record) {
          if (!error) {
            return _this._runAfterFindCallbacksOnStore(function() {
              if (callback) return callback.call(_this, error, record);
            });
          } else {
            if (callback) return callback.call(_this, error, record);
          }
        });
      });
    };

    Criteria.prototype.compile = function() {
      var array, data, id, inverseRelation, owner, relation, _name;
      owner = this.owner;
      relation = this.relation;
      inverseRelation = relation.inverse();
      id = owner.get("id");
      data = {};
      if (inverseRelation && inverseRelation.cache) {
        array = data[inverseRelation.cacheKey] || [];
        if (array.indexOf(id) === -1) array.push(id);
        data[inverseRelation.cacheKey] = array;
      } else if (relation.foreignKey) {
        if (id !== void 0) data[relation.foreignKey] = id;
        if (relation.foreignType) {
          data[_name = relation.foreignType] || (data[_name] = owner.constructor.name);
        }
      }
      if (inverseRelation && inverseRelation.counterCacheKey) {
        data[inverseRelation.counterCacheKey] = 1;
      }
      return this.where(data);
    };

    Criteria.prototype.compileForCreate = function() {
      return this.compile();
    };

    Criteria.prototype.compileForUpdate = function() {
      return this.compile();
    };

    Criteria.prototype.compileForDestroy = function() {
      return this.compile();
    };

    Criteria.prototype.compileForFind = function() {
      return this.compile();
    };

    Criteria.prototype.updateOwnerRecord = function() {
      var relation;
      relation = this.relation;
      return !!(relation && (relation.cache || relation.counterCache));
    };

    Criteria.prototype.ownerAttributes = function(record) {
      var inc, push, relation, updates;
      relation = this.relation;
      if (relation.cache) {
        push = {};
        push[relation.cacheKey] = record.get("id");
      }
      if (relation.counterCacheKey) {
        inc = {};
        inc[relation.counterCacheKey] = 1;
      }
      updates = {};
      if (push) updates["$push"] = push;
      if (inc) updates["$inc"] = inc;
      return updates;
    };

    Criteria.prototype._cacheRecords = function(records) {
      var rootRelation;
      rootRelation = this.owner.relation(this.relation.name);
      return rootRelation.criteria.records = rootRelation.criteria.records.concat(_.castArray(records));
    };

    return Criteria;

  })(HasMany.Criteria);

  return HasMany;

})(Tower.Model.Relation);

module.exports = Tower.Model.Relation.HasMany;
