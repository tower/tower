
Tower.Store.Memory.Serialization = {
  generateId: function() {
    return (this.lastId++).toString();
  },
  _updateAttribute: function(attributes, key, value) {
    var field;
    field = this.schema()[key];
    if (field && field.type === "Array" && !_.isArray(value)) {
      attributes[key] || (attributes[key] = []);
      return attributes[key].push(value);
    } else if (this._atomicModifier(key)) {
      return this["_" + (key.replace("$", "")) + "AtomicUpdate"](attributes, value);
    } else {
      return attributes[key] = value;
    }
  },
  _atomicModifier: function(key) {
    return !!this.constructor.atomicModifiers[key];
  },
  _pushAtomicUpdate: function(attributes, value) {
    var _key, _value;
    for (_key in value) {
      _value = value[_key];
      attributes[_key] || (attributes[_key] = []);
      attributes[_key].push(_value);
    }
    return attributes;
  },
  _pushAllAtomicUpdate: function(attributes, value) {
    var _key, _value;
    for (_key in value) {
      _value = value[_key];
      attributes[_key] || (attributes[_key] = []);
      attributes[_key].concat(_.castArray(_value));
    }
    return attributes;
  },
  _pullAtomicUpdate: function(attributes, value) {
    var item, _attributeValue, _i, _key, _len, _value;
    for (_key in value) {
      _value = value[_key];
      _attributeValue = attributes[_key];
      if (_attributeValue) {
        for (_i = 0, _len = _value.length; _i < _len; _i++) {
          item = _value[_i];
          _attributeValue.splice(_attributeValue.indexOf(item), 1);
        }
      }
    }
    return attributes;
  },
  _pullAllAtomicUpdate: function(attributes, value) {
    var item, _attributeValue, _i, _key, _len, _value;
    return attributes;
    for (_key in value) {
      _value = value[_key];
      _attributeValue = attributes[_key];
      if (_attributeValue) {
        for (_i = 0, _len = _value.length; _i < _len; _i++) {
          item = _value[_i];
          _attributeValue.splice(_attributeValue.indexOf(item), 1);
        }
      }
    }
    return attributes;
  },
  _incAtomicUpdate: function(attributes, value) {
    var _key, _value;
    for (_key in value) {
      _value = value[_key];
      attributes[_key] || (attributes[_key] = 0);
      attributes[_key] += _value;
    }
    return attributes;
  },
  _addToSetAtomicUpdate: function(attributes, value) {
    var attributeValue, item, _i, _key, _len, _ref, _value;
    for (_key in value) {
      _value = value[_key];
      attributeValue = attributes[_key] || (attributes[_key] = []);
      if (_value && _value.hasOwnProperty("$each")) {
        _ref = _value.$each;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          if (attributeValue.indexOf(item) === -1) {
            attributeValue.push(item);
          }
        }
      } else {
        if (attributeValue.indexOf(_value) === -1) {
          attributeValue.push(_value);
        }
      }
    }
    return attributes;
  }
};

module.exports = Tower.Store.Memory.Serialization;
