Tower.Store.Neo4j.Persistence =
  insert: (criteria, callback) ->
    if criteria.relationship
      @_createRelationship(criteria, callback)
    else
      @_createNode(criteria, callback)

  _createNode: (criteria, callback) ->
    attributes = criteria.data[0]

    @database().node attributes, (error, node) =>
      unless error
        record = @serializeModel(node)
        record.set('isNew', !!error)
        console.log node.getId()
        record.set('id', node.getId())

      callback.call @, error, record if callback

    undefined

  _createRelationship: (criteria, callback) ->
    attributes = criteria.data[0]

    @database().relationship attributes, (error, relationship) =>
      relationship = @serializeModel(relationship) unless error
      callback.call @, error, relationship if callback
      relationship

  update: (criteria, callback) ->

  destroy: (criteria, callback) ->

module.exports = Tower.Store.Neo4j.Persistence
