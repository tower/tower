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

Tower.StoreNeo4j = (function(_super) {
  var StoreNeo4j;

  function StoreNeo4j() {
    return StoreNeo4j.__super__.constructor.apply(this, arguments);
  }

  StoreNeo4j = __extends(StoreNeo4j, _super);

  return StoreNeo4j;

})(Tower.Store);

require('./neo4j/configuration');

require('./neo4j/database');

require('./neo4j/finders');

require('./neo4j/persistence');

Tower.StoreNeo4j.include(Tower.StoreNeo4jConfiguration);

Tower.StoreNeo4j.include(Tower.StoreNeo4jDatabase);

Tower.StoreNeo4j.include(Tower.StoreNeo4jFinders);

Tower.StoreNeo4j.include(Tower.StoreNeo4jPersistence);

module.exports = Tower.StoreNeo4j;
