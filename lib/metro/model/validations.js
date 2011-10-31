var Validations;
var __slice = Array.prototype.slice;
Validations = (function() {
  function Validations() {
    Validations.__super__.constructor.apply(this, arguments);
  }
  Validations.validates = function() {
    var attributes, key, options, validators, value, _results;
    attributes = Array.prototype.slice.call(arguments, 0, arguments.length);
    options = attributes.pop();
    if (typeof options !== "object") {
      Metro.throw_error("missing_options", "" + this.name + ".validates");
    }
    validators = this.validators();
    _results = [];
    for (key in options) {
      value = options[key];
      _results.push(validators.push((function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return typeof result === "object" ? result : child;
      })(Metro.Model.Validation, [key, value].concat(__slice.call(attributes)), function() {})));
    }
    return _results;
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
    this.errors().length = 0;
    for (_i = 0, _len = validators.length; _i < _len; _i++) {
      validator = validators[_i];
      if (!validator.validate(self)) {
        success = false;
      }
    }
    return success;
  };
  Validations.prototype.errors = function() {
    var _ref;
    return (_ref = this._errors) != null ? _ref : this._errors = [];
  };
  return Validations;
})();
module.exports = Validations;