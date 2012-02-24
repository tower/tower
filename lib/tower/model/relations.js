
Tower.Model.Relations = {
  ClassMethods: {
    hasOne: function(name, options) {
      if (options == null) options = {};
      return this.relations()[name] = new Tower.Model.Relation.HasOne(this, name, options);
    },
    hasMany: function(name, options) {
      if (options == null) options = {};
      return this.relations()[name] = new Tower.Model.Relation.HasMany(this, name, options);
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
  relation: function(name) {
    return this.constructor.relation(name).scoped(this);
  },
  buildRelation: function(name, attributes, callback) {
    return this.relation(name).build(attributes, callback);
  },
  createRelation: function(name, attributes, callback) {
    return this.relation(name).create(attributes, callback);
  },
  destroyRelations: function() {}
};

module.exports = Tower.Model.Relations;
