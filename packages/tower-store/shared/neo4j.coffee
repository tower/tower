# https://github.com/neo4j/neo4js
# npm install neo4js
# In order to really do neo4j, the Store.Neo4j will have to distinguish
# between Relationship and Node, and so modify Tower.Model accordingly.  Need to think about...
# @todo
# hasMany without a thru gives node to node with implicit relationship
# hasMany with through gives you node to node with explicity relationship class
class Tower.StoreNeo4j extends Tower.Store

require './neo4j/configuration'
require './neo4j/database'
require './neo4j/finders'
require './neo4j/persistence'

Tower.StoreNeo4j.include Tower.StoreNeo4jConfiguration
Tower.StoreNeo4j.include Tower.StoreNeo4jDatabase
Tower.StoreNeo4j.include Tower.StoreNeo4jFinders
Tower.StoreNeo4j.include Tower.StoreNeo4jPersistence

module.exports = Tower.StoreNeo4j
