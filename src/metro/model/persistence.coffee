Metro.Model.Persistence =
  ClassMethods:
    create: (attributes, callback) ->
      @scoped().create(attributes, callback)
    
    update: (ids..., updates, callback) ->
      @scoped().update(ids..., updates, callback)
      
    updateAll: (updates, query, callback) ->
      @scoped().updateAll(updates, query, callback)
      
    destroy: (query, callback) ->
      @scoped().destroy(query, callback)
    
    deleteAll: ->
      @scoped().deleteAll()
    
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
      
    clone: (model) ->
  
  InstanceMethods:
    isNew: ->
      !!!@attributes.id
    
    save: (callback) ->
      if @isNew()
        @_create(callback)
      else
        @_update(@toUpdates(), callback)
    
    _update: (attributes, callback) ->
      @constructor.update @id, attributes, (error) =>
        @changes = {} unless error
        callback.call(@, error) if callback
      
      @
      
    _create: (callback) ->
      @constructor.create @attributes, (error, docs) =>
        throw error if error
        @changes = {}
        callback.call(@, error) if callback
      
      @
    
    updateAttributes: (attributes, callback) ->
      @_update(attributes, callback)
    
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

    clone: ->

    reset: ->  
    reload: ->
      
    toggle: (name) ->
      

module.exports = Metro.Model.Persistence
