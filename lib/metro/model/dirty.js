(function() {
  var Dirty;
  Dirty = (function() {
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
      var _ref;
      return (_ref = this._changes) != null ? _ref : this._changes = {};
    };
    Dirty.prototype._trackChangedAttribute = function(attribute, value) {
      var array, beforeValue, _base, _ref, _ref2;
      array = (_ref = (_base = this.changes)[attribute]) != null ? _ref : _base[attribute] = [];
      beforeValue = (_ref2 = array[0]) != null ? _ref2 : array[0] = this.attributes[attribute];
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
  module.exports = Dirty;
}).call(this);
