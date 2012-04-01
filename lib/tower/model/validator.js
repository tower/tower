
Tower.Model.Validator = (function() {

  Validator.create = function(name, value, attributes) {
    var key, _results;
    if (typeof name === "object") {
      attributes = value;
      _results = [];
      for (key in name) {
        value = name[key];
        _results.push(this._create(key, value, attributes));
      }
      return _results;
    } else {
      return this._create(name, value, attributes);
    }
  };

  Validator._create = function(name, value, attributes) {
    switch (name) {
      case "presence":
      case "required":
        return new this.Presence(name, value, attributes);
      case "count":
      case "length":
      case "min":
      case "max":
        return new this.Length(name, value, attributes);
      case "format":
        return new this.Format(name, value, attributes);
      case "in":
      case "except":
      case "only":
      case "notIn":
      case "values":
      case "accepts":
        return new this.Set(name, value, attributes);
    }
  };

  function Validator(name, value, attributes) {
    this.name = name;
    this.value = value;
    this.attributes = _.castArray(attributes);
  }

  Validator.prototype.validateEach = function(record, errors, callback) {
    var iterator,
      _this = this;
    iterator = function(attribute, next) {
      return _this.validate(record, attribute, errors, function(error) {
        return next();
      });
    };
    Tower.parallel(this.attributes, iterator, function(error) {
      if (callback) return callback.call(_this, error);
    });
    return;
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

require('./validator/set');

require('./validator/uniqueness');

module.exports = Tower.Model.Validation;
