var CreatedUncommitted, Uncommitted, UpdatedUncommitted,
  __defineStaticProperty = function(clazz, key, value) {
  if(typeof clazz.__defineStaticProperty == 'function') return clazz.__defineStaticProperty(key, value);
  return clazz[key] = value;
},
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

Tower.Model.State = (function(_super) {
  var State, stateProperty;

  function State() {
    return State.__super__.constructor.apply(this, arguments);
  }

  State = __extends(State, _super);

  __defineStaticProperty(State,  "setProperty", function(stateMachine, context) {
    var data, key, record, value;
    key = context.key;
    value = context.value;
    record = Ember.get(stateMachine, 'record');
    data = Ember.get(record, 'data');
    return Ember.set(data, key, value);
  });

  __defineStaticProperty(State,  "setAssociation", function(stateMachine, context) {
    var data, key, record, value;
    key = context.key;
    value = context.value;
    record = Ember.get(stateMachine, 'record');
    data = Ember.get(record, 'data');
    return data.setAssociation(key, value);
  });

  __defineStaticProperty(State,  "didChangeData", function(stateMachine) {
    var data, record;
    record = Ember.get(stateMachine, 'record');
    data = Ember.get(record, 'data');
    data._savedData = null;
    return record.notifyPropertyChange('data');
  });

  __defineStaticProperty(State,  "becameInvalid", function(stateMachine, errors) {
    var record;
    record = Ember.get(stateMachine, 'record');
    Ember.set(record, 'errors', errors);
    return stateMachine.goToState('invalid');
  });

  __defineStaticProperty(State,  "waitingOn", function(stateMachine, object) {
    var objectGuid, observer, pendingQueue, record;
    record = Ember.get(stateMachine, 'record');
    pendingQueue = Ember.get(record, 'pendingQueue');
    objectGuid = Ember.guidFor(object);
    observer = function() {
      if (Ember.get(object, 'id')) {
        stateMachine.send('doneWaitingOn', object);
        return Ember.removeObserver(object, 'id', observer);
      }
    };
    pendingQueue[objectGuid] = [object, observer];
    return Ember.addObserver(object, 'id', observer);
  });

  __defineStaticProperty(State,  "doneWaitingOn", function(stateMachine, object) {
    var objectGuid, pendingQueue, record;
    record = Ember.get(stateMachine, 'record');
    pendingQueue = Ember.get(record, 'pendingQueue');
    objectGuid = Ember.guidFor(object);
    delete pendingQueue[objectGuid];
    if (_.isEmptyObject(pendingQueue)) {
      return stateMachine.send('doneWaiting');
    }
  });

  stateProperty = Ember.computed(function(key) {
    var parent;
    parent = Ember.get(this, 'parentState');
    if (parent) {
      return Ember.get(parent, key);
    }
  }).property();

  __defineProperty(State,  "isLoaded", stateProperty);

  __defineProperty(State,  "isDirty", stateProperty);

  __defineProperty(State,  "isSaving", stateProperty);

  __defineProperty(State,  "isDeleted", stateProperty);

  __defineProperty(State,  "isError", stateProperty);

  __defineProperty(State,  "isNew", stateProperty);

  __defineProperty(State,  "isValid", stateProperty);

  __defineProperty(State,  "isPending", stateProperty);

  __defineProperty(State,  "dirtyType", stateProperty);

  __defineStaticProperty(State,  "Uncommitted", Ember.Mixin.create({
    setProperty: State.setProperty,
    setAssociation: State.setAssociation,
    save: function(stateMachine, options, callback) {
      var record;
      record = Ember.get(stateMachine, 'record');
      if (record.readOnly) {
        throw new Error('Record is read only');
      }
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});
      if (options.validate !== false) {
        return stateMachine.goToState('validating', callback);
      } else {
        return stateMachine.goToState('committing', callback);
      }
    },
    validating: Tower.Model.State.create({
      enter: function(stateMachine) {
        var record,
          _this = this;
        record = Ember.get(stateMachine, 'record');
        return record.validate(function(error) {
          if (error) {
            if (callback) {
              return callback.call(record, null, false);
            }
          } else {
            return stateMachine.goToState('committing', callback);
          }
        });
      }
    }),
    committing: Tower.Model.State.create({
      start: Tower.Model.State.create({
        enter: function(stateMachine, callback) {
          return stateMachine.send('willCreate', {
            callback: callback
          });
        },
        willCreate: function(stateMachine, callback) {
          var record,
            _this = this;
          record = Ember.get(stateMachine, 'record');
          return record.runCallbacks('create', function(block) {
            var complete;
            complete = Tower.callbackChain(block, callback);
            return record.withTransaction(function(transaction) {
              var _this = this;
              return transaction.create(record, function(error) {
                if (error && !callback) {
                  throw error;
                }
                if (!transaction.autocommit) {
                  return stateMachine.goToState('inTransaction');
                }
              });
            });
          });
        }
      }),
      willCommit: function(stateMachine) {
        return stateMachine.goToState('inFlight');
      },
      inTransaction: Tower.Model.State.create({
        enter: function(stateMachine) {
          var record, transaction;
          record = Ember.get(stateMachine, 'record');
          transaction = record.get('transaction');
          return inTransaction;
        }
      })
    }),
    willUpdate: function(stateMachine, attributes, callback) {
      var record,
        _this = this;
      record = Ember.get(stateMachine, 'record');
      record.runCallbacks('update', function(block) {
        var complete;
        complete = Tower.callbackChain(block, callback);
        return record.withTransaction(function(transaction) {
          transaction.update(record);
          return complete.call(_this, error);
        });
      });
      return;
    },
    destroy: function(stateMachine, callback) {
      var record;
      record = Ember.get(stateMachine, 'record');
      if (this.get('isNew')) {
        if (callback) {
          callback.call(this, null);
        }
      } else {
        this._destroy(callback);
      }
      return this;
    },
    willDestroy: function(callback) {
      var id, record,
        _this = this;
      record = Ember.get(stateMachine, 'record');
      id = this.get('id');
      this.runCallbacks('destroy', function(block) {
        var complete;
        complete = Tower.callbackChain(block, callback);
        return _this.constructor.scoped({
          instantiate: false
        }).destroy(_this, function(error) {
          if (error && !callback) {
            throw error;
          }
          if (!error) {
            return _this.destroyRelations(function(error) {
              _this.persistent = false;
              delete _this.attributes.id;
              return complete.call(_this, error);
            });
          } else {
            return complete.call(_this, error);
          }
        });
      });
      return;
    },
    destroyNew: function(stateMachine) {
      var dirtyType, record;
      this._super(stateMachine);
      record = Ember.get(stateMachine, 'record');
      dirtyType = Ember.get(this, 'dirtyType');
      return record.withTransaction(function(t) {
        return t.recordBecameClean(dirtyType, record);
      });
    }
  }));

  __defineStaticProperty(State,  "CreatedUncommitted", Ember.Mixin.create({
    destroy: function(stateMachine) {
      this._super(stateMachine);
      return stateMachine.goToState('deleted.saved');
    }
  }));

  __defineStaticProperty(State,  "UpdatedUncommitted", Ember.Mixin.create({
    destroy: function(stateMachine) {
      var record;
      this._super(stateMachine);
      record = Ember.get(stateMachine, 'record');
      record.withTransaction(function(t) {
        return t.recordBecameClean('created', record);
      });
      return stateMachine.goToState('deleted');
    }
  }));

  return State;

})(Tower.State);

Uncommitted = Tower.Model.State.Uncommitted;

CreatedUncommitted = Tower.Model.State.CreatedUncommitted;

UpdatedUncommitted = Tower.Model.State.UpdatedUncommitted;

Tower.Model.State.Dirty = (function(_super) {
  var Dirty;

  function Dirty() {
    return Dirty.__super__.constructor.apply(this, arguments);
  }

  Dirty = __extends(Dirty, _super);

  __defineProperty(Dirty,  "initialState", 'uncommitted');

  __defineProperty(Dirty,  "isDirty", true);

  __defineProperty(Dirty,  "uncommitted", Tower.Model.State.create({
    destroy: Ember.K,
    enter: function(stateMachine) {
      var dirtyType, record;
      dirtyType = Ember.get(this, 'dirtyType');
      record = Ember.get(stateMachine, 'record');
      return record.withTransaction(function(t) {
        return t.recordBecameDirty(dirtyType, record);
      });
    },
    exit: function(stateMachine) {
      var record;
      record = Ember.get(stateMachine, 'record');
      return stateMachine.send('invokeLifecycleCallbacks', record);
    },
    waitingOn: function(stateMachine, object) {
      Tower.Model.State.waitingOn(stateMachine, object);
      return stateMachine.goToState('pending');
    },
    willCommit: function(stateMachine) {
      return stateMachine.goToState('committing');
    }
  }, Uncommitted));

  __defineProperty(Dirty,  "pending", Tower.Model.State.create({
    initialState: 'uncommitted',
    isPending: true,
    uncommitted: Tower.Model.State.create({
      destroy: function(stateMachine) {
        var object, observer, pendingQueue, property, record, _ref, _results;
        record = Ember.get(stateMachine, 'record');
        pendingQueue = Ember.get(record, 'pendingQueue');
        _results = [];
        for (property in pendingQueue) {
          if (!pendingQueue.hasOwnProperty(property)) {
            continue;
          }
          _ref = pendingQueue[property], object = _ref[0], observer = _ref[1];
          _results.push(Ember.removeObserver(object, 'id', observer));
        }
        return _results;
      },
      willCommit: function(stateMachine) {
        return stateMachine.goToState('committing');
      },
      doneWaitingOn: Tower.Model.State.doneWaitingOn,
      doneWaiting: function(stateMachine) {
        var dirtyType;
        dirtyType = Ember.get(this, 'dirtyType');
        return stateMachine.goToState("" + dirtyType + ".uncommitted");
      }
    }, Uncommitted)
  }));

  __defineProperty(Dirty,  "committing", Tower.Model.State.create({
    isSaving: true,
    doneWaitingOn: Tower.Model.State.doneWaitingOn,
    doneWaiting: function(stateMachine) {
      var record, transaction;
      record = Ember.get(stateMachine, 'record');
      transaction = Ember.get(record, 'transaction');
      return Ember.run.once(transaction, transaction.commit);
    },
    willCommit: function(stateMachine) {
      var dirtyType;
      dirtyType = Ember.get(this, 'dirtyType');
      return stateMachine.goToState('before');
    },
    becameInvalid: Tower.Model.State.becameInvalid,
    before: Tower.Model.State.create({
      didChangeData: Tower.Model.State.didChangeData,
      becameInvalid: Tower.Model.State.becameInvalid,
      didBeforeCommit: function(stateMachine) {
        return stateMachine.goToState('inTransaction');
      }
    }),
    after: Tower.Model.State.create({
      didChangeData: Tower.Model.State.didChangeData,
      becameInvalid: Tower.Model.State.becameInvalid,
      didAfterCommit: function(stateMachine) {
        return stateMachine.goToState('loaded');
      }
    }),
    inFlight: Tower.Model.State.create({
      isSaving: true,
      didChangeData: Tower.Model.State.didChangeData,
      enter: function(stateMachine) {
        var dirtyType, record;
        dirtyType = Ember.get(this, 'dirtyType');
        record = Ember.get(stateMachine, 'record');
        return record.withTransaction(function(t) {
          return t.recordBecameClean(dirtyType, record);
        });
      },
      didCommit: function(stateMachine) {
        return stateMachine.goToState('after');
      },
      becameInvalid: Tower.Model.State.becameInvalid
    })
  }));

  __defineProperty(Dirty,  "invalid", Tower.Model.State.create({
    isValid: false,
    setAssociation: Tower.Model.State.setAssociation,
    destroy: function(stateMachine) {
      return stateMachine.goToState('deleted');
    },
    setProperty: function(stateMachine, context) {
      var errors, key, record;
      Tower.Model.State.setProperty(stateMachine, context);
      record = Ember.get(stateMachine, 'record');
      errors = Ember.get(record, 'errors');
      key = context.key;
      delete errors[key];
      if (!_.hasDefinedProperties(errors)) {
        return stateMachine.send('becameValid');
      }
    },
    becameValid: function(stateMachine) {
      return stateMachine.goToState('uncommitted');
    }
  }));

  return Dirty;

})(Tower.Model.State);

module.exports = Tower.Model.State;
