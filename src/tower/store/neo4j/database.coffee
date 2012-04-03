Tower.Store.Neo4j.Database =
  ClassMethods:
    initialize: (callback) ->
      @database ||= new @lib().GraphDatabase("http://localhost:7474")
      callback.call @, @database if callback

  database: ->
    @constructor.database

module.exports = Tower.Store.Neo4j.Database
