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
    save: function(stateMachine, context) {
      stateMachine.goToState('committing');
      return stateMachine.send('save', context);
    },
    destroy: function(stateMachine) {
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

Tower.Model.State.Dirty = Tower.Model.State.extend({
  initialState: 'uncommitted',
  isDirty: true,
  uncommitted: Tower.Model.State.create({
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
    willCommit: function(stateMachine) {
      return stateMachine.goToState('committing');
    }
  }, Uncommitted),
  committing: Tower.Model.State.create({
    isSaving: true,
    enter: function(stateMachine) {
      var dirtyType, record;
      dirtyType = Ember.get(this, 'dirtyType');
      record = Ember.get(stateMachine, 'record');
      return record.withTransaction(function(t) {
        return t.recordBecameClean(dirtyType, record);
      });
    },
    willCommit: function(stateMachine, options, callback) {
      var action, record;
      record = Ember.get(stateMachine, 'record');
      action = Ember.get(stateMachine, 'dirtyType');
      return record.withTransaction(function(transaction) {
        return transaction[action](record, callback);
      });
    },
    didCommit: function(stateMachine) {
      return stateMachine.goToState('after');
    },
    becameInvalid: Tower.Model.State.becameInvalid
  }),
  invalid: Tower.Model.State.create({
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
  })
});

module.exports = Tower.Model.State;
