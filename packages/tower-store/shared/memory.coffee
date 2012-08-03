class Tower.StoreMemory extends Tower.Store
  @stores: ->
    @_stores ||= []

  @clean: (callback) ->
    stores = @stores()

    store.clean() for store in stores

    callback() if callback

  init: (options) ->
    @_super arguments...

    @initialize()

  initialize: ->
    @constructor.stores().push @

    @records  = Ember.Map.create()
    @lastId   = 1

    Ember.set(@, 'batch', new Tower.StoreBatch)

  clean: ->
    @records  = Ember.Map.create()

  commit: ->
    Ember.get(@, 'batch').commit()

require './memory/calculations'
require './memory/finders'
require './memory/persistence'
require './memory/serialization'

Tower.StoreMemory.include Tower.StoreMemoryCalculations
Tower.StoreMemory.include Tower.StoreMemoryFinders
Tower.StoreMemory.include Tower.StoreMemoryPersistence
Tower.StoreMemory.include Tower.StoreMemorySerialization

module.exports = Tower.StoreMemory
