# empty -> loading -> loaded -> uncommitted
#   (then call save, aka "updating", via transaction.willCommit())
#   updated.pending.before
#   updated.pending.validating
#   updated.pending.committing (saving to database, or over REST api)
#   updated.pending.after
class Tower.Model.State extends Tower.State
  @setProperty: (stateMachine, context) ->
    key     = context.key
    value   = context.value
    record  = Ember.get(stateMachine, 'record')
    data    = Ember.get(record, 'data')

    Ember.set(data, key, value)

  @setAssociation: (stateMachine, context) ->
    key     =  context.key
    value   =  context.value
    record  =  Ember.get(stateMachine, 'record')
    data    =  Ember.get(record, 'data')

    data.setAssociation(key, value)

  @didChangeData: (stateMachine) ->
    record           =  Ember.get(stateMachine, 'record')
    data             =  Ember.get(record, 'data')
    data._savedData  =  null

    record.notifyPropertyChange('data')

  @becameInvalid: (stateMachine, errors) ->
    record = Ember.get(stateMachine, 'record')

    Ember.set(record, 'errors', errors)

    stateMachine.goToState('invalid')

  stateProperty = Ember.computed((key) ->
    parent = Ember.get(@, 'parentState')
    Ember.get(parent, key)  if parent
  ).property()

  isLoaded:  stateProperty
  isDirty:   stateProperty
  isSaving:  stateProperty
  isDeleted: stateProperty
  isError:   stateProperty
  isNew:     stateProperty
  isValid:   stateProperty
  isPending: stateProperty

  dirtyType: stateProperty

  @Uncommitted: Ember.Mixin.create
    setProperty:    @setProperty
    setAssociation: @setAssociation

    save: (stateMachine, context) ->
      stateMachine.goToState('committing')

      stateMachine.send('save', context)

    destroy: (stateMachine) ->
      @_super(stateMachine)

      record    = Ember.get(stateMachine, 'record')
      dirtyType = Ember.get(@, 'dirtyType')

      record.withTransaction (t) ->
        t.recordBecameClean(dirtyType, record)

  @CreatedUncommitted: Ember.Mixin.create
    destroy: (stateMachine) ->
      @_super(stateMachine)

      stateMachine.goToState('deleted.saved')

  @UpdatedUncommitted: Ember.Mixin.create
    destroy: (stateMachine) ->
      @_super(stateMachine)

      record = Ember.get(stateMachine, 'record')

      record.withTransaction (t) ->
        t.recordBecameClean('created', record)

      stateMachine.goToState('deleted')

Uncommitted         = Tower.Model.State.Uncommitted
CreatedUncommitted  = Tower.Model.State.CreatedUncommitted
UpdatedUncommitted  = Tower.Model.State.UpdatedUncommitted

Tower.Model.State.Dirty = Tower.Model.State.extend
  initialState: 'uncommitted'
  isDirty:      true

  # When you first set a property on the record, it will enter this state.
  #
  # If you try to delete a record in the "uncommitted" state, it will be handled
  # differently depending on if it's nested within the "created", "updated", or has no, parent state.
  #
  # If the record is neither being created or updated, then it's never been saved to the database.
  # In that state, if you call `destroy`, it will just move it to the transaction's `clean` bucket.
  #
  # If the record is in the "created" state (it's persisted but has no changes),
  # and you call `destroy`, the stateMachine will transition from "uncommitted" to "deleted.saved",
  # where it will then be removed from the database and moved back to the transaction's "clean" bucket
  # (it is now basically a new record).
  #
  # If the record is in the "updated" state (it's persisted and has changes),
  # and you call `destroy`, the stateMachine will transition from "uncommitted" to "deleted".
  #
  # When the "uncommitted" state is exited, we invoke the lifecycle callbacks on the record.
  # This means, if it's in the "created.uncommitted" state, it will run "after create" callbacks,
  # and if it's in the "updated.updated" state, "after update" callbacks.
  uncommitted: Tower.Model.State.create
    destroy: Ember.K

    enter: (stateMachine) ->
      dirtyType = Ember.get(@, 'dirtyType')
      record    = Ember.get(stateMachine, 'record')

      record.withTransaction (t) ->
        t.recordBecameDirty(dirtyType, record)

    exit: (stateMachine) ->
      record = Ember.get(stateMachine, 'record')
      stateMachine.send('invokeLifecycleCallbacks', record)

    willCommit: (stateMachine) ->
      # stateMachine.goToState('inTransaction')
      stateMachine.goToState('committing')

  , Uncommitted

  # When you first save/delete a model (persisting to server if you're on the client),
  # it will enter this state.
  #
  # On the client (since there is _one_ global transaction),
  # when it first enters this state, it tells that global transaction
  # to immediately move it back to the `clean` bucket.  The record
  # is still perhaps saving on the server, but we want it to _appear_ instant.
  #
  # Then, when the server responds with a success, it calls `stateMachine.send('didCommit')`,
  # which tells the "inFlight" state to transition to the "loaded" state.
  #
  # If the server responds with an error, it calls `stateMachine.send('becameInvalid')`,
  # which sets the errors on `record.errors` and tells the "inFlight" state to
  # transition to the "invalid" state.
  #
  # This is the state it enters when it's validating and calling before/after callbacks.
  committing: Tower.Model.State.create
    isSaving:      true

    enter: (stateMachine) ->
      dirtyType = Ember.get(@, 'dirtyType')
      record    = Ember.get(stateMachine, 'record')

      record.withTransaction (t) ->
        t.recordBecameClean(dirtyType, record)

    willCommit: (stateMachine, options, callback) ->
      record    = Ember.get(stateMachine, 'record')
      action    = Ember.get(stateMachine, 'dirtyType')

      record.withTransaction (transaction) ->
        transaction[action](record, callback)

    # Called from the store after the record is persisted.
    # The "loaded" state is as if the record was just loaded (page refresh).
    didCommit: (stateMachine) ->
      stateMachine.goToState('after')

    becameInvalid: Tower.Model.State.becameInvalid

  # You are free to delete a record if it's invalid, so calling `stateMachine.send('destroy')`
  # on the "invalid" state will transition it to the "deleted" state.
  #
  # If you set a property when the record is in the invalid state,
  # it will set the property and update `record.errors` hash.
  # If there are no more errors on the errors hash, the stateMachine will
  # transition out of the "invalid" state and into the "uncommitted" state.
  invalid: Tower.Model.State.create
    isValid:        false
    setAssociation: Tower.Model.State.setAssociation

    destroy: (stateMachine) ->
      stateMachine.goToState('deleted')

    setProperty: (stateMachine, context) ->
      Tower.Model.State.setProperty(stateMachine, context)

      record  = Ember.get(stateMachine, 'record')
      errors  = Ember.get(record, 'errors')
      key     = context.key

      delete errors[key]

      stateMachine.send('becameValid') unless _.hasDefinedProperties(errors)

    becameValid: (stateMachine) ->
      stateMachine.goToState('uncommitted')

module.exports = Tower.Model.State
