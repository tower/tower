var _;

_ = Tower._;

Tower.ModelValidations = {
  ClassMethods: {
    validates: function() {
      var attributes, newValidators, options, validator, validators, _i, _len;
      attributes = _.args(arguments);
      options = attributes.pop();
      validators = this.validators();
      newValidators = Tower.ModelValidator.createAll(attributes, options);
      for (_i = 0, _len = newValidators.length; _i < _len; _i++) {
        validator = newValidators[_i];
        validators.push(validator);
      }
      return this;
    },
    validators: function() {
      var fields;
      switch (arguments.length) {
        case 0:
          return this.metadata().validators;
        case 1:
          return this.fields()[arguments[0]].validators();
        default:
          fields = this.fields();
          return _.inject(_.args(arguments), (function(name) {
            return fields[name].validators();
          }), {});
      }
    }
  },
  InstanceMethods: {
    validate: function(callback) {
      var success,
        _this = this;
      success = false;
      this.runCallbacks('validate', function(block) {
        var complete, errors, isNew, iterator, validators;
        complete = _this._callback(block, callback);
        validators = _this.constructor.validators();
        errors = {};
        _this.set('errors', errors);
        isNew = _this.get('isNew');
        iterator = function(validator, next) {
          if (!isNew && !validator.on('update')) {
            return next();
          } else {
            return validator.validateEach(_this, errors, next);
          }
        };
        Tower.async(validators, iterator, function(error) {
          var key, value;
          if (!(_.isPresent(errors) || error)) {
            success = true;
          }
          if (Tower.isClient) {
            for (key in errors) {
              value = errors[key];
              _this.set("errors." + key, value);
            }
          }
          return complete.call(_this);
        });
        return success;
      });
      return success;
    },
    equals: function(object) {
      if (object instanceof Tower.Model) {
        return this.get('id').toString() === object.get('id').toString();
      } else {
        return false;
      }
    }
  }
};

module.exports = Tower.ModelValidations;
