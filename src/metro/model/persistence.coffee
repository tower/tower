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
    
  save: (options) ->
    
  update: (options) ->
    
  reset: ->
    
  @alias "reload", "reset"
  
module.exports = Persistence
