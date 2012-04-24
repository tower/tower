var createdState, updatedState,
  __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) { 
    if(typeof parent.__extend == 'function') return parent.__extend(child);
      
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if(typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

createdState = Tower.Model.State.Dirty.create({
  dirtyType: "created",
  isNew: true,
  invokeLifecycleCallbacks: function(stateMachine, record) {
    return record.fire("didCreate");
  }
});

updatedState = Tower.Model.State.Dirty.create({
  dirtyType: "updated",
  invokeLifecycleCallbacks: function(stateMachine, record) {
    return record.fire("didUpdate");
  }
});

createdState.states.uncommitted.reopen(Tower.Model.State.CreatedUncommitted);

createdState.states.pending.states.uncommitted.reopen(Tower.Model.State.CreatedUncommitted);

updatedState.states.uncommitted.reopen(Tower.Model.State.UpdatedUncommitted);

updatedState.states.pending.states.uncommitted.reopen(Tower.Model.State.UpdatedUncommitted);

Tower.Model.StateMachine = (function(_super) {
  var StateMachine;

  function StateMachine() {
    return StateMachine.__super__.constructor.apply(this, arguments);
  }

  StateMachine = __extends(StateMachine, _super);

  __defineProperty(StateMachine,  "record", null);

  __defineProperty(StateMachine,  "initialState", "rootState");

  __defineProperty(StateMachine,  "states", {
    rootState: Tower.State.create({
      isLoaded: false,
      isDirty: false,
      isSaving: false,
      isDeleted: false,
      isError: false,
      isNew: false,
      isValid: true,
      isPending: false,
      empty: Tower.Model.State.create({
        loadingData: function(stateMachine) {
          return stateMachine.goToState("loading");
        },
        didChangeData: function(stateMachine) {
          Tower.Model.State.didChangeData(stateMachine);
          return stateMachine.goToState("loaded.created");
        }
      }),
      loading: Tower.Model.State.create({
        exit: function(stateMachine) {
          var record;
          record = Ember.get(stateMachine, "record");
          return record.fire("didLoad");
        },
        didChangeData: function(stateMachine, data) {
          Tower.Model.State.didChangeData(stateMachine);
          return stateMachine.send("loadedData");
        },
        loadedData: function(stateMachine) {
          return stateMachine.goToState("loaded");
        }
      }),
      loaded: Tower.Model.State.create({
        initialState: "saved",
        isLoaded: true,
        created: createdState,
        updated: updatedState,
        saved: Tower.Model.State.create({
          setProperty: function(stateMachine, context) {
            Tower.Model.State.setProperty(stateMachine, context);
            return stateMachine.goToState("updated");
          },
          setAssociation: function(stateMachine, context) {
            Tower.Model.State.setAssociation(stateMachine, context);
            return stateMachine.goToState("updated");
          },
          didChangeData: Tower.Model.State.didChangeData,
          destroy: function(stateMachine) {
            return stateMachine.goToState("deleted");
          },
          waitingOn: function(stateMachine, object) {
            Tower.Model.State.waitingOn(stateMachine, object);
            return stateMachine.goToState("updated.pending");
          }
        })
      }),
      deleted: Tower.Model.State.create({
        isDeleted: true,
        isLoaded: true,
        isDirty: true,
        saved: Tower.Model.State.create({
          isDirty: false
        }),
        start: Tower.Model.State.create({
          enter: function(stateMachine) {
            var record, store;
            record = Ember.get(stateMachine, "record");
            store = Ember.get(record, "store");
            if (store) {
              store.removeFromCursors(record);
            }
            return record.withTransaction(function(t) {
              return t.recordBecameDirty("deleted", record);
            });
          },
          willCommit: function(stateMachine) {
            return stateMachine.goToState("inFlight");
          }
        }),
        inFlight: Tower.Model.State.create({
          isSaving: true,
          exit: function(stateMachine) {
            var record;
            record = Ember.get(stateMachine, "record");
            return record.withTransaction(function(t) {
              return t.recordBecameClean("deleted", record);
            });
          },
          didCommit: function(stateMachine) {
            return stateMachine.goToState("saved");
          }
        })
      }),
      error: Tower.Model.State.create({
        isError: true
      })
    })
  });

  return StateMachine;

})(Tower.StateMachine);

module.exports = Tower.Model.StateMachine;
