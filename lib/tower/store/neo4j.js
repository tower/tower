var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Store.Neo4j = (function() {

  __extends(Neo4j, Tower.Store);

  function Neo4j() {
    Neo4j.__super__.constructor.apply(this, arguments);
  }

  return Neo4j;

})();

require('./neo4j/configuration');

require('./neo4j/database');

require('./neo4j/persistence');

Tower.Store.Neo4j.include(Tower.Store.Neo4j.Configuration);

Tower.Store.Neo4j.include(Tower.Store.Neo4j.Database);

Tower.Store.Neo4j.include(Tower.Store.Neo4j.Persistence);

module.exports = Tower.Store.Neo4j;
