# @mixin
Tower.Model.Persistence =
  ClassMethods:
    # Define or get the data store for this model.
    #
    # @example Define the store from a store class
    #   class App.User extends Tower.Model
    #     @store Tower.Store.MongoDB
    #
    # @example Define the store from an object (uses {Tower.Model.default('store')})
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
      return store if arguments.length == 0 && store

      defaultStore = @default('store') || Tower.Store.Memory

      if typeof value == "function"
        store   = new value(name: metadata.namePlural, type: Tower.namespaced(metadata.className))
      else if typeof value == "object"
        store ||= new defaultStore(name: metadata.namePlural, type: Tower.namespaced(metadata.className))
        _.extend store, value
      else if value
        store   = value

      store ||= new defaultStore(name: metadata.namePlural, type: Tower.namespaced(metadata.className))

      metadata.store = store

    # Load data into the store, used only for {Tower.Store.Memory}.
    #
    # @param [Array] records array of objects or models (so you can pass in JSON).
    #
    # @return [Array] will return the array of models.
    load: (records) ->
      @store().load(records)
      
    transaction: (block) ->
      transaction = new Tower.Store.Transaction
      block.call @, transaction if block
      transaction

  InstanceMethods:
    withTransaction: (block) ->
      @constructor.transaction(block)
    
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

    # @todo Haven't implemented
    reload: ->

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
              delete @attributes.id
              complete.call(@, error)
          else
            complete.call(@, error)

      undefined

module.exports = Tower.Model.Persistence
