var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Model.Relation = (function(_super) {

  __extends(Relation, _super);

  function Relation(owner, name, options, callback) {
    var key, value;
    if (options == null) options = {};
    for (key in options) {
      value = options[key];
      this[key] = value;
    }
    this.owner = owner;
    this.name = name;
    this.type = Tower.namespaced(options.type || Tower.Support.String.camelize(Tower.Support.String.singularize(name)));
    this.ownerType = Tower.namespaced(owner.name);
    this.dependent || (this.dependent = false);
    this.counterCache || (this.counterCache = false);
    if (!this.hasOwnProperty("cache")) this.cache = false;
    if (!this.hasOwnProperty("readOnly")) this.readOnly = false;
    if (!this.hasOwnProperty("validate")) this.validate = false;
    if (!this.hasOwnProperty("autoSave")) this.autoSave = false;
    if (!this.hasOwnProperty("touch")) this.touch = false;
    this.inverseOf || (this.inverseOf = void 0);
    this.polymorphic = options.hasOwnProperty("as") || !!options.polymorphic;
    if (!this.hasOwnProperty("default")) this["default"] = false;
    this.singularName = Tower.Support.String.camelize(owner.name, true);
    this.pluralName = Tower.Support.String.pluralize(owner.name);
    this.singularTargetName = Tower.Support.String.singularize(name);
    this.pluralTargetName = Tower.Support.String.pluralize(name);
    this.targetType = this.type;
    if (!this.foreignKey) {
      if (this.as) {
        this.foreignKey = "" + this.as + "Id";
      } else {
        this.foreignKey = "" + this.singularName + "Id";
      }
    }
    if (this.polymorphic) {
      this.foreignType || (this.foreignType = "" + this.as + "Type");
    }
    if (this.cache) {
      if (typeof this.cache === "string") {
        this.cacheKey = this.cache;
        this.cache = true;
      } else {
        this.cacheKey = this.singularTargetName + "Ids";
      }
      this.owner.field(this.cacheKey, {
        type: "Array",
        "default": []
      });
    }
    if (this.counterCache) {
      if (typeof this.counterCache === "string") {
        this.counterCacheKey = this.counterCache;
        this.counterCache = true;
      } else {
        this.counterCacheKey = "" + this.singularTargetName + "Count";
      }
      this.owner.field(this.counterCacheKey, {
        type: "Integer",
        "default": 0
      });
    }
    this.owner.prototype[name] = function() {
      return this.relation(name);
    };
  }

  Relation.prototype.scoped = function(record) {
    return new this.constructor.Scope({
      model: this.klass(),
      owner: record,
      relation: this
    });
  };

  Relation.prototype.targetKlass = function() {
    return Tower.constant(this.targetType);
  };

  Relation.prototype.klass = function() {
    return Tower.constant(this.type);
  };

  Relation.prototype.inverse = function() {
    var name, relation, relations;
    if (this._inverse) return this._inverse;
    relations = this.targetKlass().relations();
    if (this.inverseOf) {
      return relations[this.inverseOf];
    } else {
      for (name in relations) {
        relation = relations[name];
        if (relation.inverseOf === this.name) return relation;
      }
      for (name in relations) {
        relation = relations[name];
        if (relation.targetType === this.ownerType) return relation;
      }
    }
    return null;
  };

  Relation.Scope = (function(_super2) {

    __extends(Scope, _super2);

    Scope.prototype.isConstructable = function() {
      return !!!this.relation.polymorphic;
    };

    function Scope(options) {
      if (options == null) options = {};
      Scope.__super__.constructor.call(this, options);
      this.owner = options.owner;
      this.relation = options.relation;
    }

    Scope.prototype.clone = function() {
      return new this.constructor({
        model: this.model,
        criteria: this.criteria.clone(),
        owner: this.owner,
        relation: this.relation
      });
    };

    Scope.prototype.setInverseInstance = function(record) {
      var inverse;
      if (record && this.invertibleFor(record)) {
        inverse = record.relation(this.inverseReflectionFor(record).name);
        return inverse.target = owner;
      }
    };

    Scope.prototype.invertibleFor = function(record) {
      return true;
    };

    Scope.prototype.inverse = function(record) {};

    return Scope;

  })(Tower.Model.Scope);

  return Relation;

})(Tower.Class);

require('./relation/belongsTo');

require('./relation/hasMany');

require('./relation/hasOne');

module.exports = Tower.Model.Relation;
