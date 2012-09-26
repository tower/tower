var _;

_ = Tower._;

Tower.ModelIndexing = {
  ClassMethods: {
    index: function(name, options) {
      if (options == null) {
        options = {};
      }
      this.store().addIndex(name);
      return this.indexes()[name] = options;
    },
    indexes: function() {
      return this.metadata().indexes;
    }
  }
};

module.exports = Tower.ModelIndexing;
