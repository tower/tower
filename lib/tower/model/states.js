var retrieveFromCurrentState;

retrieveFromCurrentState = Ember.computed(function(key) {
  return Ember.get(Ember.getPath(this, 'stateMachine.currentState'), key);
}).property('stateMachine.currentState').cacheable();

Tower.Model.States = {
  isLoaded: retrieveFromCurrentState,
  isDirty: retrieveFromCurrentState,
  isSaving: retrieveFromCurrentState,
  isDeleted: retrieveFromCurrentState,
  isError: retrieveFromCurrentState,
  isNew: retrieveFromCurrentState,
  isPending: retrieveFromCurrentState,
  isValid: retrieveFromCurrentState,
  isPersisted: function() {
    return !!this.persistent;
  },
  didLoad: Ember.K,
  didUpdate: Ember.K,
  didCreate: Ember.K
};

module.exports = Tower.Model.States;
