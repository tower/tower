var __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) { 
    if(typeof parent.__extend == 'function') return parent.__extend(child);
      
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if(typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.Model.Relation.HasManyThrough = (function(_super) {
  var HasManyThrough;

  function HasManyThrough() {
    return HasManyThrough.__super__.constructor.apply(this, arguments);
  }

  HasManyThrough = __extends(HasManyThrough, _super);

  __defineProperty(HasManyThrough,  "init", function(options) {
    var throughRelation;
    this._super.apply(this, arguments);
    if (this.through && !options.type) {
      this.throughRelation = throughRelation = this.owner.relation(this.through);
      return options.type || (options.type = throughRelation.targetType);
    }
  });

  __defineProperty(HasManyThrough,  "inverseThrough", function(relation) {
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
  });

  return HasManyThrough;

})(Tower.Model.Relation.HasMany);

Tower.Model.Relation.HasManyThrough.Cursor = (function(_super) {
  var Cursor;

  function Cursor() {
    return Cursor.__super__.constructor.apply(this, arguments);
  }

  Cursor = __extends(Cursor, _super);

  __defineProperty(Cursor,  "isHasManyThrough", true);

  __defineProperty(Cursor,  "init", function(options) {
    if (options == null) {
      options = {};
    }
    this._super.apply(this, arguments);
    if (this.relation.through) {
      this.throughRelation = this.owner.constructor.relation(this.relation.through);
      return this.inverseRelation = this.relation.inverseThrough(this.throughRelation);
    }
  });

  __defineProperty(Cursor,  "compile", function() {
    return this;
  });

  __defineProperty(Cursor,  "create", function(callback) {
    var _this = this;
    return this._runBeforeCreateCallbacksOnStore(function() {
      return _this._create(function(error, record) {
        if (!error) {
          return _this._runAfterCreateCallbacksOnStore(function() {
            return _this.createThroughRelation(record, function(error, throughRecord) {
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
  });

  __defineProperty(Cursor,  "add", function(callback) {
    var _this = this;
    return this._build(function(error, record) {
      if (!error) {
        return _this.createThroughRelation(record, function(error, throughRecord) {
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

  __defineProperty(Cursor,  "count", function(callback) {
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
  });

  __defineProperty(Cursor,  "exists", function(callback) {
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
  });

  __defineProperty(Cursor,  "appendThroughConditions", function(callback) {
    var _this = this;
    return this.owner[this.relation.through]().all(function(error, records) {
      var ids;
      ids = _this.store._mapKeys(_this.inverseRelation.foreignKey, records);
      _this.where({
        'id': {
          $in: ids
        }
      });
      return callback();
    });
  });

  __defineProperty(Cursor,  "createThroughRelation", function(records, callback) {
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
    return this.owner[this.relation.through]().create(data, function(error, throughRecords) {
      if (!returnArray) {
        throughRecords = throughRecords[0];
      }
      if (callback) {
        return callback.call(_this, error, throughRecords);
      }
    });
  });

  return Cursor;

})(Tower.Model.Relation.HasMany.Cursor);

module.exports = Tower.Model.Relation.HasManyThrough;
