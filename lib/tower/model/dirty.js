
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
