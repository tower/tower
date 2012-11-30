var _,
  __slice = [].slice;

_ = Tower._;

Tower.ModelAttributes = {
  Serialization: {},
  ClassMethods: {
    dynamicFields: true,
    primaryKey: 'id',
    destructiveFields: ['id', 'push', 'isValid', 'data', 'changes', 'getAttribute', 'setAttribute', 'unknownProperty', 'setUnknownProperty'],
    field: function(name, options) {
      return this.fields()[name] = new Tower.ModelAttribute(this, name, options);
    },
    fields: function() {
      var fields, name, names, options, _i, _len, _ref;
      fields = this.metadata().fields;
      switch (arguments.length) {
        case 0:
          fields;

          break;
        case 1:
          _ref = arguments[0];
          for (name in _ref) {
            options = _ref[name];
            this.field(name, options);
          }
          break;
        default:
          names = _.args(arguments);
          options = _.extractOptions(names);
          for (_i = 0, _len = names.length; _i < _len; _i++) {
            name = names[_i];
            this.field(name, options);
          }
      }
      return fields;
    },
    _defaultAttributes: function(record) {
      var attributes, field, name, _ref;
      attributes = {};
      _ref = this.fields();
      for (name in _ref) {
        field = _ref[name];
        attributes[name] = field.defaultValue(record);
      }
      if (this.isSubClass()) {
        attributes.type || (attributes.type = this.className());
      }
      return attributes;
    },
    initializeAttributes: function(record, attributes) {
      return _.defaults(attributes, this._defaultAttributes(record));
    }
  },
  InstanceMethods: {
    dynamicFields: true,
    attributes: Ember.computed(function() {
      if (arguments.length === 2) {
        throw new Error('Cannot set attributes hash directly');
      }
      return {};
    }).cacheable(),
    modifyAttribute: function(operation, key, value) {
      operation = Tower.StoreModifiers.MAP[operation];
      operation = operation ? operation.replace(/^\$/, '') : 'set';
      return this[operation](key, value);
    },
    atomicallySetAttribute: function() {
      return this.modifyAttribute.apply(this, arguments);
    },
    assignAttributes: function(attributes, options, operation) {
      if (!_.isHash(attributes)) {
        return;
      }
      options || (options = {});
      if (!options.withoutProtection) {
        options.as || (options.as = 'default');
        attributes = this._sanitizeForMassAssignment(attributes, options.as);
      }
      Ember.beginPropertyChanges();
      this._assignAttributes(attributes, options, operation);
      return Ember.endPropertyChanges();
    },
    unknownProperty: function(key) {
      if (this.get('dynamicFields')) {
        return this.getAttribute(key);
      }
    },
    setUnknownProperty: function(key, value) {
      if (this.get('dynamicFields')) {
        return this.setAttribute(key, value);
      }
    },
    getAttribute: function(key) {
      var passedKey, result;
      passedKey = key;
      key = key === '_id' ? 'id' : key;
      if (key === '_cid') {
        result = this._cid;
      }
      if (result === void 0) {
        result = Ember.get(this.get('attributes'), key);
      }
      if (passedKey === 'id' && result === void 0) {
        result = this._cid;
      }
      return result;
    },
    setAttribute: function(key, value, operation) {
      if (key === '_cid') {
        if (value != null) {
          this._cid = value;
        } else {
          delete this._cid;
        }
        this.propertyDidChange('id');
        return value;
      }
      if (Tower.StoreModifiers.MAP.hasOwnProperty(key)) {
        key = key.replace('$', '');
        if (key === 'set') {
          this.assignAttributes(value);
        } else {
          this[key](value);
        }
      } else {
        if (!this.get('isNew') && key === 'id') {
          this.get('attributes')[key] = value;
          return value;
        }
        this._actualSet(key, value);
      }
      this.set('isDirty', _.isPresent(this.get('changedAttributes')));
      return value;
    },
    _actualSet: function(key, value, dispatch) {
      this._updateChangedAttribute(key, value);
      this.get('attributes')[key] = value;
      if (dispatch) {
        this.propertyDidChange(key);
      }
      return value;
    },
    setAttributes: function(attributes) {},
    getEach: function() {
      var fields,
        _this = this;
      fields = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.map(_.flatten(fields), function(i) {
        return _this.get(i);
      });
    },
    _assignAttributes: function(attributes, options, operation) {
      var item, k, modifiedAttributes, multiParameterAttributes, nestedParameterAttributes, v, _i, _len, _results;
      multiParameterAttributes = [];
      nestedParameterAttributes = [];
      modifiedAttributes = [];
      for (k in attributes) {
        v = attributes[k];
        if (k.indexOf('(') > -1) {
          multiParameterAttributes.push([k, v]);
        } else if (k.charAt(0) === '$') {
          this.assignAttributes(v, options, k);
        } else {
          if (_.isHash(v)) {
            nestedParameterAttributes.push([k, v]);
          } else {
            this.modifyAttribute(operation, k, v);
          }
        }
      }
      _results = [];
      for (_i = 0, _len = nestedParameterAttributes.length; _i < _len; _i++) {
        item = nestedParameterAttributes[_i];
        _results.push(this.modifyAttribute(operation, item[0], item[1]));
      }
      return _results;
    }
  }
};

module.exports = Tower.ModelAttributes;
