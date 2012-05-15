var __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) {
    if (typeof parent.__extend == 'function') return parent.__extend(child);
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if (typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.Store.Neo4j = (function(_super) {
  var Neo4j;

  function Neo4j() {
    return Neo4j.__super__.constructor.apply(this, arguments);
  }

  Neo4j = __extends(Neo4j, _super);

  return Neo4j;

})(Tower.Store);

require('./neo4j/configuration');

require('./neo4j/database');

require('./neo4j/persistence');

Tower.Store.Neo4j.include(Tower.Store.Neo4j.Configuration);

Tower.Store.Neo4j.include(Tower.Store.Neo4j.Database);

Tower.Store.Neo4j.include(Tower.Store.Neo4j.Persistence);

module.exports = Tower.Store.Neo4j;
