Tower.Store.Neo4j.Database =
  ClassMethods:
    initialize: (callback) ->
      return callback.call @, @database if @initialized
      
      @initialized  = true
      neo4j         = @lib()
      try
        @database     = new neo4j.Database('http://localhost:7474')
        callback.call(@, null, @database)
      catch error
        callback.call(@, error)

  database: ->
    @constructor.database

module.exports = Tower.Store.Neo4j.Database
