class Persistence
  #constructor: -> super
  
  @create: (attrs) ->
    record = new @(attrs)
    @store().create(record)
    record
    
  save: (options) ->
    
  update: (options) ->
    
  @deleteAll: ->
    @store().clear()
  
module.exports = Persistence
