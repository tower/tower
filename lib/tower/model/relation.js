var action, phase, _fn, _i, _j, _len, _len1, _ref, _ref1,
  __defineProperty = function(clazz, key, value) {
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
},
  _this = this;

Tower.Model.Relation = (function(_super) {
  var Relation;

  function Relation() {
    return Relation.__super__.constructor.apply(this, arguments);
  }

  Relation = __extends(Relation, _super);

  __defineProperty(Relation,  "init", function(owner, name, options) {
    var key, value;
    if (options == null) {
      options = {};
    }
    for (key in options) {
      value = options[key];
      this[key] = value;
    }
    this.owner = owner;
    this.name = name;
    return this.initialize(options);
  });

  __defineProperty(Relation,  "initialize", function(options) {
    var name, owner;
    owner = this.owner;
    name = this.name;
    this.type = options.type || Tower.Support.String.camelize(Tower.Support.String.singularize(name));
    this.ownerType = Tower.namespaced(owner.className());
    this.dependent || (this.dependent = false);
    this.counterCache || (this.counterCache = false);
    if (!this.hasOwnProperty("idCache")) {
      this.idCache = false;
    }
    if (!this.hasOwnProperty("readonly")) {
      this.readonly = false;
    }
    if (!this.hasOwnProperty("validate")) {
      this.validate = false;
    }
    if (!this.hasOwnProperty("autosave")) {
      this.autosave = false;
    }
    if (!this.hasOwnProperty("touch")) {
      this.touch = false;
    }
    this.inverseOf || (this.inverseOf = void 0);
    this.polymorphic = options.hasOwnProperty("as") || !!options.polymorphic;
    if (!this.hasOwnProperty("default")) {
      this["default"] = false;
    }
    this.singularName = Tower.Support.String.camelize(owner.className(), true);
    this.pluralName = Tower.Support.String.pluralize(owner.className());
    this.singularTargetName = Tower.Support.String.singularize(name);
    this.pluralTargetName = Tower.Support.String.pluralize(name);
    this.targetType = this.type;
    if (!this.foreignKey) {
      if (this.as) {
        this.foreignKey = "" + this.as + "Id";
      } else {
        if (this.className() === "BelongsTo") {
          this.foreignKey = "" + this.singularTargetName + "Id";
        } else {
          this.foreignKey = "" + this.singularName + "Id";
        }
      }
    }
    if (this.polymorphic) {
      this.foreignType || (this.foreignType = "" + this.as + "Type");
    }
    if (this.idCache) {
      if (typeof this.idCache === "string") {
        this.idCacheKey = this.idCache;
        this.idCache = true;
      } else {
        this.idCacheKey = "" + this.singularTargetName + "Ids";
      }
      this.owner.field(this.idCacheKey, {
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
    return (function(name) {
      var object;
      object = {};
      object[name] = function() {
        return this.relation(name);
      };
      return owner.reopen(object);
    })(name);
  });

  __defineProperty(Relation,  "scoped", function(record) {
    return new Tower.Model.Scope(new this.constructor.Cursor({
      model: this.klass(),
      owner: record,
      relation: this
    }));
  });

  __defineProperty(Relation,  "targetKlass", function() {
    return Tower.constant(this.targetType);
  });

  __defineProperty(Relation,  "klass", function() {
    return Tower.constant(this.type);
  });

  __defineProperty(Relation,  "inverse", function(type) {
    var name, relation, relations;
    if (this._inverse) {
      return this._inverse;
    }
    relations = this.targetKlass().relations();
    if (this.inverseOf) {
      return relations[this.inverseOf];
    } else {
      for (name in relations) {
        relation = relations[name];
        if (relation.inverseOf === this.name) {
          return relation;
        }
      }
      for (name in relations) {
        relation = relations[name];
        if (relation.targetType === this.ownerType) {
          return relation;
        }
      }
    }
    return null;
  });

  __defineProperty(Relation,  "_setForeignKey", function() {});

  __defineProperty(Relation,  "_setForeignType", function() {});

  return Relation;

})(Tower.Class);

Tower.Model.Relation.Cursor = (function(_super) {
  var Cursor;

  function Cursor() {
    return Cursor.__super__.constructor.apply(this, arguments);
  }

  Cursor = __extends(Cursor, _super);

  __defineProperty(Cursor,  "isConstructable", function() {
    return !!!this.relation.polymorphic;
  });

  __defineProperty(Cursor,  "init", function(options) {
    if (options == null) {
      options = {};
    }
    this._super.apply(this, arguments);
    this.owner = options.owner;
    this.relation = options.relation;
    return this.records = [];
  });

  __defineProperty(Cursor,  "clone", function() {
    return (new this.constructor({
      model: this.model,
      owner: this.owner,
      relation: this.relation,
      records: this.records.concat(),
      instantiate: this.instantiate
    })).merge(this);
  });

  __defineProperty(Cursor,  "setInverseInstance", function(record) {
    var inverse;
    if (record && this.invertibleFor(record)) {
      inverse = record.relation(this.inverseReflectionFor(record).name);
      return inverse.target = owner;
    }
  });

  __defineProperty(Cursor,  "invertibleFor", function(record) {
    return true;
  });

  __defineProperty(Cursor,  "inverse", function(record) {});

  __defineProperty(Cursor,  "_teardown", function() {
    return _.teardown(this, "relation", "records", "owner", "model", "criteria");
  });

  return Cursor;

})(Tower.Model.Cursor);

_ref = ["Before", "After"];
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  phase = _ref[_i];
  _ref1 = ["Create", "Update", "Destroy", "Find"];
  _fn = function(phase, action) {
    return Tower.Model.Relation.Cursor.prototype["_run" + phase + action + "CallbacksOnStore"] = function(done) {
      return this.store["run" + phase + action](this, done);
    };
  };
  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
    action = _ref1[_j];
    _fn(phase, action);
  }
}

require('./relation/belongsTo');

require('./relation/hasMany');

require('./relation/hasManyThrough');

require('./relation/hasOne');

module.exports = Tower.Model.Relation;
