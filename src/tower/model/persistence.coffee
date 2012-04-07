# @mixin
Tower.Model.Persistence =
  ClassMethods:
    # Default store.
    # 
    # Defaults to {Tower.Store.Memory} on the client.
    # Defaults to {Tower.Store.MongoDB} on the server.
    defaultStore: if Tower.client then Tower.Store.Memory else Tower.Store.MongoDB
    
    # Define or get the data store for this model.
    # 
    # @example Define the store from a store class
    #   class App.User extends Tower.Model
    #     @store Tower.Store.MongoDB
    # 
    # @example Define the store from an object (uses {Tower.Model.defaultStore})
    #   class App.Person extends Tower.Model
    #     @store name: "people", type: "Person"
    # 
    # @example Return the store
    #   store = App.User.store()
    # 
    # @param [Object] value
    # 
    # @return [Tower.Store]
    store: (value) ->
      metadata  = @metadata()
      store     = metadata.store
      return store if !value && store
      
      if typeof value == "function"
        store   = new value(name: @metadata().namePlural, type: Tower.namespaced(@name))
      else if typeof value == "object"
        store ||= new @defaultStore(name: @metadata().namePlural, type: Tower.namespaced(@name))
        _.extend store, value
      else if value
        store   = value

      store ||= new @defaultStore(name: @metadata().namePlural, type: Tower.namespaced(@name))

      metadata.store = store

    # Load data into the store, used only for {Tower.Store.Memory}.
    # 
    # @param [Array] records array of objects or models (so you can pass in JSON).
    # 
    # @return [Array] will return the array of models.
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
    # 
    # @return [void] Requires a callback.
    save: (options, callback) ->
      throw new Error("Record is read only") if @readOnly

      if typeof options == "function"
        callback  = options
        options   = {}
      options ||= {}
      
      unless options.validate == false
        @validate (error) =>
          if error
            # something is wrong here...
            callback.call @, null, false if callback
          else
            @_save callback
      else
        @_save callback

      undefined

    # Set attributes and save the model, all at once.
    # 
    # @param [Object] attributes
    # @param [Function] callback
    # 
    # @return [void] Requires a callback.
    updateAttributes: (attributes, callback) ->
      @set(attributes)
      @_update(attributes, callback)
  
    # Destroy this record, if it is persistent.
    # 
    # @param [Function] callback
    # 
    # @return [void] Requires a callback.
    destroy: (callback) ->
      if @isNew()
        callback.call @, null if callback
      else
        @_destroy callback
      @

    # Check if this record has been saved to the database.
    # 
    # @return [Boolean]
    isPersisted: ->
      !!(@persistent)# && @attributes.hasOwnProperty("id") && @attributes.id != null && @attributes.id != undefined)

    # Check if this record has not yet been saved to the database.
    # 
    # @return [Boolean]
    isNew: ->
      !!!@isPersisted()

    # @todo Haven't implemented
    reload: ->
  
    # Returns the data store associated with this model's class.
    # 
    # @return [Tower.Store]
    store: ->
      @constructor.store()
  
    # Implementation of the {#save} method.
    # 
    # @private
    # 
    # @param [Function] callback
    # 
    # @return [void] Requires a callback.
    _save: (callback) ->
      @runCallbacks "save", (block) =>
        complete = @_callback(block, callback)

        if @isNew()
          @_create(complete)
        else
          @_update(@toUpdates(), complete)
        
      undefined

    # Saves this new record to the database.
    # 
    # @private
    # 
    # @param [Function] callback
    # 
    # @return [void] Requires a callback.
    _create: (callback) ->
      @runCallbacks "create", (block) =>
        complete = @_callback(block, callback)
      
        @constructor.scoped(instantiate: false).create @, (error) =>
          throw error if error && !callback

          unless error
            @_resetChanges()
            @persistent = true

          complete.call(@, error)

      undefined
  
    # Updates the database with the changes in this existing record.
    # 
    # @private
    # 
    # @param [Object] updates
    # @param [Function] callback
    # 
    # @return [void] Requires a callback.
    _update: (updates, callback) ->
      @runCallbacks "update", (block) =>
        complete = @_callback(block, callback)

        @constructor.scoped(instantiate: false).update @get("id"), updates, (error) =>
          throw error if error && !callback

          unless error
            @_resetChanges()
            @persistent = true

          complete.call(@, error)

      undefined

    # Implementation of the {#destroy} method.
    # 
    # @private
    # 
    # @param [Function] callback
    # 
    # @return [void] Requires a callback.
    _destroy: (callback) ->
      id = @get('id')
    
      @runCallbacks "destroy", (block) =>
        complete = @_callback(block, callback)

        @constructor.scoped(instantiate: false).destroy @, (error) =>
          throw error if error && !callback

          unless error
            @destroyRelations (error) =>
              @persistent = false
              @_resetChanges()
              delete @attributes.id
              complete.call(@, error)
          else
            complete.call(@, error)

      undefined

module.exports = Tower.Model.Persistence
