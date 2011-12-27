
Tower.Model.Relations = {
  ClassMethods: {
    hasOne: function(name, options) {
      var relationClass;
      if (options && options.hasOwnProperty("through")) {
        relationClass = Tower.Model.Relation.HasOneThrough;
      } else {
        relationClass = Tower.Model.Relation.HasOne;
      }
      return this.relations()[name] = new relationClass(this, name, options);
    },
    hasMany: function(name, options) {
      var relationClass;
      if (options && options.hasOwnProperty("through")) {
        relationClass = Tower.Model.Relation.HasManyThrough;
      } else {
        relationClass = Tower.Model.Relation.HasMany;
      }
      return this.relations()[name] = new relationClass(this, name, options);
    },
    belongsTo: function(name, options) {
      return this.relations()[name] = new Tower.Model.Relation.BelongsTo(this, name, options);
    },
    relations: function() {
      return this._relations || (this._relations = {});
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
      return this.constructor.relation(name).scoped(this);
    },
    buildRelation: function(name, attributes, callback) {
      return this.relation(name).build(attributes, callback);
    },
    createRelation: function(name, attributes, callback) {
      return this.relation(name).create(attributes, callback);
    }
  }
};

module.exports = Tower.Model.Relations;
