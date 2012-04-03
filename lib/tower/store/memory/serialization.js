
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
  _incAtomicUpdate: function(attributes, value) {
    var _key, _value;
    for (_key in value) {
      _value = value[_key];
      attributes[_key] || (attributes[_key] = 0);
      attributes[_key] += _value;
    }
    return attributes;
  }
};

module.exports = Tower.Store.Memory.Serialization;
