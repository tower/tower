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

      if typeof value == 'function'
        store   = new value(name: metadata.namePlural, type: Tower.namespaced(metadata.className))
      else if typeof value == 'object'
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
    transaction: Ember.computed(->
      new Tower.Store.Transaction
    ).cacheable()
    
    withTransaction: (block) ->
      transaction = @get('transaction')
      block.call @, transaction if block
      transaction
    
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
      @send 'save', options, callback

    # Set attributes and save the model, all at once.
    #
    # @param [Object] attributes
    # @param [Function] callback
    #
    # @return [void] Requires a callback.
    updateAttributes: (attributes, callback) ->
      @set(attributes)
      @send 'update', callback

    # Destroy this record, if it is persistent.
    #
    # @param [Function] callback
    #
    # @return [void] Requires a callback.
    destroy: (callback) ->
      @send 'destroy', callback

    # @todo Haven't implemented
    reload: ->

module.exports = Tower.Model.Persistence
