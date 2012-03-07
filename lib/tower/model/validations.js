
Tower.Model.Validations = {
  ClassMethods: {
    validates: function() {
      var attributes, key, options, validators, value, _results;
      attributes = Tower.Support.Array.args(arguments);
      options = attributes.pop();
      validators = this.validators();
      _results = [];
      for (key in options) {
        value = options[key];
        _results.push(validators.push(Tower.Model.Validator.create(key, value, attributes)));
      }
      return _results;
    },
    validators: function() {
      return this._validators || (this._validators = []);
    }
  },
  validate: function(callback) {
    var success;
    var _this = this;
    success = false;
    this.runCallbacks("validate", function(block) {
      var complete, errors, iterator, validators;
      complete = _this._callback(block, callback);
      validators = _this.constructor.validators();
      errors = _this.errors = {};
      iterator = function(validator, next) {
        return validator.validateEach(_this, errors, next);
      };
      Tower.async(validators, iterator, function(error) {
        if (!(error || Tower.Support.Object.isPresent(errors))) success = true;
        return complete.call(_this, !success);
      });
      return success;
    });
    return success;
  }
};

module.exports = Tower.Model.Validations;
