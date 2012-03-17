var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Model.Relation.HasMany = (function(_super) {

  __extends(HasMany, _super);

  function HasMany() {
    HasMany.__super__.constructor.apply(this, arguments);
  }

  HasMany.Scope = (function(_super2) {

    __extends(Scope, _super2);

    function Scope() {
      Scope.__super__.constructor.apply(this, arguments);
    }

    Scope.prototype.create = function() {
      var array, attributes, callback, criteria, data, defaults, id, instantiate, inverseRelation, options, owner, relation, updates, _name, _ref, _ref2,
        _this = this;
      owner = this.owner;
      if (!this.owner.isPersisted()) {
        throw new Error("You cannot call create unless the parent is saved");
      }
      relation = this.relation;
      inverseRelation = relation.inverse();
      _ref = this._extractArgs(arguments, {
        data: true
      }), criteria = _ref.criteria, data = _ref.data, options = _ref.options, callback = _ref.callback;
      id = owner.get("id");
      if (relation.embed) {} else if (inverseRelation && inverseRelation.cache) {
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
      _ref2 = criteria.toCreate(), attributes = _ref2.attributes, options = _ref2.options;
      options.instantiate = true;
      if (relation.embed && owner.store().supports("embed")) {
        if (attributes._id == null) attributes._id = owner.store().generateId();
        updates = {
          $pushAll: {}
        };
        updates["$pushAll"][relation.name] = [attributes];
        return owner.store().update(updates, {
          id: owner.get('id')
        }, {}, function(error) {
          return owner.store().findOne({
            id: owner.get("id")
          }, {
            raw: true
          }, function(error, o) {
            if (callback) return callback.call(_this, error, record);
          });
        });
      } else {
        return this._create(criteria, attributes, options, function(error, record) {
          var inc, push;
          if (!error) {
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
      }
    };

    Scope.prototype.update = function() {};

    Scope.prototype.destroy = function() {};

    Scope.prototype.concat = function() {};

    Scope.prototype.toCriteria = function() {
      var criteria, defaults, relation;
      criteria = Scope.__super__.toCriteria.apply(this, arguments);
      relation = this.relation;
      if (relation.cache) {
        defaults = {};
        defaults[relation.foreignKey + "s"] = {
          $in: [this.owner.get("id")]
        };
        criteria.where(defaults);
      }
      return criteria;
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
