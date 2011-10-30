class Persistence
  #constructor: -> super
  
  @create: (attrs) ->
    record = new @(attrs)
    @store().create(record)
    record
    
  @update: ->
  
  @deleteAll: ->
    @store().clear()
    
  isNew: ->
    !!!attributes.id
    
  save: (options) ->
    runCallbacks ->
      
    
  update: (options) ->
    
  reset: ->
    
  @alias "reload", "reset"
  
  updateAttribute: (name, value) ->
    
  updateAttributes: (attributes) ->
    
  increment: (attribute, by = 1) ->
    
  decrement: (attribute, by = 1) ->
    
  reload: ->
    
  delete: ->
    
  destroy: ->
  
  createOrUpdate: ->
  
  isDestroyed: ->
    
  isPersisted: ->
  
  
module.exports = Persistence
