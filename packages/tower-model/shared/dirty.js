var _;

_ = Tower._;

Tower.ModelDirty = {
  changes: Ember.computed(function() {
    var attributes, injectChange,
      _this = this;
    attributes = this.get('attributes');
    injectChange = function(memo, value, key) {
      memo[key] = [value, _this.getAttribute(key)];
      return memo;
    };
    return _.inject(this.get('changedAttributes'), injectChange, {});
  }).volatile(),
  dirtyAttributes: Ember.computed(function() {
    if (this.get('isNew')) {
      return this.attributesForCreate();
    } else {
      return this.attributesForUpdate();
    }
  }).volatile(),
  changedAttributes: Ember.computed(function(key, value) {
    return {};
  }).cacheable(),
  changed: Ember.computed(function() {
    return _.keys(this.get('changedAttributes'));
  }).volatile(),
  attributeChanged: function(name) {
    return this.get('changedAttributes').hasOwnProperty(name);
  },
  attributeChange: function(name) {
    if (this.attributeChanged(name)) {
      return [this.get('changedAttributes')[name], this.get('attributes')[name]];
    }
  },
  attributeWas: function(name) {
    return this.get('changedAttributes')[name];
  },
  resetAttribute: function(key) {
    var attributes, changedAttributes, value;
    changedAttributes = this.get('changedAttributes');
    attributes = this.get('attributes');
    if (changedAttributes.hasOwnProperty(key)) {
      value = changedAttributes[key];
    } else {
      value = this._defaultValue(key);
    }
    return this.set(key, value);
  },
  attributesForCreate: function() {
    return this._attributesForPersistence(this.attributeKeysForCreate());
  },
  attributesForUpdate: function(keys) {
    return this._attributesForPersistence(this.attributeKeysForUpdate(keys));
  },
  attributeKeysForCreate: function() {
    var attributes, key, primaryKey, result, value;
    primaryKey = 'id';
    attributes = this.get('attributes');
    result = [];
    for (key in attributes) {
      value = attributes[key];
      if (!(key === primaryKey || typeof value === 'undefined')) {
        result.push(key);
      }
    }
    return result;
  },
  attributeKeysForUpdate: function(keys) {
    var primaryKey;
    primaryKey = 'id';
    keys || (keys = _.keys(this.get('changedAttributes')));
    return _.select(keys, function(key) {
      return key !== primaryKey;
    });
  },
  _updateChangedAttribute: function(key, value) {
    var attributes, changedAttributes, old;
    changedAttributes = this.get('changedAttributes');
    attributes = this.get('attributes');
    if (changedAttributes.hasOwnProperty(key)) {
      if (_.isEqual(changedAttributes[key], value)) {
        return delete changedAttributes[key];
      }
    } else {
      old = this._clonedValue(attributes[key]);
      if (!_.isEqual(old, value)) {
        return changedAttributes[key] = old;
      }
    }
  },
  _attributesForPersistence: function(keys) {
    var attributes, key, result, _i, _len;
    result = {};
    attributes = this.get('attributes');
    for (_i = 0, _len = keys.length; _i < _len; _i++) {
      key = keys[_i];
      result[key] = attributes[key];
    }
    return result;
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
  },
  _getField: function(key) {
    return this.constructor.fields()[key];
  }
};

module.exports = Tower.ModelDirty;
