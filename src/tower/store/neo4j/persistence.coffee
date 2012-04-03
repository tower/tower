Tower.Store.Neo4j.Persistence =
  create: (attributes, options, callback) ->
    @_createNode attributes, callback

  update: (updates, query, options, callback) ->
    @

  delete: (query, options, callback) ->
    @

  _createNode: (attributes, options, callback) ->
    promise = @database.node(attributes)

    if callback
      promise.then (node) ->
        callback.call @, node

    promise

  _createRelationship: (from, to, name, attributes, options, callback) ->
    promise = @database.rel(from, name, to, attributes)

    if callback
      promise.then (node) ->
        callback.call @, node

    promise

module.exports = Tower.Store.Neo4j.Persistence
