
Tower.Model.Validations = {
  ClassMethods: {
    validates: function() {
      var attributes, newValidators, options, validator, validators, _i, _len;
      attributes = _.args(arguments);
      options = attributes.pop();
      validators = this.validators();
      newValidators = Tower.Model.Validator.createAll(attributes, options);
      for (_i = 0, _len = newValidators.length; _i < _len; _i++) {
        validator = newValidators[_i];
        validators.push(validator);
      }
      return this;
    },
    validators: function() {
      switch (arguments.length) {
        case 1:
          return this.fields()[arguments[0]].validators();
        default:
          return this.metadata().validators;
      }
    }
  },
  InstanceMethods: {
    validate: function(callback) {
      var success,
        _this = this;
      success = false;
      this.runCallbacks('validate', function(block) {
        var complete, errors, iterator, validators;
        complete = _this._callback(block, callback);
        validators = _this.constructor.validators();
        errors = _this.errors = {};
        iterator = function(validator, next) {
          return validator.validateEach(_this, errors, next);
        };
        Tower.async(validators, iterator, function(error) {
          if (!(_.isPresent(errors) || error)) {
            success = true;
          }
          return complete.call(_this, !success);
        });
        return success;
      });
      return success;
    },
    validateWithState: function(callback) {
      var success,
        _this = this;
      success = false;
      this.get('stateMachine').goToState('committing.before');
      console.log(Ember.getPath(this.get('stateMachine'), 'currentState.path'));
      this.runCallbacks('validate', function(block) {
        var complete, errors, iterator, validators;
        complete = _this._callback(block, callback);
        validators = _this.constructor.validators();
        errors = _this.errors = {};
        iterator = function(validator, next) {
          return validator.validateEach(_this, errors, next);
        };
        Tower.async(validators, iterator, function(error) {
          if (!(_.isPresent(errors) || error)) {
            success = true;
          }
          return complete.call(_this, !success);
        });
        return success;
      });
      return success;
    }
  }
};

module.exports = Tower.Model.Validations;
