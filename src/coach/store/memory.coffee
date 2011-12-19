class Coach.Store.Memory extends Coach.Store
  constructor: (options) ->
    super(options)
    
    @records  = {}
    @lastId   = 0
    
require './memory/finders'
require './memory/persistence'
require './memory/serialization'
    
Coach.Store.Memory.include Coach.Store.Memory.Finders
Coach.Store.Memory.include Coach.Store.Memory.Persistence
Coach.Store.Memory.include Coach.Store.Memory.Serialization
  
module.exports = Coach.Store.Memory
