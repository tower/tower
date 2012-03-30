
Tower.Model.Indexing = {
  ClassMethods: {
    index: function(key, options) {
      if (options == null) options = {};
      return this.metadata().indices[key] = options;
    }
  }
};

module.exports = Tower.Model.Indexing;
