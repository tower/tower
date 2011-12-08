Metro.Model.Persistence =
  ClassMethods:
    create: (attributes, callback) ->
      @store().create(attributes, callback)
    
    update: (query, attributes, callback) ->
      @store().update(query, attributes, callback)
      
    destroy: (query, callback) ->
      @store().destroy(query, callback)
    
    deleteAll: ->
      @store().clear()
      
    store: (value) ->
      @_store = value if value
      @_store ||= new Metro.Store.Memory(name: @collectionName(), className: @name)
      
    collectionName: ->
      Metro.Support.String.camelize(Metro.Support.String.pluralize(@name), true)
      
    resourceName: ->
      Metro.Support.String.camelize(@name, true)
  
  InstanceMethods:
    isNew: ->
      !!!@attributes.id
    
    save: (callback) ->
      if @isNew()
        @_create(callback)
      else
        @_update(callback)
    
    _update: (callback) ->
      @constructor.update {id: @id}, @toUpdates(), (error, docs) =>
        throw error if error
        @changes = {}
        callback.call(@, error) if callback
      
      @
      
    _create: (callback) ->
      @constructor.create @attributes, (error, docs) =>
        throw error if error
        @changes = {}
        callback.call(@, error) if callback
      
      @
    
    reset: ->
      
    updateAttribute: (key, value) ->
    
    updateAttributes: (attributes, callback) ->
      for key, value of attributes
        @[key] = value
      
      @save(callback)
      
    increment: (attribute, amount = 1) ->
    
    decrement: (attribute, amount = 1) ->
    
    reload: ->
    
    delete: (callback) ->
      if @isNew()
        callback.apply(null, @) if callback
      else
        @constructor.destroy id: @id, (error) =>
          delete @attributes.id unless error
          callback.apply(@, error) if callback
      
      @
    
    destroy: (callback) ->
      @delete (error) ->
        throw error if error
        callback.apply(error, @) if callback
    
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
