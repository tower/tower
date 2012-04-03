var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Model.Relation.HasManyThrough = (function(_super) {

  __extends(HasManyThrough, _super);

  function HasManyThrough() {
    HasManyThrough.__super__.constructor.apply(this, arguments);
  }

  HasManyThrough.prototype.initialize = function(options) {
    var throughRelation;
    HasManyThrough.__super__.initialize.apply(this, arguments);
    if (this.through && !options.type) {
      this.throughRelation = throughRelation = this.owner.relation(this.through);
      return options.type || (options.type = throughRelation.targetType);
    }
  };

  HasManyThrough.prototype.inverseThrough = function(relation) {
    var name, relations, type;
    relations = relation.targetKlass().relations();
    if (relation.inverseOf) {
      return relations[relation.inverseOf];
    } else {
      name = this.name;
      type = this.type;
      for (name in relations) {
        relation = relations[name];
        if (relation.inverseOf === name) return relation;
      }
      for (name in relations) {
        relation = relations[name];
        if (relation.targetType === type) return relation;
      }
    }
  };

  HasManyThrough.Criteria = (function(_super2) {

    __extends(Criteria, _super2);

    Criteria.prototype.isHasManyThrough = true;

    function Criteria(options) {
      if (options == null) options = {};
      Criteria.__super__.constructor.apply(this, arguments);
      if (this.relation.through) {
        this.throughRelation = this.owner.constructor.relation(this.relation.through);
        this.inverseRelation = this.relation.inverseThrough(this.throughRelation);
      }
    }

    Criteria.prototype.compile = function() {
      return this;
    };

    Criteria.prototype.create = function(callback) {
      var _this = this;
      return this._runBeforeCreateCallbacksOnStore(function() {
        return _this._create(function(error, record) {
          if (!error) {
            return _this._runAfterCreateCallbacksOnStore(function() {
              return _this.createThroughRelation(record, function(error, throughRecord) {
                if (callback) return callback.call(_this, error, record);
              });
            });
          } else {
            if (callback) return callback.call(_this, error, record);
          }
        });
      });
    };

    Criteria.prototype.count = function(callback) {
      var _this = this;
      return this._runBeforeFindCallbacksOnStore(function() {
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
    };

    Criteria.prototype.exists = function(callback) {
      var _this = this;
      return this._runBeforeFindCallbacksOnStore(function() {
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
    };

    Criteria.prototype.appendThroughConditions = function(callback) {
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
    };

    Criteria.prototype.createThroughRelation = function(records, callback) {
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
        if (!returnArray) throughRecords = throughRecords[0];
        if (callback) return callback.call(_this, error, throughRecords);
      });
    };

    return Criteria;

  })(HasManyThrough.Criteria);

  return HasManyThrough;

})(Tower.Model.Relation.HasMany);

module.exports = Tower.Model.Relation.HasManyThrough;
