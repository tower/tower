Metro.Model.Dirty = (function() {
  function Dirty() {}
  Dirty.prototype.isDirty = function() {
    var change, changes;
    changes = this.changes();
    for (change in changes) {
      return true;
    }
    return false;
  };
  Dirty.prototype.changes = function() {
    return this._changes || (this._changes = {});
  };
  Dirty.prototype._trackChangedAttribute = function(attribute, value) {
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
  };
  return Dirty;
})();
module.exports = Metro.Model.Dirty;