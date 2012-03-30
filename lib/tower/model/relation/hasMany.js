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

  HasMany.Scope = (function(_super2) {

    __extends(Scope, _super2);

    function Scope() {
      Scope.__super__.constructor.apply(this, arguments);
    }

    Scope.prototype.isHasMany = true;

    Scope.prototype.create = function() {
      var callback, criteria, data, options, _ref;
      if (!this.owner.isPersisted()) {
        throw new Error("You cannot call create unless the parent is saved");
      }
      _ref = this._extractArgs(arguments, {
        data: true
      }), criteria = _ref.criteria, data = _ref.data, options = _ref.options, callback = _ref.callback;
      if (this.relation.embed && this.owner.store().supports("embed")) {
        return this._createEmbedded(criteria, data, options, callback);
      } else {
        return this._createReferenced(criteria, data, options, callback);
      }
    };

    Scope.prototype.update = function() {};

    Scope.prototype.destroy = function() {};

    Scope.prototype.compile = function() {
      var criteria, defaults, relation;
      criteria = Scope.__super__.compile.apply(this, arguments);
      relation = this.relation;
      defaults = {};
      if (relation.through) {
        criteria.through({
          scope: this.owner[relation.through](),
          key: "wallId"
        });
      } else if (relation.cache) {
        defaults.id = {
          $in: this.owner.get(relation.cacheKey)
        };
        criteria.where(defaults);
      } else {
        defaults[relation.foreignKey] = {
          $in: this.owner.get('id')
        };
        criteria.where(defaults);
      }
      return criteria;
    };

    Scope.prototype._createEmbedded = function(criteria, args, options, callback) {
      var attributes, owner, record, records, relation, updates, _base, _base2, _i, _len, _ref,
        _this = this;
      owner = this.owner;
      relation = this.relation;
      criteria.mergeOptions(options);
      _ref = criteria.toCreate(), attributes = _ref.attributes, options = _ref.options;
      records = this._build(args, attributes, options);
      updates = {
        $pushAll: {}
      };
      if (Tower.Support.Object.isArray(records)) {
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
      } else {
        if ((_base2 = records.attributes)._id == null) {
          _base2._id = relation.klass().store().generateId();
        }
        delete records.attributes.id;
        updates["$pushAll"][relation.name] = [records.attributes];
      }
      return owner.store().update(updates, {
        id: owner.get('id')
      }, {}, function(error) {
        if (!error) {
          if (Tower.Support.Object.isArray(records)) {
            _this.owner.relation(_this.relation.name).records = _this.records.concat(records);
          } else {
            _this.owner.relation(_this.relation.name).records.push(records);
          }
          if (callback) return callback.call(_this, error, records);
        }
      });
    };

    Scope.prototype._createReferenced = function(criteria, args, options, callback) {
      var array, attributes, data, defaults, id, instantiate, inverseRelation, owner, relation, _name, _ref,
        _this = this;
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
        if (this.relation.foreignType) {
          data[_name = relation.foreignType] || (data[_name] = owner.constructor.name);
        }
      }
      criteria.where(data);
      criteria.mergeOptions(options);
      if (inverseRelation && inverseRelation.counterCacheKey) {
        defaults = {};
        defaults[inverseRelation.counterCacheKey] = 1;
        criteria.where(defaults);
      }
      instantiate = options.instantiate !== false;
      _ref = criteria.toCreate(), attributes = _ref.attributes, options = _ref.options;
      attributes = this._build(args, attributes, options);
      options.instantiate = true;
      return this._create(criteria, attributes, options, function(error, record) {
        var inc, push, updates;
        if (!error) {
          if (Tower.Support.Object.isArray(record)) {
            _this.owner.relation(_this.relation.name).records = _this.records.concat(record);
          } else {
            _this.owner.relation(_this.relation.name).records.push(record);
          }
          if (relation && (relation.cache || relation.counterCache)) {
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
            return owner.updateAttributes(updates, function(error) {
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

    Scope.prototype._serializeAttributes = function(attributes) {
      var name, relation, relations, target, value;
      if (attributes == null) attributes = {};
      target = Tower.constant(this.relation.targetClassName);
      relations = target.relations();
      for (name in relations) {
        relation = relations[name];
        if (attributes.hasOwnProperty(name)) {
          value = attributes[name];
          delete attributes[name];
          if (relation instanceof Tower.Model.Relation.BelongsTo) {
            attributes[relation.foreignKey] = value.id;
            if (relation.polymorphic) {
              attributes[relation.foreignType] = value.type;
            }
          }
        }
      }
      return attributes;
    };

    return Scope;

  })(HasMany.Scope);

  return HasMany;

})(Tower.Model.Relation);

module.exports = Tower.Model.Relation.HasMany;
