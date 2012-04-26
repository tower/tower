
Tower.Store.Neo4j.Configuration = {
  ClassMethods: {
    lib: function() {
      return require('neo4js');
    }
  }
};

module.exports = Tower.Store.Neo4j.Configuration;
