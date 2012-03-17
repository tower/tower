
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

  Validator.prototype.validateEach = function(record, errors, callback) {
    var iterator,
      _this = this;
    iterator = function(attribute, next) {
      return _this.validate(record, attribute, errors, function(error) {
        return next();
      });
    };
    return Tower.parallel(this.attributes, iterator, function(error) {
      if (callback) return callback.call(_this, error);
    });
  };

  Validator.prototype.success = function(callback) {
    if (callback) callback.call(this);
    return true;
  };

  Validator.prototype.failure = function(record, attribute, errors, message, callback) {
    errors[attribute] || (errors[attribute] = []);
    errors[attribute].push(message);
    if (callback) callback.call(this, message);
    return false;
  };

  return Validator;

})();

require('./validator/format');

require('./validator/length');

require('./validator/presence');

require('./validator/uniqueness');

module.exports = Tower.Model.Validation;
