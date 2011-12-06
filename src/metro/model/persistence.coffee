Metro.Model.Persistence =
  ClassMethods:
    create: (attributes, callback) ->
      @store().create(new @(attributes), callback)
    
    update: (query, attributes, callback) ->
      @store().update(query, attributes, callback)
      
    destroy: (query, callback) ->
      @store().destroy(query, callback)
      
    updateAll: ->
    
    deleteAll: ->
      @store().clear()
      
    store: (value) ->
      @_store = value if value
      @_store ||= new Metro.Store.Memory
  
  InstanceMethods:
    isNew: ->
      !!!attributes.id
    
    save: (callback) ->
      if @isNew()
        @_create(callback)
      else
        @_update(callback)
    
    _update: (callback) ->
      @constructor.update(@toUpdates(), callback)
      
    _create: (callback) ->
      @constructor.create(@toUpdates(), callback)
    
    reset: ->
      
    updateAttribute: (key, value) ->
    
    updateAttributes: (attributes) ->
      @constructor.update(attributes, callback)
    
    increment: (attribute, amount = 1) ->
    
    decrement: (attribute, amount = 1) ->
    
    reload: ->
    
    delete: ->
      
    
    destroy: ->
  
    isDestroyed: ->
    
    isPersisted: ->
      !!@isNew()
      
    toObject: ->
      @attributes
    
    isDirty: ->
      Metro.Support.Object.isPresent(@changes)

    _attributeChange: (attribute, value) ->
      array       = @changes[attribute] ||= []
      beforeValue = array[0] ||= @attributes[attribute]
      array[1]    = value
      array       = null if array[0] == array[1]
      
      if array then @changes[attribute] = array else delete @changes[attribute]
      
      beforeValue

module.exports = Metro.Model.Persistence
