
Tower.StoreNeo4jDatabase = {
  ClassMethods: {
    initialize: function(callback) {
      var neo4j;
      if (this.initialized) {
        return callback.call(this, this.database);
      }
      this.initialized = true;
      neo4j = this.lib();
      try {
        this.database = new neo4j.Database('http://localhost:7474');
        return callback.call(this, null, this.database);
      } catch (error) {
        return callback.call(this, error);
      }
    }
  },
  database: function() {
    return this.constructor.database;
  }
};

module.exports = Tower.StoreNeo4jDatabase;
