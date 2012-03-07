
Tower.Store.Neo4j.Database = {
  ClassMethods: {
    initialize: function(callback) {
      this.database || (this.database = new this.lib().GraphDatabase("http://localhost:7474"));
      if (callback) return callback.call(this, this.database);
    }
  },
  database: function() {
    return this.constructor.database;
  }
};

module.exports = Tower.Store.Neo4j.Database;
