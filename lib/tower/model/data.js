var __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
};

Tower.Model.Data = (function() {

  function Data(record) {
    if (!record) {
      throw new Error('Data must be passed a record');
    }
    this.record = record;
    this.savedData = {};
    this.unsavedData = {};
  }

  __defineProperty(Data,  "get", function(key) {
    var result;
    result = Ember.get(this.unsavedData, key);
    if (result === void 0) {
      result = Ember.get(this.savedData, key);
    }
    return result;
  });

  __defineProperty(Data,  "set", function(key, value) {
    if (!this.record.get('isNew') && key === 'id') {
      return this.savedData[key] = value;
    }
    if (value === void 0 || this.savedData[key] === value) {
      delete this.unsavedData[key];
    } else {
      this.unsavedData[key] = value;
    }
    this.record.set('isDirty', _.isPresent(this.unsavedData));
    return value;
  });

  __defineProperty(Data,  "setSavedAttributes", function(object) {
    return _.extend(this.savedData, object);
  });

  __defineProperty(Data,  "commit", function() {
    _.extend(this.savedData, this.unsavedData);
    this.record.set('isDirty', false);
    return this.unsavedData = {};
  });

  __defineProperty(Data,  "rollback", function() {
    return this.unsavedData = {};
  });

  __defineProperty(Data,  "attributes", function() {
    return _.extend(this.savedData, this.unsavedData);
  });

  __defineProperty(Data,  "unsavedRelations", function() {
    var key, relations, result, value, _ref;
    relations = this.record.constructor.relations();
    result = {};
    _ref = this.unsavedData;
    for (key in _ref) {
      value = _ref[key];
      if (relations.hasOwnProperty(key)) {
        result[key] = value;
      }
    }
    return result;
  });

  /*
    push: (key, value) ->
      _.oneOrMany(@, @_push, key, value)
  
    pushEach: (key, value) ->
      _.oneOrMany(@, @_push, key, value, true)
  
    pull: (key, value) ->
      _.oneOrMany(@, @_pull, key, value)
  
    pullEach: (key, value) ->
      _.oneOrMany(@, @_pull, key, value, true)
  
    remove: @::pull
    removeEach: @::pullEach
  
    inc: (key, value) ->
      _.oneOrMany(@, @_inc, key, value)
  
    add: (key, value) ->
      _.oneOrMany(@, @_add, key, value)
  
    addEach: (key, value) ->
      _.oneOrMany(@, @_add, key, value, true)
  
    unset: ->
      keys = _.flatten _.args(arguments)
      delete @[key] for key in keys
      undefined
  
    # @private
    _set: (key, value) ->
      if Tower.Store.Modifiers.MAP.hasOwnProperty(key)
        @[key.replace('$', '')](value)
      else
        if value == undefined
          # TODO Ember.deletePath
          delete @unsavedData[key]
        else
          Ember.setPath(@unsavedData, key, value)
  
    # @private
    _push: (key, value, array = false) ->
      currentValue = @get(key)
      currentValue ||= []
  
      if array
        currentValue = currentValue.concat(_.castArray(value))
      else
        currentValue.push(value)
  
      # probably shouldn't reset it, need to consider
      Ember.set(@unsavedData, key, currentValue)
  
    # @private
    _pull: (key, value, array = false) ->
      currentValue = @get(key)
      return null unless currentValue
  
      if array
        for item in _.castArray(value)
          currentValue.splice(_.indexOf(currentValue, item), 1)
      else
        currentValue.splice(_.indexOf(currentValue, value), 1)
  
      # probably shouldn't reset it, need to consider
      Ember.set(@unsavedData, key, currentValue)
  
    # @private
    _add: (key, value, array = false) ->
      currentValue = @get(key)
      currentValue ||= []
  
      if array
        for item in _.castArray(value)
          currentValue.push(item) if _.indexOf(currentValue, item) == -1
      else
        currentValue.push(value) if _.indexOf(currentValue, value) == -1
  
      # probably shouldn't reset it, need to consider
      Ember.set(@unsavedData, key, currentValue)
  
    # @private
    _inc: (key, value) ->
      currentValue = @get(key)
      currentValue ||= 0
      currentValue += value
  
      Ember.set(@unsavedData, key, currentValue)
  */


  __defineProperty(Data,  "_getField", function(key) {
    return this.record.constructor.fields()[key];
  });

  __defineProperty(Data,  "_getRelation", function(key) {
    return this.record.constructor.relations()[key];
  });

  return Data;

})();

module.exports = Tower.Model.Data;
