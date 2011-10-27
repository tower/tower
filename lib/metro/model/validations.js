(function() {
  var Validations;
  Validations = (function() {
    function Validations() {}
    Validations.validates = function() {
      var attributes, options;
      attributes = Array.prototype.slice.call(arguments, 0, arguments.length);
      options = attributes.pop();
      if (typeof options !== "object") {
        return Metro.throw_error("missing_options", "" + this.name + ".validates");
      }
    };
    Validations.validators = function() {
      var _ref;
      return (_ref = this._validators) != null ? _ref : this._validators = [];
    };
    Validations.prototype.validate = function() {
      var self, success, validator, validators, _i, _len;
      self = this;
      validators = this.constructor.validators();
      success = true;
      for (_i = 0, _len = validators.length; _i < _len; _i++) {
        validator = validators[_i];
        if (!validator.validate(self)) {
          success = false;
        }
      }
      return success;
    };
    return Validations;
  })();
  module.exports = Validations;
}).call(this);
