var __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) { 
    if(typeof parent.__extend == 'function') return parent.__extend();
      
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if(typeof parent.extended == 'function') parent.extended(child); 
    return child; 
},
  __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
};

Tower.Model.Relation.HasMany = (function(_super) {
  var HasMany;

  function HasMany() {
    return HasMany.__super__.constructor.apply(this, arguments);
  }

  HasMany = __extends(HasMany, _super);

  HasMany.Criteria = (function(_super1) {
    var Criteria;

    function Criteria() {
      return Criteria.__super__.constructor.apply(this, arguments);
    }

    Criteria = __extends(Criteria, _super1);

    __defineProperty(Criteria,  "isHasMany", true);

    __defineProperty(Criteria,  "has", function(object) {
      var records;
      object = _.castArray(object);
      records = [];
      if (!records.length) {
        return false;
      }
      return false;
    });

    __defineProperty(Criteria,  "validate", function(callback) {
      if (!this.owner.isPersisted()) {
        throw new Error("You cannot call create unless the parent is saved");
      }
      return callback.call(this);
    });

    __defineProperty(Criteria,  "build", function(callback) {
      this.compileForCreate();
      return this._build(callback);
    });

    __defineProperty(Criteria,  "create", function(callback) {
      var _this = this;
      return this.validate(function(error) {
        return _this.createReferenced(callback);
      });
    });

    __defineProperty(Criteria,  "update", function(callback) {
      var _this = this;
      return this.validate(function(error) {
        return _this.updateReferenced(callback);
      });
    });

    __defineProperty(Criteria,  "destroy", function(callback) {
      var _this = this;
      return this.validate(function(error) {
        return _this.destroyReferenced(callback);
      });
    });

    __defineProperty(Criteria,  "find", function(callback) {
      var _this = this;
      return this.validate(function(error) {
        return _this.findReferenced(callback);
      });
    });

    __defineProperty(Criteria,  "count", function(callback) {
      var _this = this;
      return this.validate(function(error) {
        _this.compileForFind();
        return _this._runBeforeFindCallbacksOnStore(function() {
          return _this._count(function(error, record) {
            if (!error) {
              return _this._runAfterFindCallbacksOnStore(function() {
                if (callback) {
                  return callback.call(_this, error, record);
                }
              });
            } else {
              if (callback) {
                return callback.call(_this, error, record);
              }
            }
          });
        });
      });
    });

    __defineProperty(Criteria,  "exists", function(callback) {
      var _this = this;
      return this.validate(function(error) {
        _this.compileForFind();
        return _this._runBeforeFindCallbacksOnStore(function() {
          return _this._exists(function(error, record) {
            if (!error) {
              return _this._runAfterFindCallbacksOnStore(function() {
                if (callback) {
                  return callback.call(_this, error, record);
                }
              });
            } else {
              if (callback) {
                return callback.call(_this, error, record);
              }
            }
          });
        });
      });
    });

    __defineProperty(Criteria,  "createReferenced", function(callback) {
      var _this = this;
      this.compileForCreate();
      return this._runBeforeCreateCallbacksOnStore(function() {
        return _this._create(function(error, record) {
          if (!error) {
            return _this._runAfterCreateCallbacksOnStore(function() {
              if (_this.updateOwnerRecord()) {
                return _this.owner.updateAttributes(_this.ownerAttributes(record), function(error) {
                  if (callback) {
                    return callback.call(_this, error, record);
                  }
                });
              } else {
                if (callback) {
                  return callback.call(_this, error, record);
                }
              }
            });
          } else {
            if (callback) {
              return callback.call(_this, error, record);
            }
          }
        });
      });
    });

    __defineProperty(Criteria,  "updateReferenced", function(callback) {
      var _this = this;
      this.compileForUpdate();
      return this._runBeforeUpdateCallbacksOnStore(function() {
        return _this._update(function(error, record) {
          if (!error) {
            return _this._runAfterUpdateCallbacksOnStore(function() {
              if (callback) {
                return callback.call(_this, error, record);
              }
            });
          } else {
            if (callback) {
              return callback.call(_this, error, record);
            }
          }
        });
      });
    });

    __defineProperty(Criteria,  "destroyReferenced", function(callback) {
      var _this = this;
      this.compileForDestroy();
      return this._runBeforeDestroyCallbacksOnStore(function() {
        return _this._destroy(function(error, record) {
          if (!error) {
            return _this._runAfterDestroyCallbacksOnStore(function() {
              if (_this.updateOwnerRecord()) {
                return _this.owner.updateAttributes(_this.ownerAttributesForDestroy(record), function(error) {
                  if (callback) {
                    return callback.call(_this, error, record);
                  }
                });
              } else {
                if (callback) {
                  return callback.call(_this, error, record);
                }
              }
            });
          } else {
            if (callback) {
              return callback.call(_this, error, record);
            }
          }
        });
      });
    });

    __defineProperty(Criteria,  "findReferenced", function(callback) {
      var _this = this;
      this.compileForFind();
      return this._runBeforeFindCallbacksOnStore(function() {
        return _this._find(function(error, record) {
          if (!error) {
            return _this._runAfterFindCallbacksOnStore(function() {
              if (callback) {
                return callback.call(_this, error, record);
              }
            });
          } else {
            if (callback) {
              return callback.call(_this, error, record);
            }
          }
        });
      });
    });

    __defineProperty(Criteria,  "add", function(callback) {
      var _this = this;
      if (!this.relation.idCache) {
        throw new Error;
      }
      return this.owner.updateAttributes(this.ownerAttributes(), function(error) {
        if (callback) {
          return callback.call(_this, error, _this.data);
        }
      });
    });

    __defineProperty(Criteria,  "remove", function(callback) {
      var _this = this;
      if (!this.relation.idCache) {
        throw new Error;
      }
      return this.owner.updateAttributes(this.ownerAttributesForDestroy(), function(error) {
        if (callback) {
          return callback.call(_this, error, _this.data);
        }
      });
    });

    __defineProperty(Criteria,  "compile", function() {
      var array, data, id, inverseRelation, owner, relation, _name;
      owner = this.owner;
      relation = this.relation;
      inverseRelation = relation.inverse();
      id = owner.get("id");
      data = {};
      if (inverseRelation && inverseRelation.idCache) {
        array = data[inverseRelation.idCacheKey] || [];
        if (array.indexOf(id) === -1) {
          array.push(id);
        }
        data[inverseRelation.idCacheKey] = array;
      } else if (relation.foreignKey && !relation.idCache) {
        if (id !== void 0) {
          data[relation.foreignKey] = id;
        }
        if (relation.foreignType) {
          data[_name = relation.foreignType] || (data[_name] = owner.constructor.name);
        }
      }
      if (inverseRelation && inverseRelation.counterCacheKey) {
        data[inverseRelation.counterCacheKey] = 1;
      }
      return this.where(data);
    });

    __defineProperty(Criteria,  "compileForCreate", function() {
      return this.compile();
    });

    __defineProperty(Criteria,  "compileForUpdate", function() {
      this.compileForFind();
      if (!(this.ids && this.ids.length)) {
        return this.returnArray = true;
      }
    });

    __defineProperty(Criteria,  "compileForDestroy", function() {
      return this.compileForFind();
    });

    __defineProperty(Criteria,  "compileForFind", function() {
      var relation;
      this.compile();
      relation = this.relation;
      if (relation.idCache) {
        return this.where({
          id: {
            $in: this.owner.get(relation.idCacheKey)
          }
        });
      }
    });

    __defineProperty(Criteria,  "updateOwnerRecord", function() {
      var relation;
      relation = this.relation;
      return !!(relation && (relation.idCache || relation.counterCache));
    });

    __defineProperty(Criteria,  "ownerAttributes", function(record) {
      var data, inc, push, relation, updates;
      relation = this.relation;
      if (relation.idCache) {
        push = {};
        data = record ? record.get("id") : this.store._mapKeys('id', this.data);
        push[relation.idCacheKey] = _.isArray(data) ? {
          $each: data
        } : data;
      }
      if (relation.counterCacheKey) {
        inc = {};
        inc[relation.counterCacheKey] = 1;
      }
      updates = {};
      if (push) {
        updates["$addToSet"] = push;
      }
      if (inc) {
        updates["$inc"] = inc;
      }
      return updates;
    });

    __defineProperty(Criteria,  "ownerAttributesForDestroy", function(record) {
      var inc, pull, relation, updates;
      relation = this.relation;
      if (relation.idCache) {
        pull = {};
        pull[relation.idCacheKey] = this.ids && this.ids.length ? this.ids : this.owner.get(relation.idCacheKey);
      }
      if (relation.counterCacheKey) {
        inc = {};
        inc[relation.counterCacheKey] = -1;
      }
      updates = {};
      if (pull) {
        updates["$pullAll"] = pull;
      }
      if (inc) {
        updates["$inc"] = inc;
      }
      return updates;
    });

    __defineProperty(Criteria,  "_idCacheRecords", function(records) {
      var rootRelation;
      rootRelation = this.owner.relation(this.relation.name);
      return rootRelation.criteria.records = rootRelation.criteria.records.concat(_.castArray(records));
    });

    return Criteria;

  })(HasMany.Criteria);

  return HasMany;

})(Tower.Model.Relation);

module.exports = Tower.Model.Relation.HasMany;
