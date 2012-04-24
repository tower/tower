# helpers
createdState = Tower.Model.State.Dirty.create
  dirtyType: "created"
  isNew:     true

  invokeLifecycleCallbacks: (stateMachine, record) ->
    record.fire("didCreate")

updatedState = Tower.Model.State.Dirty.create
  dirtyType: "updated"

  invokeLifecycleCallbacks: (stateMachine, record) ->
    record.fire("didUpdate")

createdState.states.uncommitted.reopen(Tower.Model.State.CreatedUncommitted)
createdState.states.pending.states.uncommitted.reopen(Tower.Model.State.CreatedUncommitted)
updatedState.states.uncommitted.reopen(Tower.Model.State.UpdatedUncommitted)
updatedState.states.pending.states.uncommitted.reopen(Tower.Model.State.UpdatedUncommitted)

class Tower.Model.StateMachine extends Tower.StateMachine
  record:       null
  initialState: "rootState"
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
      # 
      # 
      empty: Tower.Model.State.create
        # Called by the `record.store` when it's instantiating record with data from the database.
        #
        # Causes the stateMachine to transition to the "loading" state.
        loadingData: (stateMachine) ->
          stateMachine.goToState("loading")
        
        # This is called when you set attributes, relations, or attachments.  
        # It's different than when the store sets initial properties on the record
        # after it loads data from the server.  This one is saying your intention is to
        # _create_ the record, while `loadingData` is saying the store is loading data.
        # Both may end up with the same data, but the reasons why are different.
        didChangeData: (stateMachine) ->
          Tower.Model.State.didChangeData(stateMachine)
          stateMachine.goToState("loaded.created")
    
      # Loading state
      loading: Tower.Model.State.create
        # Called whenever you change the state out of this one
        exit: (stateMachine) ->
          record = Ember.get(stateMachine, "record")
          # will cause record.didLoad() to be called
          record.fire("didLoad")
        
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
          stateMachine.send("loadedData")

        loadedData: (stateMachine) ->
          stateMachine.goToState("loaded")

      # Loaded state
      loaded: Tower.Model.State.create
        initialState: "saved"
        isLoaded:     true
        created:      createdState
        updated:      updatedState
        
        saved: Tower.Model.State.create
          setProperty: (stateMachine, context) ->
            Tower.Model.State.setProperty(stateMachine, context)
            stateMachine.goToState("updated")

          setAssociation: (stateMachine, context) ->
            Tower.Model.State.setAssociation(stateMachine, context)
            stateMachine.goToState("updated")

          didChangeData: Tower.Model.State.didChangeData
          
          destroy: (stateMachine) ->
            stateMachine.goToState("deleted")

          waitingOn: (stateMachine, object) ->
            Tower.Model.State.waitingOn(stateMachine, object)
            stateMachine.goToState("updated.pending")
    
      # Deleted state which starts in the `start` state (Ember does this by default).
      # 
      # The "deleted.saved" state basically means the record is now a new record, because
      # it enters that state after the server tells us it "didCommit" (it successfully deleted it).
      deleted: Tower.Model.State.create
        isDeleted: true
        isLoaded:  true
        isDirty:   true
        saved:     Tower.Model.State.create(isDirty: false)

        start: Tower.Model.State.create
          enter: (stateMachine) ->
            record  = Ember.get(stateMachine, "record")
            store   = Ember.get(record, "store")
            
            store.removeFromCursors(record) if store
            
            record.withTransaction (t) ->
              t.recordBecameDirty("deleted", record)

          willCommit: (stateMachine) ->
            stateMachine.goToState("inFlight")
          
        inFlight: Tower.Model.State.create
          isSaving: true

          exit: (stateMachine) ->
            record = Ember.get(stateMachine, "record")
            
            record.withTransaction (t) ->
              t.recordBecameClean("deleted", record)

          didCommit: (stateMachine) ->
            stateMachine.goToState("saved")

      error: Tower.Model.State.create(isError: true)

module.exports = Tower.Model.StateMachine
