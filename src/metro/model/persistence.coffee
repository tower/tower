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
    
    # @store new Metro.Store.MongoDB(name: "users")
    # @store name: "users"
    store: (value) ->
      # add options!
      return @_store if !value && @_store
      
      if typeof value == "object"
        @_store ||= new @defaultStore(name: @collectionName(), className: Metro.namespaced(@name))
        Metro.Support.Object.extend @_store, value
      else if value
        @_store = value
      
      @_store ||= new @defaultStore(name: @collectionName(), className: Metro.namespaced(@name))
        
      @_store
        
    defaultStore: Metro.Store.Memory
      
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
        @_update(@toUpdates(), callback)
    
    _update: (attributes, callback) ->
      @constructor.update id: @id, attributes, (error, docs) =>
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
    
    updateAttributes: (attributes, callback) ->
      @_update(attributes, callback)
      
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
