var __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
};

Tower.Model.Data = (function() {

  function Data(record) {
    if (!record) {
      throw new Error("Data must be passed a record");
    }
    this.record = record;
    this.savedData = {};
    this.dataSnapshot = {};
    this.unsavedData = {};
    this.relations = {};
    this.attachments = {};
  }

  __defineProperty(Data,  "get", function(key) {
    var result;
    result = _.getNestedAttribute(this.unsavedData, key);
    if (typeof result === 'undefined') {
      result = _.getNestedAttribute(this.savedData, key);
    }
    return result;
  });

  __defineProperty(Data,  "set", function(key, value) {
    return _.oneOrMany(this, this._set, key, value);
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
    keys = _.flatten(Tower.args(arguments));
    for (_i = 0, _len = keys.length; _i < _len; _i++) {
      key = keys[_i];
      delete this[key];
    }
    return;
  });

  __defineProperty(Data,  "commit", function() {
    _.extend(this.savedData, this.unsavedData);
    return this.unsavedData = {};
  });

  __defineProperty(Data,  "rollback", function() {
    return this.unsavedData = {};
  });

  __defineProperty(Data,  "unknownProperty", function(key) {
    var relation, relations, savedData, store, unsavedData, value;
    unsavedData = this.unsavedData;
    relations = this.relations;
    savedData = this.savedData;
    value = unsavedData[key];
    relation = void 0;
    relation = relations[key];
    if (typeof relation !== 'undefined') {
      store = Ember.get(this.record, "store");
      return store.clientIdToId[relation];
    }
    if (savedData && value === undefined) {
      value = savedData[key];
    }
    return value;
  });

  __defineProperty(Data,  "setUnknownProperty", function(key, value) {
    var record, unsavedData;
    record = this.record;
    unsavedData = this.unsavedData;
    unsavedData[key] = value;
    record.hashWasUpdated();
    return value;
  });

  __defineProperty(Data,  "_set", function(key, value) {
    if (Tower.Store.Modifiers.MAP.hasOwnProperty(key)) {
      return this[key.replace("$", "")](value);
    } else {
      return Ember.set(this.unsavedData, key, value);
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
        currentValue.splice(_.indexOf(currentValue, item), 1);
      }
    } else {
      currentValue.splice(_.indexOf(currentValue, value), 1);
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
