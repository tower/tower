var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Model.Relation.HasMany = (function(_super) {

  __extends(HasMany, _super);

  function HasMany() {
    HasMany.__super__.constructor.apply(this, arguments);
  }

  HasMany.prototype.initialize = function(options) {
    if (this.through && !options.type) {
      options.type || (options.type = this.owner.relation(this.through).ownerType);
    }
    return HasMany.__super__.initialize.apply(this, arguments);
  };

  HasMany.Criteria = (function(_super2) {

    __extends(Criteria, _super2);

    function Criteria() {
      Criteria.__super__.constructor.apply(this, arguments);
    }

    Criteria.prototype.isHasMany = true;

    Criteria.prototype.validate = function() {
      if (!this.owner.isPersisted()) {
        throw new Error("You cannot call create unless the parent is saved");
      }
    };

    Criteria.prototype.create = function(callback) {
      console.log("CRITER");
      this.validate();
      return this._createReferenced(callback);
    };

    Criteria.prototype.update = function() {
      return this.validate();
    };

    Criteria.prototype.destroy = function() {
      return this.validate();
    };

    Criteria.prototype.compile = function() {};

    Criteria.prototype._createEmbedded = function(callback) {
      var updates,
        _this = this;
      updates = this._compileForCreateEmbedded();
      return this.owner.updateAttributes(updates, function(error) {
        if (!error) if (callback) return callback.call(_this, error, records);
      });
    };

    Criteria.prototype._createReferenced = function(callback) {
      var _this = this;
      this._compileForCreate();
      return this._create(function(error, record) {
        if (!error) {
          _this._cacheRecords(record);
          if (_this.updateOwnerRecord()) {
            return _this.owner.updateAttributes(_this.ownerAttributes(record), function(error) {
              if (callback) return callback.call(_this, error, record);
            });
          } else {
            if (callback) return callback.call(_this, error, record);
          }
        } else {
          if (callback) return callback.call(_this, error, record);
        }
      });
    };

    Criteria.prototype._cacheRecords = function(records) {
      var rootRelation;
      rootRelation = this.owner.relation(this.relation.name);
      return rootRelation.criteria.records = rootRelation.criteria.records.concat(_.castArray(records));
    };

    Criteria.prototype._compileForCreate = function() {
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

    Criteria.prototype._compileForCreateEmbedded = function() {
      var attributes, owner, record, records, relation, returnArray, updates, _base, _i, _len;
      owner = this.owner;
      relation = this.relation;
      returnArray = this.returnArray;
      this.returnArray = true;
      records = this.build();
      this.returnArray = returnArray;
      updates = {
        $pushAll: {}
      };
      attributes = [];
      for (_i = 0, _len = records.length; _i < _len; _i++) {
        record = records[_i];
        if ((_base = record.attributes)._id == null) {
          _base._id = relation.klass().store().generateId();
        }
        delete record.attributes.id;
        attributes.push(record.attributes);
      }
      updates["$pushAll"][relation.name] = attributes;
      return updates;
    };

    return Criteria;

  })(HasMany.Criteria);

  return HasMany;

})(Tower.Model.Relation);

module.exports = Tower.Model.Relation.HasMany;
