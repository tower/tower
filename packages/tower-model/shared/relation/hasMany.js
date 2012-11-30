var _,
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) {
    if (typeof parent.__extend == 'function') return parent.__extend(child);
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if (typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

_ = Tower._;

Tower.ModelRelationHasMany = (function(_super) {
  var ModelRelationHasMany;

  function ModelRelationHasMany() {
    return ModelRelationHasMany.__super__.constructor.apply(this, arguments);
  }

  ModelRelationHasMany = __extends(ModelRelationHasMany, _super);

  ModelRelationHasMany.reopen({
    isHasMany: true,
    isCollection: true
  });

  return ModelRelationHasMany;

})(Tower.ModelRelation);

Tower.ModelRelationHasManyCursorMixin = Ember.Mixin.create({
  isHasMany: true,
  clonePrototype: function() {
    var clone;
    clone = this.concat();
    clone.isCursor = true;
    Tower.ModelRelationCursorMixin.apply(clone);
    return Tower.ModelRelationHasManyCursorMixin.apply(clone);
  },
  has: function(object) {
    var records;
    object = _.castArray(object);
    records = [];
    if (!records.length) {
      return false;
    }
    return false;
  },
  validate: function(callback) {
    if (this.owner.get('isNew')) {
      throw new Error('You cannot call insert unless the parent is saved');
    }
    return callback.call(this);
  },
  build: function(callback) {
    this.compileForInsert();
    return this._build(callback);
  },
  insert: function(callback) {
    var _this = this;
    return this.validate(function(error) {
      return _this.insertReferenced(callback);
    });
  },
  update: function(callback) {
    var _this = this;
    return this.validate(function(error) {
      return _this.updateReferenced(callback);
    });
  },
  destroy: function(callback) {
    var _this = this;
    return this.validate(function(error) {
      return _this.destroyReferenced(callback);
    });
  },
  find: function(callback) {
    var _this = this;
    if (Tower.isServer && this._hasContent(callback)) {
      return this;
    }
    return this.validate(function(error) {
      return _this.findReferenced(callback);
    });
  },
  count: function(callback) {
    var value,
      _this = this;
    if (this.relation.counterCache) {
      value = this.owner.get(this.relation.counterCacheKey);
      if (callback) {
        callback.call(this, null, value);
      }
      return value;
    }
    return this.validate(function(error) {
      _this.compileForFind();
      return _this._runBeforeFindCallbacksOnStore(function() {
        return _this._count(function(error, value) {
          if (!error) {
            return _this._runAfterFindCallbacksOnStore(function() {
              if (callback) {
                return callback.call(_this, error, value);
              }
            });
          } else {
            if (callback) {
              return callback.call(_this, error, value);
            }
          }
        });
      });
    });
  },
  exists: function(callback) {
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
  },
  updateCounter: function(difference, callback) {
    var key, owner;
    owner = this.owner;
    key = this.relation.counterCacheKey;
    return owner.updateAttribute(key, owner.get(key) + difference, callback);
  },
  insertReferenced: function(callback) {
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
  },
  updateReferenced: function(callback) {
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
  },
  destroyReferenced: function(callback) {
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
  },
  findReferenced: function(callback) {
    var result, returnArray,
      _this = this;
    this.compileForFind();
    returnArray = this.returnArray;
    result = void 0;
    this._runBeforeFindCallbacksOnStore(function() {
      return _this._find(function(error, records) {
        var done;
        result = records;
        if (!error && records) {
          done = function() {
            if (callback) {
              return callback.call(_this, error, records);
            }
          };
          return _this._runAfterFindCallbacksOnStore(done, records);
        } else {
          if (callback) {
            return callback.call(_this, error, records);
          }
        }
      });
    });
    if (returnArray === false) {
      return result;
    } else {
      return this;
    }
  },
  add: function(callback) {
    var _this = this;
    if (!this.relation.idCache) {
      throw new Error;
    }
    return this.owner.updateAttributes(this.ownerAttributes(), function(error) {
      if (callback) {
        return callback.call(_this, error, _this.data);
      }
    });
  },
  remove: function(callback) {
    var _this = this;
    if (!this.relation.idCache) {
      throw new Error;
    }
    return this.owner.updateAttributes(this.ownerAttributesForDestroy(), function(error) {
      if (callback) {
        return callback.call(_this, error, _this.data);
      }
    });
  },
  compile: function() {
    var data, id, inverseRelation, owner, relation, _name;
    owner = this.owner;
    relation = this.relation;
    inverseRelation = relation.inverse();
    id = owner.get('id');
    data = {};
    if (relation.foreignKey) {
      if (id !== void 0) {
        data[relation.foreignKey] = id;
      }
      if (relation.foreignType) {
        data[_name = relation.foreignType] || (data[_name] = owner.constructor.className());
      }
    }
    return this.where(data);
  },
  compileForInsert: function() {
    return this.compile();
  },
  compileForUpdate: function() {
    this.compileForFind();
    if (!(this.ids && this.ids.length)) {
      return this.returnArray = true;
    }
  },
  compileForDestroy: function() {
    return this.compileForFind();
  },
  compileForFind: function() {
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
  },
  updateOwnerRecord: function() {
    var relation;
    relation = this.relation;
    return !!(relation && (relation.idCache || relation.counterCache));
  },
  ownerAttributes: function(record) {
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
  },
  ownerAttributesForDestroy: function(record) {
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
  },
  _idCacheRecords: function(records) {
    var rootRelation;
    rootRelation = this.owner.relation(this.relation.name);
    return rootRelation.cursor.records = rootRelation.cursor.records.concat(_.castArray(records));
  }
});

Tower.ModelRelationHasManyCursor = (function(_super) {
  var ModelRelationHasManyCursor;

  function ModelRelationHasManyCursor() {
    return ModelRelationHasManyCursor.__super__.constructor.apply(this, arguments);
  }

  ModelRelationHasManyCursor = __extends(ModelRelationHasManyCursor, _super);

  ModelRelationHasManyCursor.reopenClass({
    makeOld: function() {
      var array;
      array = [];
      array.isCursor = true;
      Tower.ModelRelationCursorMixin.apply(array);
      return Tower.ModelRelationHasManyCursorMixin.apply(array);
    }
  });

  ModelRelationHasManyCursor.include(Tower.ModelRelationHasManyCursorMixin);

  return ModelRelationHasManyCursor;

})(Tower.ModelRelationCursor);

module.exports = Tower.ModelRelationHasMany;
