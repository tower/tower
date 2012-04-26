var method, _fn, _i, _len, _ref;

Tower.Model.Attributes = {
  ClassMethods: {
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
    data: Ember.computed(function() {
      return new Tower.Model.Data(this);
    }).cacheable(),
    get: function(key) {
      return _.getNestedAttribute(this, key);
    },
    send: function() {
      var _ref;
      return (_ref = this.get('stateManager')).send.apply(_ref, arguments);
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
