var __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) { 
    if(typeof parent.__extend == 'function') return parent.__extend(child);
      
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

  return HasMany;

})(Tower.Model.Relation);

Tower.Model.Relation.HasMany.Cursor = (function(_super) {
  var Cursor;

  function Cursor() {
    return Cursor.__super__.constructor.apply(this, arguments);
  }

  Cursor = __extends(Cursor, _super);

  __defineProperty(Cursor,  "isHasMany", true);

  __defineProperty(Cursor,  "init", function() {
    return this._super.apply(this, arguments);
  });

  __defineProperty(Cursor,  "has", function(object) {
    var records;
    object = _.castArray(object);
    records = [];
    if (!records.length) {
      return false;
    }
    return false;
  });

  __defineProperty(Cursor,  "validate", function(callback) {
    if (this.owner.get('isNew')) {
      throw new Error('You cannot call insert unless the parent is saved');
    }
    return callback.call(this);
  });

  __defineProperty(Cursor,  "build", function(callback) {
    this.compileForInsert();
    return this._build(callback);
  });

  __defineProperty(Cursor,  "insert", function(callback) {
    var _this = this;
    return this.validate(function(error) {
      return _this.insertReferenced(callback);
    });
  });

  __defineProperty(Cursor,  "update", function(callback) {
    var _this = this;
    return this.validate(function(error) {
      return _this.updateReferenced(callback);
    });
  });

  __defineProperty(Cursor,  "destroy", function(callback) {
    var _this = this;
    return this.validate(function(error) {
      return _this.destroyReferenced(callback);
    });
  });

  __defineProperty(Cursor,  "find", function(callback) {
    var _this = this;
    return this.validate(function(error) {
      return _this.findReferenced(callback);
    });
  });

  __defineProperty(Cursor,  "count", function(callback) {
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

  __defineProperty(Cursor,  "exists", function(callback) {
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

  __defineProperty(Cursor,  "insertReferenced", function(callback) {
    var _this = this;
    this.compileForInsert();
    return this._runBeforeInsertCallbacksOnStore(function() {
      return _this._insert(function(error, record) {
        if (!error) {
          return _this._runAfterInsertCallbacksOnStore(function() {
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

  __defineProperty(Cursor,  "updateReferenced", function(callback) {
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

  __defineProperty(Cursor,  "destroyReferenced", function(callback) {
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

  __defineProperty(Cursor,  "findReferenced", function(callback) {
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

  __defineProperty(Cursor,  "add", function(callback) {
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

  __defineProperty(Cursor,  "remove", function(callback) {
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

  __defineProperty(Cursor,  "compile", function() {
    var array, data, id, inverseRelation, owner, relation, _name;
    owner = this.owner;
    relation = this.relation;
    inverseRelation = relation.inverse();
    id = owner.get('id');
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
        data[_name = relation.foreignType] || (data[_name] = owner.constructor.className());
      }
    }
    if (inverseRelation && inverseRelation.counterCacheKey) {
      data[inverseRelation.counterCacheKey] = 1;
    }
    return this.where(data);
  });

  __defineProperty(Cursor,  "compileForInsert", function() {
    return this.compile();
  });

  __defineProperty(Cursor,  "compileForUpdate", function() {
    this.compileForFind();
    if (!(this.ids && this.ids.length)) {
      return this.returnArray = true;
    }
  });

  __defineProperty(Cursor,  "compileForDestroy", function() {
    return this.compileForFind();
  });

  __defineProperty(Cursor,  "compileForFind", function() {
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

  __defineProperty(Cursor,  "updateOwnerRecord", function() {
    var relation;
    relation = this.relation;
    return !!(relation && (relation.idCache || relation.counterCache));
  });

  __defineProperty(Cursor,  "ownerAttributes", function(record) {
    var data, inc, push, relation, updates;
    relation = this.relation;
    if (relation.idCache) {
      push = {};
      data = record ? record.get('id') : this.store._mapKeys('id', this.data);
      push[relation.idCacheKey] = data;
    }
    if (relation.counterCacheKey) {
      inc = {};
      inc[relation.counterCacheKey] = 1;
    }
    updates = {};
    if (push) {
      if (_.isArray(push)) {
        updates['$addEach'] = push;
      } else {
        updates['$add'] = push;
      }
    }
    if (inc) {
      updates['$inc'] = inc;
    }
    return updates;
  });

  __defineProperty(Cursor,  "ownerAttributesForDestroy", function(record) {
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
      updates['$pullEach'] = pull;
    }
    if (inc) {
      updates['$inc'] = inc;
    }
    return updates;
  });

  __defineProperty(Cursor,  "_idCacheRecords", function(records) {
    var rootRelation;
    rootRelation = this.owner.relation(this.relation.name);
    return rootRelation.cursor.records = rootRelation.cursor.records.concat(_.castArray(records));
  });

  return Cursor;

})(Tower.Model.Relation.Cursor);

module.exports = Tower.Model.Relation.HasMany;
