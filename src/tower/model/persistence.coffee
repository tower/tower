Tower.Model.Persistence =
  ClassMethods:
    defaultStore: Tower.Store.Memory
    
    # @store new Tower.Store.MongoDB(name: "users")
    # @store name: "users"
    store: (value) ->
      # add options!
      return @_store if !value && @_store
      
      if typeof value == "object"
        @_store ||= new @defaultStore(name: @collectionName(), className: Tower.namespaced(@name))
        Tower.Support.Object.extend @_store, value
      else if value
        @_store = value
      
      @_store ||= new @defaultStore(name: @collectionName(), className: Tower.namespaced(@name))
        
      @_store
    
    # tmp fix, for memory model
    load: (array) ->
      array   = [array] unless Tower.Support.Object.isArray(array)
      records = @store().records
      for item in array
        record = if item instanceof Tower.Model then item else new @(item)
        records[record.id] = record
      records
      
    collectionName: ->
      Tower.Support.String.camelize(Tower.Support.String.pluralize(@name), true)
      
    resourceName: ->
      Tower.Support.String.camelize(@name, true)
      
    clone: (model) ->
      
    create2: (attributes, callback) ->
      record = new @(attributes)
      record.save (error, success) =>
        callback.call @, error, record if callback
      record
  
  InstanceMethods:
    isNew: ->
      !!!@attributes.id
    
    save: (options, callback) ->
      throw new Error("Record is readOnly") if @readOnly
      
      if typeof options == "function"
        callback  = options
        options   = {}
      options ||= {}
      
      unless options.validate == false
        unless @validate()
          callback.call @, null, false if callback
          return false
      
      @runCallbacks "save", ->
        if @isNew()
          @_create(callback)
        else
          @_update(@toUpdates(), callback)
        
      true
    
    _update: (attributes, callback) ->
      @runCallbacks "update", ->
        @constructor.update @id, attributes, (error) =>
          @changes = {} unless error
          callback.call(@, error, !error) if callback
      
      @
      
    _create: (callback) ->
      @runCallbacks "create", ->
        @constructor.store().create @attributes, (error, docs) =>
          @changes = {} unless error
          callback.call(@, error, !error) if callback
      
      @
    
    updateAttributes: (attributes, callback) ->
      @_update(attributes, callback)
    
    delete: (callback) ->
      if @isNew()
        callback.call null, @ if callback
      else
        @constructor.destroy id: @id, (error) =>
          delete @attributes.id unless error
          callback.call @, error if callback
      
      @destroyed = true  
      @freeze()
      @
    
    destroy: (callback) ->
      @destroyRelations()
      
      @delete (error) ->
        throw error if error
        callback.call error, @ if callback
    
    # Freeze the attributes hash such that associations are still accessible, even on destroyed records.    
    freeze: ->
    
    isPersisted: ->
      !!@isNew()
      
    toObject: ->
      @attributes

    clone: ->

    reset: ->  
    reload: ->
      
    toggle: (name) ->
      

module.exports = Tower.Model.Persistence
