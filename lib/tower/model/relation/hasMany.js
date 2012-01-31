var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Model.Relation.HasMany = (function() {

  __extends(HasMany, Tower.Model.Relation);

  function HasMany(owner, name, options) {
    if (options == null) options = {};
    HasMany.__super__.constructor.call(this, owner, name, options);
  }

  HasMany.Scope = (function() {

    __extends(Scope, HasMany.Scope);

    function Scope() {
      Scope.__super__.constructor.apply(this, arguments);
    }

    Scope.prototype.create = function() {
      var array, attributes, callback, criteria, id, options, relation, _name, _ref;
      var _this = this;
      if (!this.owner.isPersisted()) {
        throw new Error("You cannot call create unless the parent is saved");
      }
      relation = this.relation;
      _ref = this._extractArgs(arguments, {
        attributes: true
      }), criteria = _ref.criteria, attributes = _ref.attributes, options = _ref.options, callback = _ref.callback;
      id = this.owner.get("id");
      if (relation.foreignKey) {
        if (id !== void 0) attributes[relation.foreignKey] = id;
        if (this.relation.foreignType) {
          attributes[_name = relation.foreignType] || (attributes[_name] = this.owner.constructor.name);
        }
      }
      if (relation.cacheKey) {
        array = attributes[relation.cacheKey] || [];
        if (array.indexOf(id) === -1) array.push(id);
        attributes[relation.cacheKey] = array;
      }
      criteria.mergeAttributes(attributes);
      criteria.mergeOptions(options);
      return this._create(criteria.toCreate(), criteria.options, function(error, record) {
        var inc, push;
        if (!error) {
          if (relation && (relation.cache || relation.counterCache)) {
            push = {};
            if (relation.cache) push[relation.cacheKey] = record.get("id");
            inc = {};
            inc[relation.counterCacheKey] = 1;
            return _this.owner.updateAttributes({
              "$push": push,
              "$inc": inc
            }, callback);
          } else {
            if (callback) return callback.call(_this, error, record);
          }
        } else {
          if (callback) return callback.call(_this, error, record);
        }
      });
    };

    Scope.prototype.update = function() {
      var attributes, callback, criteria, options, _ref;
      _ref = this._extractArgs(arguments, {
        attributes: true
      }), criteria = _ref.criteria, attributes = _ref.attributes, options = _ref.options, callback = _ref.callback;
      if (!this.owner.isPersisted()) {
        throw new Error("You cannot call update unless the parent is saved");
      }
    };

    Scope.prototype.destroy = function() {};

    Scope.prototype.concat = function() {};

    Scope.prototype.createRecord = function(attributes, options, raise, callback) {
      var object, result, _i, _len;
      if (raise == null) raise = false;
      if (!this.owner.isPersisted()) {
        throw new Error("You cannot call create unless the parent is saved");
      }
      if (_.isArray(attributes)) {
        result = [];
        for (_i = 0, _len = attributes.length; _i < _len; _i++) {
          object = attributes[_i];
          result.push(this.createRecord(object, options, raise, callback));
        }
        return result;
      } else {
        return this.transaction(function() {
          var _this = this;
          return this.addToTarget(this.buildRecord(attributes, options), function(record) {
            if (callback) callback.call(_this, null, record);
            return _this.insertRecord(record, true, raise);
          });
        });
      }
    };

    Scope.prototype.replace = function(otherArray) {
      var _this = this;
      if (this.owner.isNew()) {
        return this.replaceRecords(otherArray, originalTarget);
      } else {
        return this.transaction(function() {
          return _this.replaceRecords(otherArray, originalTarget);
        });
      }
    };

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
