Tower.Model.Persistence =
  ClassMethods:
    defaultStore: if Tower.client then Tower.Store.Memory else Tower.Store.MongoDB
    
    store: (value) ->
      return @_store if !value && @_store
      
      if typeof value == "function"
        @_store   = new value(name: @collectionName(), type: Tower.namespaced(@name))
      else if typeof value == "object"
        @_store ||= new @defaultStore(name: @collectionName(), type: Tower.namespaced(@name))
        Tower.Support.Object.extend @_store, value
      else if value
        @_store   = value
      
      @_store ||= new @defaultStore(name: @collectionName(), type: Tower.namespaced(@name))
      
      @_store
    
    load: (records) ->
      @store().load(records)
      
  InstanceMethods:
    # Create or update the record.
    # 
    # @example Default save
    #   user.save -> console.log "saved"
    # 
    # @example Save without validating
    #   user.save validate: false, -> console.log "saved"
    save: (options, callback) ->
      throw new Error("Record is read only") if @readOnly
      
      if typeof options == "function"
        callback  = options
        options   = {}
      options ||= {}
      
      unless options.validate == false
        @validate (error) =>
          if error
            callback.call @, null, false if callback
          else
            @_save callback
      else
        @_save callback
        
      @
    
    updateAttributes: (attributes, callback) ->
      @set(attributes)
      @_update(attributes, callback)

    destroy: (callback) ->
      if @isNew()
        callback.call @, null if callback
      else
        @_destroy callback
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

    # @private
    _save: (callback) ->
      @runCallbacks "save", (block) =>
        complete = @_callback(block, callback)

        if @isNew()
          @_create(complete)
        else
          @_update(@toUpdates(), complete)
    
    # @private
    _create: (callback) ->
      @runCallbacks "create", (block) =>
        complete = @_callback(block, callback)
        
        @constructor.create @, instantiate: false, (error) =>
          throw error if error && !callback
          
          unless error
            @changes    = {}
            @persistent = true

          complete.call(@, error)

      @
    
    # @private
    _update: (updates, callback) ->
      @runCallbacks "update", (block) =>
        complete = @_callback(block, callback)
        @constructor.update @get("id"), updates, instantiate: false, (error) =>
          throw error if error && !callback

          unless error
            @changes    = {}
            @persistent = true

          complete.call(@, error)

      @

    # @private
    _destroy: (callback) ->
      @runCallbacks "destroy", (block) =>
        complete = @_callback(block, callback)

        @constructor.destroy @, instantiate: false, (error) =>
          throw error if error && !callback
          
          unless error
            @persistent = false
            @changes    = {}
            delete @attributes.id
          
          complete.call(@, error)

      @
      
module.exports = Tower.Model.Persistence
