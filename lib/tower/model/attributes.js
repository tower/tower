var method, _fn, _i, _len, _ref;

Tower.Model.Attributes = {
  Serialization: {},
  ClassMethods: {
    dynamicFields: true,
    destructiveFields: ['id', 'push', 'isValid', 'data', 'changes', 'getAttribute', 'setAttribute', 'unknownProperty', 'setUnknownProperty'],
    field: function(name, options) {
      return this.fields()[name] = new Tower.Model.Attribute(this, name, options);
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
    }
  },
  InstanceMethods: {
    dynamicFields: true,
    data: Ember.computed(function() {
      return new Tower.Model.Data(this);
    }).cacheable(),
    changes: Ember.computed(function() {
      return Ember.get(this.get('data'), 'unsavedData');
    }),
    getAttribute: function(key) {
      return Ember.getPath(this, key);
    },
    setAttribute: function(key, value) {
      return Ember.setPath(this, key, value);
    },
    setSavedAttributes: function(object) {
      return this.get('data').setSavedAttributes(object);
    },
    setAttributes: function(key, value) {
      return _.oneOrMany(this, this.setAttribute, key, value);
    },
    unknownProperty: function(key) {
      if (this.get('dynamicFields')) {
        return this.get('data').get(key);
      }
    },
    setUnknownProperty: function(key, value) {
      if (this.get('dynamicFields')) {
        return this.get('data').set(key, value);
      }
    }
  }
};

_ref = Tower.Store.Modifiers.SET;
_fn = function(method) {
  return Tower.Model.Attributes.InstanceMethods[method] = function() {
    var _ref1;
    return (_ref1 = Ember.get(this, 'data'))[method].apply(_ref1, arguments);
  };
};
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  method = _ref[_i];
  _fn(method);
}

module.exports = Tower.Model.Attributes;
