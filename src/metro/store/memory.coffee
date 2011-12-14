class Metro.Store.Memory extends Metro.Store
  constructor: (options) ->
    super(options)
    
    @records  = {}
    @lastId   = 0
    
require './memory/finders'
require './memory/persistence'
require './memory/serialization'
    
Metro.Store.Memory.include Metro.Store.Memory.Finders
Metro.Store.Memory.include Metro.Store.Memory.Persistence
Metro.Store.Memory.include Metro.Store.Memory.Serialization
  
module.exports = Metro.Store.Memory
