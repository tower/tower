# Tower's Memory Store
# https://github.com/neo4j/neo4js
# npm install neo4js
# In order to really do neo4j, the Store.Neo4j will have to distinguish
# between Relationship and Node, and so modify Tower.Model accordingly.  Need to think about...
# @todo
class Tower.Store.Neo4j extends Tower.Store

require './neo4j/configuration'
require './neo4j/database'
require './neo4j/persistence'

Tower.Store.Neo4j.include Tower.Store.Neo4j.Configuration
Tower.Store.Neo4j.include Tower.Store.Neo4j.Database
Tower.Store.Neo4j.include Tower.Store.Neo4j.Persistence

module.exports = Tower.Store.Neo4j
