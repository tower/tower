var _,
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) {
    if (typeof parent.__extend == 'function') return parent.__extend(child);
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if (typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

_ = Tower._;

Tower.ModelRelation = (function(_super) {
  var ModelRelation;

  function ModelRelation() {
    return ModelRelation.__super__.constructor.apply(this, arguments);
  }

  ModelRelation = __extends(ModelRelation, _super);

  ModelRelation.reopen({
    isCollection: false,
    init: function(owner, name, options) {
      var key, value;
      if (options == null) {
        options = {};
      }
      this._super();
      for (key in options) {
        value = options[key];
        this[key] = value;
      }
      this.owner = owner;
      this.name = name;
      return this.initialize(options);
    },
    initialize: function(options) {
      var className, name, owner;
      owner = this.owner;
      name = this.name;
      className = owner.className();
      this.type = Tower.namespaced(options.type || _.camelize(_.singularize(name)));
      this.ownerType = Tower.namespaced(className);
      this.dependent || (this.dependent = false);
      this.counterCache || (this.counterCache = false);
      if (!this.hasOwnProperty('idCache')) {
        this.idCache = false;
      }
      if (!this.hasOwnProperty('readonly')) {
        this.readonly = false;
      }
      if (!this.hasOwnProperty('validate')) {
        this.validate = this.autosave === true;
      }
      if (!this.hasOwnProperty('touch')) {
        this.touch = false;
      }
      this.inverseOf || (this.inverseOf = void 0);
      this.polymorphic = options.hasOwnProperty('as') || !!options.polymorphic;
      if (!this.hasOwnProperty('default')) {
        this["default"] = false;
      }
      this.singularName = _.camelize(className, true);
      this.pluralName = _.pluralize(className);
      this.singularTargetName = _.singularize(name);
      this.pluralTargetName = _.pluralize(name);
      this.targetType = this.type;
      this.primaryKey = 'id';
      if (!this.hasOwnProperty('autobuild')) {
        this.autobuild = false;
      }
      if (!this.foreignKey) {
        if (this.as) {
          this.foreignKey = "" + this.as + "Id";
        } else {
          if (this.className().match('BelongsTo')) {
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
        if (typeof this.idCache === 'string') {
          this.idCacheKey = this.idCache;
          this.idCache = true;
        } else {
          this.idCacheKey = "" + this.singularTargetName + "Ids";
        }
        this.owner.field(this.idCacheKey, {
          type: 'Array',
          "default": []
        });
      }
      if (this.counterCache) {
        if (typeof this.counterCache === 'string') {
          this.counterCacheKey = this.counterCache;
          this.counterCache = true;
        } else {
          this.counterCacheKey = "" + this.singularTargetName + "Count";
        }
        this.owner.field(this.counterCacheKey, {
          type: 'Integer',
          "default": 0
        });
      }
      this._defineRelation(name);
      return this.owner._addAutosaveAssociationCallbacks(this);
    },
    _defineRelation: function(name) {
      var association, isHasMany, object;
      object = {};
      isHasMany = !this.className().match(/HasOne|BelongsTo/);
      this.relationType = isHasMany ? 'collection' : 'singular';
      object[name + 'AssociationScope'] = Ember.computed(function(key) {
        return this.constructor.relation(name).scoped(this);
      }).cacheable();
      association = this;
      if (isHasMany) {
        object[name] = Ember.computed(function(key, value) {
          if (arguments.length === 2) {
            return this._setHasManyAssociation(key, value, association);
          } else {
            return this._getHasManyAssociation(name);
          }
        }).property('data').cacheable();
      } else {
        if (this.className().match('BelongsTo')) {
          object[name] = Ember.computed(function(key, value) {
            if (arguments.length === 2) {
              return this._setBelongsToAssociation(key, value, association);
            } else {
              return this._getBelongsToAssociation(key);
            }
          }).property('data', "" + name + "Id").cacheable();
        } else {
          object[name] = Ember.computed(function(key, value) {
            if (arguments.length === 2) {
              return this._setHasOneAssociation(key, value, association);
            } else {
              return this._getHasOneAssociation(key);
            }
          }).property('data').cacheable();
        }
      }
      return this.owner.reopen(object);
    },
    scoped: function(record) {
      var attributes, cursor, klass, polymorphicBelongsTo, type;
      cursor = Tower[this.constructor.className() + 'Cursor'].make();
      attributes = {
        owner: record,
        relation: this
      };
      polymorphicBelongsTo = this.polymorphic && this.className().match(/BelongsTo/);
      if (!polymorphicBelongsTo) {
        attributes.model = this.klass();
      }
      cursor.make(attributes);
      klass = (function() {
        try {
          return this.targetKlass();
        } catch (_error) {}
      }).call(this);
      if (polymorphicBelongsTo) {
        type = record.get(this.foreignType);
        if (type != null) {
          cursor.model = Tower.constant(type);
          cursor.store = cursor.model.store();
        }
      } else {
        if (klass && klass.shouldIncludeTypeInScope()) {
          cursor.where({
            type: klass.className()
          });
        }
      }
      return new Tower.ModelScope(cursor);
    },
    targetKlass: function() {
      return Tower.constant(this.targetType);
    },
    klass: function() {
      return Tower.constant(this.type);
    },
    inverse: function(type) {
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
    },
    _setForeignKey: function() {},
    _setForeignType: function() {}
  });

  return ModelRelation;

})(Tower.Class);

Tower.ModelRelationCursorMixin = Ember.Mixin.create({
  isConstructable: function() {
    return !!!this.relation.polymorphic;
  },
  isLoaded: false,
  clone: function(cloneContent) {
    var clone, content;
    if (cloneContent == null) {
      cloneContent = true;
    }
    clone = this.constructor.make();
    if (cloneContent) {
      content = Ember.get(this, 'content') || Ember.A([]);
      if (content) {
        clone.setProperties({
          content: content
        });
      }
    }
    if (!content) {
      clone.setProperties({
        content: Ember.A([])
      });
    }
    clone.make({
      model: this.model,
      owner: this.owner,
      relation: this.relation,
      instantiate: this.instantiate
    });
    clone.merge(this);
    return clone;
  },
  clonePrototype: function() {
    var clone;
    clone = this.concat();
    clone.isCursor = true;
    return Tower.ModelRelationCursorMixin.apply(clone);
  },
  load: function(records) {
    var owner, record, relation, _i, _len;
    owner = this.owner;
    relation = this.relation.inverse();
    if (!relation) {
      throw new Error("Inverse relation has not been defined for `" + (this.relation.owner.className()) + "." + (_.camelize(this.relation.className(), true)) + "('" + this.relation.name + "')`");
    }
    for (_i = 0, _len = records.length; _i < _len; _i++) {
      record = records[_i];
      record.set(relation.name, owner);
    }
    return this._super(records);
  },
  reset: function() {
    var owner, records, relation;
    owner = this.owner;
    relation = this.relation.inverse();
    records = Ember.get(this, 'content');
    return this._super();
  },
  setInverseInstance: function(record) {
    var inverse;
    if (record && this.invertibleFor(record)) {
      inverse = record.relation(this.inverseReflectionFor(record).name);
      return inverse.target = owner;
    }
  },
  invertibleFor: function(record) {
    return true;
  },
  inverse: function(record) {},
  _teardown: function() {
    return _.teardown(this, 'relation', 'records', 'owner', 'model', 'criteria');
  },
  addToTarget: function(record) {},
  removeFromTarget: function(record) {
    return this.removed().push(record);
  },
  removed: function() {
    return this._removed || (this._removed = []);
  }
});

Tower.ModelRelationCursor = (function(_super) {
  var ModelRelationCursor;

  function ModelRelationCursor() {
    return ModelRelationCursor.__super__.constructor.apply(this, arguments);
  }

  ModelRelationCursor = __extends(ModelRelationCursor, _super);

  ModelRelationCursor.reopenClass({
    makeOld: function() {
      var array;
      array = [];
      array.isCursor = true;
      return Tower.ModelRelationCursorMixin.apply(array);
    }
  });

  ModelRelationCursor.include(Tower.ModelRelationCursorMixin);

  return ModelRelationCursor;

})(Tower.ModelCursor);

require('./relation/belongsTo');

require('./relation/hasMany');

require('./relation/hasManyThrough');

require('./relation/hasOne');

module.exports = Tower.ModelRelation;
