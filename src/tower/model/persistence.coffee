Tower.Model.Persistence =
  ClassMethods:
    defaultStore: Tower.Store.Memory
    
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
    
    load: (array) ->
      @store().load(array)
      
    collectionName: ->
      Tower.Support.String.camelize(Tower.Support.String.pluralize(@name), true)
      
    resourceName: ->
      Tower.Support.String.camelize(@name, true)
      
    clone: (model) ->
      
  InstanceMethods:
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
      @runCallbacks "update", =>
        @store().update {id: @id}, attributes, instantiate: false, (error) =>
          throw error if error && !callback
          @changes    = {} unless error
          @persistent = true
          callback.call(@, error) if callback
      
      @
      
    _create: (callback) ->
      @runCallbacks "create", =>
        @store().create @attributes, instantiate: false, (error, docs) =>
          throw error if error && !callback
          @changes    = {} unless error
          @persistent = true
          @store().load @
          callback.call(@, error) if callback
      
      @
    
    updateAttributes: (attributes, callback) ->
      @_update(attributes, callback)
    
    destroy: (callback) ->
      if @isNew()
        callback.call @, null if callback
      else
        @store().destroy {id: @id}, instantiate: false, (error) =>
          throw error if error && !callback
          @persistent = false
          delete @attributes.id unless error
          callback.call(@, error) if callback
      
      @destroyed = true
      @
    
    delete: (callback) ->
      @destroy(callback)
    
    isPersisted: ->
      !!(@persistent)# && @attributes.hasOwnProperty("id") && @attributes.id != null && @attributes.id != undefined)
      
    isNew: ->
      !!!@isPersisted()
      
    toObject: ->
      @attributes

    clone: ->

    reset: ->  
    reload: ->
      
    toggle: (name) ->
      
    store: ->
      @constructor.store()
      
module.exports = Tower.Model.Persistence
