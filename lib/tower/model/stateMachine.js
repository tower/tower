var __defineProperty = function(clazz, key, value) {
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

Tower.Model.StateMachine = (function(_super) {
  var StateMachine;

  function StateMachine() {
    return StateMachine.__super__.constructor.apply(this, arguments);
  }

  StateMachine = __extends(StateMachine, _super);

  __defineProperty(StateMachine,  "record", null);

  __defineProperty(StateMachine,  "initialState", 'rootState');

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
          return stateMachine.goToState('loading');
        },
        didChangeData: function(stateMachine) {
          Tower.Model.State.didChangeData(stateMachine);
          return stateMachine.goToState('created');
        }
      }),
      loading: Tower.Model.State.create({
        didChangeData: function(stateMachine, data) {
          Tower.Model.State.didChangeData(stateMachine);
          return stateMachine.send('loadedData');
        },
        loadedData: function(stateMachine) {
          return stateMachine.goToState('saved');
        },
        exit: function(stateMachine) {
          var record;
          record = Ember.get(stateMachine, 'record');
          return record.fire('didLoad');
        }
      }),
      created: Tower.Model.State.Dirty.create({
        dirtyType: 'created',
        isNew: true,
        isLoaded: true,
        create: function(stateMachine, callback) {
          var record,
            _this = this;
          record = Ember.get(stateMachine, 'record');
          return record.runCallbacks('create', function(block) {
            var complete;
            complete = Tower.callbackChain(block, callback);
            return record.constructor.scoped({
              instantiate: false
            }).create(record, function(error) {
              return callback.call(record, error);
            });
          });
        },
        invokeLifecycleCallbacks: function(stateMachine, record) {
          return record.fire('didCreate');
        },
        destroy: function(stateMachine, callback) {
          this._super(stateMachine);
          return stateMachine.goToState('deleted.saved');
        }
      }),
      saved: Tower.Model.State.create({
        isLoaded: true,
        setProperty: function(stateMachine, context) {
          Tower.Model.State.setProperty(stateMachine, context);
          return stateMachine.goToState('updated');
        },
        setAssociation: function(stateMachine, context) {
          Tower.Model.State.setAssociation(stateMachine, context);
          return stateMachine.goToState('updated');
        },
        didChangeData: Tower.Model.State.didChangeData,
        destroy: function(stateMachine, callback) {
          stateMachine.goToState('deleted');
          return stateMachine.send('willCommit', callback);
        }
      }),
      updated: Tower.Model.State.Dirty.create({
        dirtyType: 'updated',
        isLoaded: true,
        update: function(stateMachine, callback) {
          var record,
            _this = this;
          record = Ember.get(stateMachine, 'record');
          return record.runCallbacks('update', function(block) {
            var complete;
            complete = Tower.callbackChain(block, callback);
            return record.constructor.scoped({
              instantiate: false
            }).update(record, updates, function(error) {
              return callback.call(record, error);
            });
          });
        },
        destroy: function(stateMachine, callback) {
          this._super(stateMachine);
          stateMachine.goToState('deleted');
          return stateMachine.send('willCommit', callback);
        },
        invokeLifecycleCallbacks: function(stateMachine, record) {
          return record.fire('didUpdate');
        }
      }),
      deleted: Tower.Model.State.create({
        isDeleted: true,
        isLoaded: true,
        isDirty: true,
        initialState: 'committing',
        saved: Tower.Model.State.create({
          isDirty: false
        }),
        committing: Tower.Model.State.create({
          willCommit: function(stateMachine, callback) {
            var record;
            record = Ember.get(stateMachine, 'record');
            return record.withTransaction(function(transaction) {
              return transaction.destroy(record, callback);
            });
          },
          didCommit: function(stateMachine) {
            return stateMachine.goToState('saved');
          },
          exit: function(stateMachine) {
            var record;
            record = Ember.get(stateMachine, 'record');
            return record.withTransaction(function(t) {
              return t.recordBecameClean('deleted', record);
            });
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
