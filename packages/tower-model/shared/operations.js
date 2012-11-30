var _;

_ = Tower._;

Tower.ModelOperations = {
  push: function(key, value) {
    return _.oneOrMany(this, this._push, key, value);
  },
  pushEach: function(key, value) {
    return _.oneOrMany(this, this._push, key, value, true);
  },
  pull: function(key, value) {
    return _.oneOrMany(this, this._pull, key, value);
  },
  pullEach: function(key, value) {
    return _.oneOrMany(this, this._pull, key, value, true);
  },
  inc: function(key, value) {
    return _.oneOrMany(this, this._inc, key, value);
  },
  add: function(key, value) {
    return _.oneOrMany(this, this._add, key, value);
  },
  addEach: function(key, value) {
    return _.oneOrMany(this, this._add, key, value, true);
  },
  unset: function() {
    var key, keys, _i, _len;
    keys = _.flatten(_.args(arguments));
    for (_i = 0, _len = keys.length; _i < _len; _i++) {
      key = keys[_i];
      delete this[key];
    }
    return void 0;
  },
  _set: function(key, value) {
    if (Tower.StoreModifiers.MAP.hasOwnProperty(key)) {
      return this[key.replace('$', '')](value);
    } else {
      return this;
    }
  },
  _push: function(key, value, array) {
    var currentValue;
    if (array == null) {
      array = false;
    }
    currentValue = this.getAttribute(key);
    currentValue || (currentValue = []);
    currentValue = this._clonedValue(currentValue);
    if (array) {
      currentValue = currentValue.concat(_.castArray(value));
    } else {
      currentValue.push(value);
    }
    return this._actualSet(key, currentValue, true);
  },
  _pull: function(key, value, array) {
    var currentValue, item, _i, _len, _ref;
    if (array == null) {
      array = false;
    }
    currentValue = this._clonedValue(this.getAttribute(key));
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
    return this._actualSet(key, currentValue, true);
  },
  _add: function(key, value, array) {
    var currentValue, item, _i, _len, _ref;
    if (array == null) {
      array = false;
    }
    currentValue = this.getAttribute(key);
    currentValue || (currentValue = []);
    currentValue = this._clonedValue(currentValue, true);
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
    return this._actualSet(key, currentValue, true);
  },
  _inc: function(key, value) {
    var currentValue;
    currentValue = this.getAttribute(key);
    currentValue || (currentValue = 0);
    currentValue += value;
    return this._actualSet(key, currentValue, true);
  },
  _getField: function(key) {
    return this.constructor.fields()[key];
  },
  _clonedValue: function(value) {
    if (_.isArray(value)) {
      return value.concat();
    } else if (_.isDate(value)) {
      return new Date(value.getTime());
    } else if (typeof value === 'object') {
      return _.clone(value);
    } else {
      return value;
    }
  },
  _defaultValue: function(key) {
    var field;
    if (field = this._getField(key)) {
      return field.defaultValue(this);
    }
  }
};

Tower.ModelOperations.remove = Tower.ModelOperations.pull;

Tower.ModelOperations.removeEach = Tower.ModelOperations.pullEach;

module.exports = Tower.ModelOperations;
