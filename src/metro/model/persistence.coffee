Metro.Model.Persistence =
  ClassMethods:
    create: (attrs) ->
      @store().create(new @(attrs))
    
    update: ->
    
    deleteAll: ->
      @store().clear()
  
  InstanceMethods:
    isNew: ->
      !!!attributes.id
    
    save: (options) ->
    
    update: (options) ->
    
    reset: ->
  
    updateAttribute: (name, value) ->
    
    updateAttributes: (attributes) ->
    
    increment: (attribute, amount = 1) ->
    
    decrement: (attribute, amount = 1) ->
    
    reload: ->
    
    delete: ->
    
    destroy: ->
  
    createOrUpdate: ->
  
    isDestroyed: ->
    
    isPersisted: ->
    
    isDirty: ->
      Metro.Support.Object.isPresent(@changes())

    _trackChangedAttribute: (attribute, value) ->
      array       = @changes[attribute] ||= []
      beforeValue = array[0] ||= @attributes[attribute]
      array[1]    = value
      array       = null if array[0] == array[1]

      if array
        @changes[attribute] = array
      else
        delete @changes[attribute]

      beforeValue

module.exports = Metro.Model.Persistence
