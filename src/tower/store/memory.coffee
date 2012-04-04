class Tower.Store.Memory extends Tower.Store
  @stores: ->
    @_stores ||= []

  @clean: (callback) ->
    stores = @stores()
    
    store.clean() for store in stores
    
    callback()

  constructor: (options) ->
    super(options)
    @initialize()

  initialize: ->
    @constructor.stores().push @

    @records  = {}
    @lastId   = 0
    
  clean: ->
    @records  = {}
    @lastId   = 0

require './memory/finders'
require './memory/persistence'
require './memory/serialization'

Tower.Store.Memory.include Tower.Store.Memory.Finders
Tower.Store.Memory.include Tower.Store.Memory.Persistence
Tower.Store.Memory.include Tower.Store.Memory.Serialization

module.exports = Tower.Store.Memory
