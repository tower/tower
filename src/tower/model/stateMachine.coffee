class Tower.Model.StateMachine extends Tower.StateMachine
  record:       null
  initialState: 'rootState'
  #enableLogging: true
  states:
    rootState: Tower.State.create
      isLoaded:  false
      isDirty:   false
      isSaving:  false
      isDeleted: false
      isError:   false
      isNew:     false
      isValid:   true
      isPending: false

      # Empty state, when a model is instantiated.
      empty: Tower.Model.State.create
        # Called by the `record.store` when it's instantiating record with data from the database.
        #
        # Causes the stateMachine to transition to the "loading" state.
        loadingData: (stateMachine) ->
          stateMachine.goToState('loading')

        # This is called when you set attributes, relations, or attachments.
        # It's different than when the store sets initial properties on the record
        # after it loads data from the server.  This one is saying your intention is to
        # _create_ the record, while `loadingData` is saying the store is loading data.
        # Both may end up with the same data, but the reasons why are different.
        didChangeData: (stateMachine) ->
          Tower.Model.State.didChangeData(stateMachine)
          stateMachine.goToState('created')

      # Loading state
      loading: Tower.Model.State.create
        # Same as the "empty" state, if you set properties on the object,
        # and it's either not persisted or in the process of loading data asynchronously,
        # then setting properties will send it to the "loaded.saved" state.
        # From "loading" it goes to "loaded.saved", because the record already exists.
        # But from "empty" it goes to "loaded.created" when you set properties, because
        # the record is not yet in the database.
        #
        # (Seems like this maybe should go to "loaded.updated")
        didChangeData: (stateMachine, data) ->
          Tower.Model.State.didChangeData(stateMachine)
          stateMachine.send('loadedData')

        loadedData: (stateMachine) ->
          stateMachine.goToState('saved')

        # Called whenever you change the state out of this one
        exit: (stateMachine) ->
          record = Ember.get(stateMachine, 'record')
          # will cause record.didLoad() to be called
          record.fire('didLoad')

      created: Tower.Model.State.Dirty.create
        dirtyType:  'created'
        isNew:      true
        isLoaded:   true

        invokeLifecycleCallbacks: (stateMachine, record) ->
          record.fire('didCreate')

        destroy: (stateMachine, callback) ->
          @_super(stateMachine)
          
          stateMachine.goToState('deleted.saved')

      saved: Tower.Model.State.create
        isLoaded: true
        
        setProperty: (stateMachine, context) ->
          Tower.Model.State.setProperty(stateMachine, context)
          stateMachine.goToState('updated')

        setAssociation: (stateMachine, context) ->
          Tower.Model.State.setAssociation(stateMachine, context)
          stateMachine.goToState('updated')

        didChangeData: Tower.Model.State.didChangeData

        destroy: (stateMachine, callback) ->
          stateMachine.goToState('deleted')
          stateMachine.send('willCommit', callback) # need to do this so you can pass the callback

      updated: Tower.Model.State.Dirty.create
        dirtyType:  'updated'
        isLoaded:   true

        destroy: (stateMachine, callback) ->
          @_super(stateMachine)
          
          stateMachine.goToState('deleted')
          stateMachine.send('willCommit', callback)

        invokeLifecycleCallbacks: (stateMachine, record) ->
          record.fire('didUpdate')

      # Deleted state which starts in the `start` state (Ember does this by default).
      #
      # The "deleted.saved" state basically means the record is now a new record, because
      # it enters that state after the server tells us it "didCommit" (it successfully deleted it).
      deleted: Tower.Model.State.create
        isDeleted:    true
        isLoaded:     true
        isDirty:      true
        initialState: 'committing'
        
        saved:        Tower.Model.State.create(isDirty: false)
        
        committing: Tower.Model.State.create
          willCommit: (stateMachine, callback) ->
            record  = Ember.get(stateMachine, 'record')
            record.withTransaction (transaction) ->
              transaction.destroy(record, callback)
              
          didCommit: (stateMachine) ->
            stateMachine.goToState('saved')

          exit: (stateMachine) ->
            record = Ember.get(stateMachine, 'record')

            record.withTransaction (t) ->
              t.recordBecameClean('deleted', record)

      error: Tower.Model.State.create(isError: true)

module.exports = Tower.Model.StateMachine
