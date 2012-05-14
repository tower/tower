var __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
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
    if (Tower.Store.Modifiers.MAP.hasOwnProperty(key)) {
      this[key.replace('$', '')](value);
    } else {
      if (!this.record.get('isNew') && key === 'id') {
        return this.savedData[key] = value;
      }
      if (value === void 0 || this.savedData[key] === value) {
        delete this.unsavedData[key];
      } else {
        this.unsavedData[key] = value;
      }
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

  __defineProperty(Data,  "push", function(key, value) {
    return _.oneOrMany(this, this._push, key, value);
  });

  __defineProperty(Data,  "pushEach", function(key, value) {
    return _.oneOrMany(this, this._push, key, value, true);
  });

  __defineProperty(Data,  "pull", function(key, value) {
    return _.oneOrMany(this, this._pull, key, value);
  });

  __defineProperty(Data,  "pullEach", function(key, value) {
    return _.oneOrMany(this, this._pull, key, value, true);
  });

  __defineProperty(Data,  "remove", Data.prototype.pull);

  __defineProperty(Data,  "removeEach", Data.prototype.pullEach);

  __defineProperty(Data,  "inc", function(key, value) {
    return _.oneOrMany(this, this._inc, key, value);
  });

  __defineProperty(Data,  "add", function(key, value) {
    return _.oneOrMany(this, this._add, key, value);
  });

  __defineProperty(Data,  "addEach", function(key, value) {
    return _.oneOrMany(this, this._add, key, value, true);
  });

  __defineProperty(Data,  "unset", function() {
    var key, keys, _i, _len;
    keys = _.flatten(_.args(arguments));
    for (_i = 0, _len = keys.length; _i < _len; _i++) {
      key = keys[_i];
      delete this[key];
    }
    return void 0;
  });

  __defineProperty(Data,  "_set", function(key, value) {
    if (Tower.Store.Modifiers.MAP.hasOwnProperty(key)) {
      return this[key.replace('$', '')](value);
    } else {
      if (value === void 0) {
        return delete this.unsavedData[key];
      } else {
        return Ember.setPath(this.unsavedData, key, value);
      }
    }
  });

  __defineProperty(Data,  "_push", function(key, value, array) {
    var currentValue;
    if (array == null) {
      array = false;
    }
    currentValue = this.get(key);
    currentValue || (currentValue = []);
    if (array) {
      currentValue = currentValue.concat(_.castArray(value));
    } else {
      currentValue.push(value);
    }
    return Ember.set(this.unsavedData, key, currentValue);
  });

  __defineProperty(Data,  "_pull", function(key, value, array) {
    var currentValue, item, _i, _len, _ref;
    if (array == null) {
      array = false;
    }
    currentValue = this.get(key);
    if (!currentValue) {
      return null;
    }
    if (array) {
      _ref = _.castArray(value);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        currentValue.splice(_.toStringIndexOf(currentValue, item), 1);
      }
    } else {
      currentValue.splice(_.toStringIndexOf(currentValue, value), 1);
    }
    return Ember.set(this.unsavedData, key, currentValue);
  });

  __defineProperty(Data,  "_add", function(key, value, array) {
    var currentValue, item, _i, _len, _ref;
    if (array == null) {
      array = false;
    }
    currentValue = this.get(key);
    currentValue || (currentValue = []);
    if (array) {
      _ref = _.castArray(value);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (_.indexOf(currentValue, item) === -1) {
          currentValue.push(item);
        }
      }
    } else {
      if (_.indexOf(currentValue, value) === -1) {
        currentValue.push(value);
      }
    }
    return Ember.set(this.unsavedData, key, currentValue);
  });

  __defineProperty(Data,  "_inc", function(key, value) {
    var currentValue;
    currentValue = this.get(key);
    currentValue || (currentValue = 0);
    currentValue += value;
    return Ember.set(this.unsavedData, key, currentValue);
  });

  __defineProperty(Data,  "_getField", function(key) {
    return this.record.constructor.fields()[key];
  });

  __defineProperty(Data,  "_getRelation", function(key) {
    return this.record.constructor.relations()[key];
  });

  return Data;

})();

module.exports = Tower.Model.Data;
