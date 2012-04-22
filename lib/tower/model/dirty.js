
Tower.Model.Dirty = {
  InstanceMethods: {
    isDirty: function() {
      return _.isPresent(this.changes);
    },
    attributeChanged: function(name) {
      var after, before, key, value, _ref;
      _ref = this.changes, before = _ref.before, after = _ref.after;
      if (_.isBlank(before)) {
        return false;
      }
      before = before[name];
      for (key in after) {
        value = after[key];
        if (value.hasOwnProperty(name)) {
          after = value;
          break;
        }
      }
      if (!after) {
        return false;
      }
      return before !== after;
    },
    attributeChange: function(name) {
      var change;
      change = this.changes[name];
      if (!change) {
        return;
      }
      return change[1];
    },
    attributeWas: function(name) {
      var change;
      change = this.changes.before[name];
      if (change === void 0) {
        return;
      }
      return change;
    },
    resetAttribute: function(name) {
      var array;
      array = this.changes[name];
      if (array) {
        this.set(name, array[0]);
      }
      return this;
    },
    toUpdates: function() {
      var array, attributes, key, result, _ref;
      result = {};
      attributes = this.attributes;
      _ref = this.changes;
      for (key in _ref) {
        array = _ref[key];
        if (!key.match(/(before|after)/)) {
          result[key] = attributes[key];
        }
      }
      result.updatedAt || (result.updatedAt = new Date);
      return result;
    },
    _attributeChange: function(attribute, value) {
      var array, beforeValue, _base;
      array = (_base = this.changes)[attribute] || (_base[attribute] = []);
      beforeValue = array[0] || (array[0] = this.attributes[attribute]);
      array[1] = value;
      if (array[0] === array[1]) {
        array = null;
      }
      if (array) {
        this.changes[attribute] = array;
      } else {
        delete this.changes[attribute];
      }
      return beforeValue;
    },
    _resetChanges: function() {
      return this.changes = {
        before: {},
        after: {}
      };
    }
  }
};

module.exports = Tower.Model.Dirty;
