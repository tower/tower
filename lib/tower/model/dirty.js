
Tower.Model.Dirty = {
  InstanceMethods: {
    operation: function(block) {
      var completeOperation,
        _this = this;
      if (this._currentOperation) {
        return block();
      }
      if (this.operationIndex !== this.operations.length) {
        this.operations.splice(this.operationIndex, this.operations.length);
      }
      this._currentOperation = {};
      completeOperation = function() {
        _this.operations.push(_this._currentOperation);
        delete _this._currentOperation;
        return _this.operationIndex = _this.operations.length;
      };
      switch (block.length) {
        case 0:
          block.call(this);
          return completeOperation();
        default:
          return block.call(this, function() {
            return completeOperation();
          });
      }
    },
    undo: function(amount) {
      var key, nextIndex, operation, operations, prevIndex, value, _i, _len, _ref;
      if (amount == null) {
        amount = 1;
      }
      prevIndex = this.operationIndex;
      nextIndex = this.operationIndex = Math.max(this.operationIndex - amount, -1);
      if (prevIndex === nextIndex) {
        return;
      }
      operations = this.operations.slice(nextIndex, prevIndex).reverse();
      for (_i = 0, _len = operations.length; _i < _len; _i++) {
        operation = operations[_i];
        _ref = operation.$before;
        for (key in _ref) {
          value = _ref[key];
          this.attributes[key] = value;
        }
      }
      return this;
    },
    redo: function(amount) {
      var key, nextIndex, operation, operations, prevIndex, value, _i, _len, _ref;
      if (amount == null) {
        amount = 1;
      }
      prevIndex = this.operationIndex;
      nextIndex = this.operationIndex = Math.min(this.operationIndex + amount, this.operations.length);
      if (prevIndex === nextIndex) {
        return;
      }
      operations = this.operations.slice(prevIndex, nextIndex);
      for (_i = 0, _len = operations.length; _i < _len; _i++) {
        operation = operations[_i];
        _ref = operation.$after;
        for (key in _ref) {
          value = _ref[key];
          this.attributes[key] = value;
        }
      }
      return this;
    },
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
        result[key] = attributes[key];
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
