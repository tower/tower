var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Model.Relation.HasAndBelongsToMany = (function() {

  __extends(HasAndBelongsToMany, Tower.Model.Relation);

  function HasAndBelongsToMany(owner, name, options) {
    if (options == null) options = {};
    HasAndBelongsToMany.__super__.constructor.call(this, owner, name, options);
    this.polymorphic = options.hasOwnProperty("as");
    owner.prototype[name] = function() {
      return this.relation(name);
    };
    if (options.foreignKey) {
      this.foreignKey = options.foreignKey;
    } else if (this.as) {
      this.foreignKey = "" + this.as + "Ids";
    } else {
      this.foreignKey = Tower.Support.String.camelize("" + owner.name + "Ids", true);
    }
  }

  HasAndBelongsToMany.Scope = (function() {

    __extends(Scope, HasAndBelongsToMany.Scope);

    function Scope(options) {
      var defaults, id;
      if (options == null) options = {};
      Scope.__super__.constructor.call(this, options);
      id = this.owner.get("id");
      if (this.foreignKey) {
        defaults = {};
        if (id !== void 0) defaults[this.foreignKey] = [id];
        this.criteria.where(defaults);
      }
    }

    Scope.prototype.create = function(attributes, callback) {
      var relation, self;
      self = this;
      relation = this.relation;
      attributes = this._serializeAttributes(attributes);
      console.log(this.criteria);
      return this.store.create(Tower.Support.Object.extend(this.criteria.query, attributes), this.criteria.options, function(error, record) {
        var updates;
        console.log("CREATE");
        console.log(arguments);
        if (!error) {
          if (relation && false) {
            updates = {};
            updates[relation.foreignKey] = record.get("id");
            console.log("updates");
            console.log(updates);
            return self.owner.updateAttributes({
              "$push": updates
            }, callback);
          } else {
            if (callback) return callback.call(this, error, record);
          }
        } else {
          if (callback) return callback.call(this, error, record);
        }
      });
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

    Scope.prototype.hasCachedCounter = function() {};

    return Scope;

  })();

  return HasAndBelongsToMany;

})();

module.exports = Tower.Model.Relation.HasMany;
