retrieveFromCurrentState = Ember.computed((key) ->
  Ember.get(Ember.getPath(@, 'stateMachine.currentState'), key)
).property('stateMachine.currentState').cacheable()

Tower.Model.States =  
  isLoaded:  retrieveFromCurrentState
  isDirty:   retrieveFromCurrentState
  isSaving:  retrieveFromCurrentState
  isDeleted: retrieveFromCurrentState
  isError:   retrieveFromCurrentState
  
  # Check if this record has been saved to the database.
  isNew:     retrieveFromCurrentState
  isPending: retrieveFromCurrentState
  isValid:   retrieveFromCurrentState
  
  # Check if this record has not yet been saved to the database.
  #
  # @return [Boolean]
  #isNew: ->
  #  !!!@isPersisted()
  
  didLoad:    Ember.K
  didUpdate:  Ember.K
  didCreate:  Ember.K

module.exports = Tower.Model.States
