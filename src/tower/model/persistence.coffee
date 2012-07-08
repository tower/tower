# @mixin
Tower.Model.Persistence =
  ClassMethods:
    # Construct a new instance of the model
    new: Ember.Object.create
    # Construct a new instance of the model
    # build: Ember.Object.create

    # Define or get the data store for this model.
    #
    # @example Define the store from a store class
    #   class App.User extends Tower.Model
    #     @store Tower.Store.Mongodb
    #
    # @example Define the store from an object (uses {Tower.Model.default('store')})
    #   class App.Person extends Tower.Model
    #     @store name: 'people', type: 'Person'
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

      type = typeof value

      if type == 'function'
        store   = new value(name: metadata.namePlural, type: Tower.namespaced(metadata.className))
      else if type == 'object'
        store ||= new defaultStore(name: metadata.namePlural, type: Tower.namespaced(metadata.className))
        _.extend(store, value)
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
      # Tower.Model.Cursor.pushMatching @store().load(records)
      @store().load(records)

    # For memory store, if records were deleted on the server 
    # and need to be removed on the connected clients.
    unload: (records) ->
      @store().unload(records)

    # Only use on memory store for now
    empty: ->
      @store().clean()

  InstanceMethods:
    store: Ember.computed ->
      @constructor.store()

    # Create or update the record.
    #
    # @example Default save
    #   user.save -> console.log 'saved'
    #
    # @example Save without validating
    #   user.save validate: false, -> console.log 'saved'
    #
    # @return [void] Requires a callback.
    save: (options, callback) ->
      @set('isSaving', true)
      @get('transaction').adopt(@)

      throw new Error('Record is read only') if @readOnly

      if typeof options == 'function'
        callback  = options
        options   = {}
      options ||= {}

      unless options.validate == false
        @validate (error) =>
          if error
            @set('isValid', false)
            @set('isSaving', false)
            # something is wrong here...
            if callback
              callback.call(@, null)
            else
              # something like this if no callback is passed
              throw new Error(_.flatten(_.values(@errors)).join('. '))
          else
            @set('isValid', true)
            @_save(callback)
      else
        @_save(callback)

    # Set attributes and save the model, all at once.
    #
    # @param [Object] attributes
    # @param [Function] callback
    #
    # @return [void] Requires a callback.
    updateAttributes: (attributes, callback) ->
      @setProperties(attributes)
      @save(callback)

    # Destroy this record, if it is persistent.
    #
    # @param [Function] callback
    #
    # @return [void] Requires a callback.
    destroy: (callback) ->
      if @get('isNew')
        callback.call(@, null if callback)
      else
        @_destroy(callback)

      @

    # @todo Haven't implemented
    # In the memory store there is only one instance of the record
    # so if you change attributes it's going to be reflected in any reference
    # unless you have somehow cloned the object.
    # For the mongo store, it will be different though.
    reload: (callback) ->
      # @clearAssociationCache()
      @constructor.find @get('id'), (error, freshRecord) =>
        @set('data', freshRecord.get('data'))
        callback.call(@, error) if callback

      @

    # This is basically the same as `refresh`, but for the client it fetches from the server.
    # It's possible `refresh` and `reload` will be merged, waiting to see the use cases in the real world.
    refresh: (callback) ->
      @constructor.where(id: @get('id')).limit(1).fetch (error, freshRecord) =>
        @set('data', freshRecord.get('data'))
        callback.call(@, error) if callback

      @

    markForDestruction: ->

    # Implementation of the {#save} method.
    #
    # @private
    #
    # @param [Function] callback
    #
    # @return [void] Requires a callback.
    _save: (callback) ->
      @runCallbacks 'save', (block) =>
        complete = Tower.callbackChain(block, callback)

        if @get('isNew')
          @_create(complete)
        else
          @_update(complete)

      undefined

    # Saves this new record to the database.
    #
    # @private
    #
    # @param [Function] callback
    #
    # @return [void] Requires a callback.
    _create: (callback) ->
      @runCallbacks 'create', (block) =>
        complete = Tower.callbackChain(block, callback)

        @constructor.scoped(instantiate: false, noDefault: true).insert @, (error) =>
          throw error if error && !callback

          @set('isSaving', false)

          unless error
            @set('isNew', false)
            @get('data').commit()

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
    _update: (callback) ->
      @runCallbacks 'update', (block) =>
        complete = Tower.callbackChain(block, callback)

        @constructor.scoped(instantiate: false, noDefault: true).update @get('id'), @, (error) =>
          throw error if error && !callback

          @set('isSaving', false)

          unless error
            @set('isNew', false)
            @get('data').commit()

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
      @runCallbacks 'destroy', (block) =>
        complete = Tower.callbackChain(block, callback)

        @constructor.scoped(instantiate: false, noDefault: true).destroy @, (error) =>
          throw error if error && !callback

          unless error
            @destroyRelations (error) =>
              @set('isNew', false)
              @set('isDeleted', true)
              # want to remove this after everyone's been notified.
              # @set('id', undefined)
              complete.call(@, error)
          else
            complete.call(@, error)

      undefined

module.exports = Tower.Model.Persistence
