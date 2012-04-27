var __defineStaticProperty = function(clazz, key, value) {
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

  return State;

})(Tower.State);

Tower.Model.State.Dirty = (function(_super) {
  var Dirty;

  function Dirty() {
    return Dirty.__super__.constructor.apply(this, arguments);
  }

  Dirty = __extends(Dirty, _super);

  __defineProperty(Dirty,  "initialState", 'uncommitted');

  __defineProperty(Dirty,  "isDirty", true);

  __defineProperty(Dirty,  "uncommitted", Tower.Model.State.create({
    setProperty: Tower.Model.State.setProperty,
    setAssociation: Tower.Model.State.setAssociation,
    enter: function(stateMachine) {
      var dirtyType, record;
      dirtyType = Ember.get(this, 'dirtyType');
      record = Ember.get(stateMachine, 'record');
      return record.withTransaction(function(t) {
        return t.recordBecameDirty(dirtyType, record);
      });
    },
    willCommit: function(stateMachine) {
      return stateMachine.goToState('committing');
    },
    save: function(stateMachine, callback) {
      stateMachine.goToState('committing');
      return stateMachine.send('save', callback);
    },
    destroy: function(stateMachine) {
      var dirtyType, record;
      record = Ember.get(stateMachine, 'record');
      dirtyType = Ember.get(this, 'dirtyType');
      return record.withTransaction(function(t) {
        return t.recordBecameClean(dirtyType, record);
      });
    },
    exit: function(stateMachine) {
      var record;
      record = Ember.get(stateMachine, 'record');
      return stateMachine.send('invokeLifecycleCallbacks', record);
    }
  }));

  __defineProperty(Dirty,  "committing", Tower.Model.State.create({
    isSaving: true,
    enter: function(stateMachine) {
      var dirtyType, record;
      dirtyType = Ember.get(this, 'dirtyType');
      record = Ember.get(stateMachine, 'record');
      return record.withTransaction(function(t) {
        return t.recordBecameClean(dirtyType, record);
      });
    },
    save: function(stateMachine, options) {
      var callback, record, respond,
        _this = this;
      callback = options.callback;
      record = Ember.get(stateMachine, 'record');
      respond = function(record, error) {
        if (error) {
          stateMachine.send('becameInvalid');
        }
        if (callback) {
          return callback.call(record, error);
        }
      };
      if (record.readOnly) {
        respond(record, new Error('Record is read only'));
        return;
      }
      if (options.validate !== false) {
        return record.validate(function(error) {
          if (error) {
            return respond(record, null);
          } else {
            return record._save(function(error) {
              return respond(record, error);
            });
          }
        });
      } else {
        return record._save(function(error) {
          return respond(record, error);
        });
      }
    },
    _save: function(stateMachine, callback) {
      var action, record,
        _this = this;
      record = Ember.get(stateMachine, 'record');
      action = Ember.get(stateMachine, 'dirtyType');
      return record.runCallbacks('save', function(block) {
        var complete;
        complete = Tower.callbackChain(block, callback);
        return stateMachine.send(action, complete);
      });
    },
    willCommit: function(stateMachine, callback) {
      var action, record;
      record = Ember.get(stateMachine, 'record');
      action = Ember.get(stateMachine, 'dirtyType');
      return record.withTransaction(function(transaction) {
        return transaction[action](record, callback);
      });
    },
    didCommit: function(stateMachine) {
      return stateMachine.goToState('saved');
    },
    becameInvalid: Tower.Model.State.becameInvalid
  }));

  __defineProperty(Dirty,  "invalid", Tower.Model.State.create({
    isValid: false,
    setAssociation: Tower.Model.State.setAssociation,
    destroy: function(stateMachine, callback) {
      stateMachine.goToState('deleted');
      return stateMachine.send('willCommit', callback);
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
