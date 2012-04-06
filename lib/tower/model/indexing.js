
Tower.Model.Indexing = {
  ClassMethods: {
    index: function(name, options) {
      if (options == null) options = {};
      this.store().addIndex(name);
      return this.indexes()[name] = options;
    },
    indexes: function() {
      return this.metadata().indexes;
    }
  }
};

module.exports = Tower.Model.Indexing;
