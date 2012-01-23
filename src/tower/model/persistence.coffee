Tower.Model.Persistence =
  ClassMethods:
    defaultStore: Tower.Store.Memory
    
    store: (value) ->
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
      
  InstanceMethods:
    save: (options, callback) ->
      throw new Error("Record is read only") if @readOnly
      
      if typeof options == "function"
        callback  = options
        options   = {}
      options ||= {}
        
      unless options.validate == false
        @validate (error, success) =>
          if success
            @_save callback
          else
            callback.call @, null, false if callback
      else
        @_save callback
        
      @
    
    updateAttributes: (attributes, callback) ->
      @_update(attributes, callback)
    
    destroy: (callback) ->
      if @isNew()
        callback.call @, null if callback
      else
        @runCallbacks "destroy", =>
          @constructor.destroy @id, instantiate: false, (error) =>
            throw error if error && !callback
            @persistent = false
            delete @attributes.id unless error
            callback.call(@, error) if callback
      
      @
    
    delete: (callback) ->
      @destroy(callback)
    
    isPersisted: ->
      !!(@persistent)# && @attributes.hasOwnProperty("id") && @attributes.id != null && @attributes.id != undefined)
      
    isNew: ->
      !!!@isPersisted()
      
    reload: ->
      
    store: ->
      @constructor.store()
      
    _save: (callback) ->
      @runCallbacks "save", =>
        if @isNew()
          @_create(callback)
        else
          @_update(@toUpdates(), callback)
    
    _update: (attributes, callback) ->
      @runCallbacks "update", =>
        @constructor.update @id, attributes, instantiate: false, (error) =>
          throw error if error && !callback
          @changes    = {} unless error
          @persistent = true
          callback.call(@, error) if callback
      
      @
      
    _create: (callback) ->
      @runCallbacks "create", =>
        #@store().create @attributes, instantiate: false, (error, docs) =>
        @constructor.create @attributes, instantiate: false, (error, attributes) =>
          throw error if error && !callback
          unless error
            _.extend @attributes, attributes
            @changes    = {}
            @persistent = true
            @store().load(@)
            
          callback.call(@, error) if callback
      
      @
      
module.exports = Tower.Model.Persistence
