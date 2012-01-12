
Tower.Model.Validator = (function() {

  Validator.create = function(name, value, attributes) {
    switch (name) {
      case "presence":
        return new this.Presence(name, value, attributes);
      case "count":
      case "length":
      case "min":
      case "max":
        return new this.Length(name, value, attributes);
      case "format":
        return new this.Format(name, value, attributes);
    }
  };

  function Validator(name, value, attributes) {
    this.name = name;
    this.value = value;
    this.attributes = attributes;
  }

  Validator.prototype.validateEach = function(record, errors) {
    var attribute, success, _i, _len, _ref;
    success = true;
    _ref = this.attributes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      attribute = _ref[_i];
      if (!this.validate(record, attribute, errors)) success = false;
    }
    return success;
  };

  Validator.prototype.error = function(record, attribute, errors, message) {
    errors[attribute] || (errors[attribute] = []);
    errors[attribute].push(message);
    return false;
  };

  return Validator;

})();

require('./validator/format');

require('./validator/length');

require('./validator/presence');

require('./validator/uniqueness');

module.exports = Tower.Model.Validation;
