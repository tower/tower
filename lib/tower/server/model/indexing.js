
Tower.Model.Indexing = {
  ClassMethods: {
    index: function(key, options) {
      if (options == null) options = {};
      return this.metadata().indexes[key] = options;
    }
  }
};

module.exports = Tower.Model.Indexing;
