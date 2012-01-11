
Tower.Model.Dirty = {
  isDirty: function() {
    return Tower.Support.Object.isPresent(this.changes);
  },
  _attributeChange: function(attribute, value) {
    var array, beforeValue, _base;
    array = (_base = this.changes)[attribute] || (_base[attribute] = []);
    beforeValue = array[0] || (array[0] = this.attributes[attribute]);
    array[1] = value;
    if (array[0] === array[1]) array = null;
    if (array) {
      this.changes[attribute] = array;
    } else {
      delete this.changes[attribute];
    }
    return beforeValue;
  },
  attributeChanged: function(name) {
    var change;
    change = this.changes[name];
    if (!change) return false;
    return change[0] !== change[1];
  },
  attributeChange: function(name) {
    var change;
    change = this.changes[name];
    if (!change) return;
    return change[1];
  },
  attributeWas: function(name) {
    var change;
    change = this.changes[name];
    if (!change) return;
    return change[0];
  },
  resetAttribute: function(name) {},
  toUpdates: function() {
    var array, attributes, key, result, _ref;
    result = {};
    attributes = this.attributes;
    _ref = this.changes;
    for (key in _ref) {
      array = _ref[key];
      result[key] = attributes[key];
    }
    return result;
  }
};

module.exports = Tower.Model.Dirty;
