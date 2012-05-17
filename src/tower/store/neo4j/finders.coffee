# @module
Tower.Store.Neo4j.Finders =
  # @see Tower.Store#find
  find: (criteria, callback) ->
    conditions  = criteria.conditions()
   
    @database().getReferenceNode (error, node) =>
      node.traverse {}, (error, nodes) =>
        callback.call(@, error, nodes) if callback
        
    undefined

  # @see Tower.Store#findOne
  findOne: (criteria, callback) ->

  # @see Tower.Store#count
  count: (criteria, callback) ->

  # @see Tower.Store#exists
  exists: (criteria, callback) ->
    
module.exports = Tower.Store.Neo4j.Finders
