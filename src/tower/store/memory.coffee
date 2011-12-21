class Tower.Store.Memory extends Tower.Store
  constructor: (options) ->
    super(options)
    
    @records  = {}
    @lastId   = 0
    
require './memory/finders'
require './memory/persistence'
require './memory/serialization'
    
Tower.Store.Memory.include Tower.Store.Memory.Finders
Tower.Store.Memory.include Tower.Store.Memory.Persistence
Tower.Store.Memory.include Tower.Store.Memory.Serialization
  
module.exports = Tower.Store.Memory
