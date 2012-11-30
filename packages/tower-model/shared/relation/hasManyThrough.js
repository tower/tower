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

Tower.ModelRelationHasManyThrough = (function(_super) {
  var ModelRelationHasManyThrough;

  function ModelRelationHasManyThrough() {
    return ModelRelationHasManyThrough.__super__.constructor.apply(this, arguments);
  }

  ModelRelationHasManyThrough = __extends(ModelRelationHasManyThrough, _super);

  ModelRelationHasManyThrough.reopen({
    isHasManyThrough: true,
    init: function(options) {
      var throughRelation;
      this._super.apply(this, arguments);
      if (this.through && !options.type) {
        this.throughRelation = throughRelation = this.owner.relation(this.through);
        return options.type || (options.type = throughRelation.targetType);
      }
    },
    inverseThrough: function(relation) {
      var name, relations, type;
      relations = relation.targetKlass().relations();
      if (relation.inverseOf) {
        return relations[relation.inverseOf];
      } else {
        name = this.name;
        type = this.type;
        for (name in relations) {
          relation = relations[name];
          if (relation.inverseOf === name) {
            return relation;
          }
        }
        for (name in relations) {
          relation = relations[name];
          if (relation.targetType === type) {
            return relation;
          }
        }
      }
    }
  });

  return ModelRelationHasManyThrough;

})(Tower.ModelRelationHasMany);

Tower.ModelRelationHasManyThroughCursorMixin = Ember.Mixin.create(Tower.ModelRelationHasManyCursorMixin, {
  isHasManyThrough: true,
  clonePrototype: function() {
    var clone;
    clone = this.concat();
    clone.isCursor = true;
    Tower.ModelRelationCursorMixin.apply(clone);
    return Tower.ModelRelationHasManyThroughCursorMixin.apply(clone);
  },
  make: function(options) {
    if (options == null) {
      options = {};
    }
    this._super.apply(this, arguments);
    if (this.relation.through) {
      this.throughRelation = this.owner.constructor.relation(this.relation.through);
      return this.inverseRelation = this.relation.inverseThrough(this.throughRelation);
    }
  },
  compile: function() {
    return this;
  },
  insert: function(callback) {
    var _this = this;
    return this._runBeforeInsertCallbacksOnStore(function() {
      return _this._insert(function(error, record) {
        if (!error) {
          return _this._runAfterInsertCallbacksOnStore(function() {
            return _this.insertThroughRelation(record, function(error, throughRecord) {
              if (callback) {
                return callback.call(_this, error, record);
              }
            });
          });
        } else {
          if (callback) {
            return callback.call(_this, error, record);
          }
        }
      });
    });
  },
  add: function(callback) {
    var _this = this;
    return this._build(function(error, record) {
      if (!error) {
        return _this.insertThroughRelation(record, function(error, throughRecord) {
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
  },
  remove: function(callback) {
    var _this = this;
    return this.removeThroughRelation(function(error) {
      if (callback) {
        return callback.call(_this, error, _this.ids);
      }
    });
  },
  count: function(callback) {
    var _this = this;
    return this._runBeforeFindCallbacksOnStore(function() {
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
  },
  exists: function(callback) {
    var _this = this;
    return this._runBeforeFindCallbacksOnStore(function() {
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
  },
  appendThroughConditions: function(callback) {
    var _this = this;
    return this.owner.get(this.relation.through).all(function(error, records) {
      var ids;
      ids = _this.store._mapKeys(_this.inverseRelation.foreignKey, records);
      _this.where({
        'id': {
          $in: ids
        }
      });
      return callback();
    });
  },
  removeThroughRelation: function(callback) {
    var ids, key,
      _this = this;
    ids = this.ids;
    key = this.inverseRelation.foreignKey;
    return this.owner.get(this.relation.through).anyIn(key, ids).destroy(function(error) {
      if (callback) {
        return callback.call(_this, error);
      }
    });
  },
  insertThroughRelation: function(records, callback) {
    var attributes, data, key, record, returnArray, _i, _len,
      _this = this;
    returnArray = _.isArray(records);
    records = _.castArray(records);
    data = [];
    key = this.inverseRelation.foreignKey;
    for (_i = 0, _len = records.length; _i < _len; _i++) {
      record = records[_i];
      attributes = {};
      attributes[key] = record.get('id');
      data.push(attributes);
    }
    return this.owner.get(this.relation.through).insert(data, function(error, throughRecords) {
      if (!returnArray) {
        throughRecords = throughRecords[0];
      }
      if (callback) {
        return callback.call(_this, error, throughRecords);
      }
    });
  }
});

Tower.ModelRelationHasManyThroughCursor = (function(_super) {
  var ModelRelationHasManyThroughCursor;

  function ModelRelationHasManyThroughCursor() {
    return ModelRelationHasManyThroughCursor.__super__.constructor.apply(this, arguments);
  }

  ModelRelationHasManyThroughCursor = __extends(ModelRelationHasManyThroughCursor, _super);

  ModelRelationHasManyThroughCursor.reopenClass({
    makeOld: function() {
      var array;
      array = [];
      array.isCursor = true;
      Tower.ModelRelationCursorMixin.apply(array);
      return Tower.ModelRelationHasManyThroughCursorMixin.apply(array);
    }
  });

  ModelRelationHasManyThroughCursor.include(Tower.ModelRelationHasManyThroughCursorMixin);

  return ModelRelationHasManyThroughCursor;

})(Tower.ModelRelationCursor);

module.exports = Tower.ModelRelationHasManyThrough;
