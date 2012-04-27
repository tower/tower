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

    @records  = {}
    @lastId   = 1
    
    Ember.set @, 'transaction', new Tower.Store.Transaction

  clean: ->
    @records  = {}
    @lastId   = 1
    
  commit: ->
    transaction = Ember.get @, 'transaction'
    transaction.commit()

require './memory/finders'
require './memory/persistence'
require './memory/serialization'

Tower.Store.Memory.include Tower.Store.Memory.Finders
Tower.Store.Memory.include Tower.Store.Memory.Persistence
Tower.Store.Memory.include Tower.Store.Memory.Serialization

module.exports = Tower.Store.Memory
