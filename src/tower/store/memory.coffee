class Tower.Store.Memory extends Tower.Store
  @stores: ->
    @_stores ||= []

  @clean: (callback) ->
    stores = @stores()

    store.clean() for store in stores

    callback()

  init: (options) ->
    @_super arguments...

    @initialize()

  initialize: ->
    @constructor.stores().push @

    @records  = Ember.Map.create()
    @lastId   = 1

    Ember.set(@, 'batch', new Tower.Store.Batch)

  clean: ->
    @records  = Ember.Map.create()
    @lastId   = 1

  commit: ->
    Ember.get(@, 'batch').commit()

require './memory/finders'
require './memory/persistence'
require './memory/serialization'

Tower.Store.Memory.include Tower.Store.Memory.Finders
Tower.Store.Memory.include Tower.Store.Memory.Persistence
Tower.Store.Memory.include Tower.Store.Memory.Serialization

module.exports = Tower.Store.Memory
