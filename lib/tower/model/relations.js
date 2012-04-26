
Tower.Model.Relations = {
  ClassMethods: {
    hasOne: function(name, options) {
      if (options == null) {
        options = {};
      }
      return this.relations()[name] = new Tower.Model.Relation.HasOne(this, name, options);
    },
    hasMany: function(name, options) {
      if (options == null) {
        options = {};
      }
      if (options.hasOwnProperty('through')) {
        return this.relations()[name] = new Tower.Model.Relation.HasManyThrough(this, name, options);
      } else {
        return this.relations()[name] = new Tower.Model.Relation.HasMany(this, name, options);
      }
    },
    belongsTo: function(name, options) {
      return this.relations()[name] = new Tower.Model.Relation.BelongsTo(this, name, options);
    },
    relations: function() {
      return this.metadata().relations;
    },
    relation: function(name) {
      var relation;
      relation = this.relations()[name];
      if (!relation) {
        throw new Error("Relation '" + name + "' does not exist on '" + this.name + "'");
      }
      return relation;
    }
  },
  InstanceMethods: {
    relation: function(name) {
      var _base;
      return (_base = this.relations)[name] || (_base[name] = this.constructor.relation(name).scoped(this));
    },
    buildRelation: function(name, attributes, callback) {
      return this.relation(name).build(attributes, callback);
    },
    createRelation: function(name, attributes, callback) {
      return this.relation(name).create(attributes, callback);
    },
    destroyRelations: function(callback) {
      var dependents, iterator, name, relation, relations,
        _this = this;
      relations = this.constructor.relations();
      dependents = [];
      for (name in relations) {
        relation = relations[name];
        if (relation.dependent === true || relation.dependent === 'destroy') {
          dependents.push(name);
        }
      }
      iterator = function(name, next) {
        return _this[name]().destroy(next);
      };
      return Tower.async(dependents, iterator, callback);
    }
  }
};

module.exports = Tower.Model.Relations;
