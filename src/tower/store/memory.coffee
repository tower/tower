class Tower.Store.Memory extends Tower.Store
  @stores: ->
    @_stores ||= []
    
  @clear: ->
    stores = @stores()
    
    for store in stores
      store.clear()
      
    @_stores.length = 0
    @_stores
  
  constructor: (options) ->
    super(options)
    
    @constructor.stores().push @
    
    @records  = {}
    @lastId   = 0
    
require './memory/finders'
require './memory/persistence'
require './memory/serialization'

Tower.Store.Memory.include Tower.Store.Memory.Finders
Tower.Store.Memory.include Tower.Store.Memory.Persistence
Tower.Store.Memory.include Tower.Store.Memory.Serialization

module.exports = Tower.Store.Memory
