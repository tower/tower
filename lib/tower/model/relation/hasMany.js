var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Model.Relation.HasMany = (function() {

  __extends(HasMany, Tower.Model.Relation);

  function HasMany() {
    HasMany.__super__.constructor.apply(this, arguments);
  }

  HasMany.Scope = (function() {

    __extends(Scope, HasMany.Scope);

    function Scope() {
      Scope.__super__.constructor.apply(this, arguments);
    }

    Scope.prototype.create = function() {
      var array, attributes, callback, criteria, data, defaults, id, instantiate, inverseRelation, options, relation, _name, _ref, _ref2;
      var _this = this;
      if (!this.owner.isPersisted()) {
        throw new Error("You cannot call create unless the parent is saved");
      }
      relation = this.relation;
      inverseRelation = relation.inverse();
      _ref = this._extractArgs(arguments, {
        data: true
      }), criteria = _ref.criteria, data = _ref.data, options = _ref.options, callback = _ref.callback;
      id = this.owner.get("id");
      if (inverseRelation && inverseRelation.cache) {
        array = data[inverseRelation.cacheKey] || [];
        if (array.indexOf(id) === -1) array.push(id);
        data[inverseRelation.cacheKey] = array;
      } else if (relation.foreignKey) {
        if (id !== void 0) data[relation.foreignKey] = id;
        if (this.relation.foreignType) {
          data[_name = relation.foreignType] || (data[_name] = this.owner.constructor.name);
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
      return this._create(criteria, attributes, options, function(error, record) {
        var inc, push, updates;
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
            return _this.owner.updateAttributes(updates, function(error) {
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

    Scope.prototype.update = function() {};

    Scope.prototype.destroy = function() {};

    Scope.prototype.concat = function() {};

    Scope.prototype._serializeAttributes = function(attributes) {
      var name, relation, target, value, _ref;
      if (attributes == null) attributes = {};
      target = Tower.constant(this.relation.targetClassName);
      _ref = target.relations();
      for (name in _ref) {
        relation = _ref[name];
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

    return Scope;

  })();

  return HasMany;

})();

module.exports = Tower.Model.Relation.HasMany;
