
Tower.Model.Validator = (function() {

  Validator.name = 'Validator';

  Validator.keys = {
    presence: 'presence',
    required: 'required',
    count: 'length',
    length: 'length',
    min: 'min',
    max: 'max',
    gte: 'gte',
    '>=': 'gte',
    gt: 'gt',
    '>': 'gt',
    lte: 'lte',
    '<=': 'lte',
    lt: 'lt',
    '<': 'lt',
    format: 'format',
    unique: 'uniqueness',
    uniqueness: 'uniqueness',
    "in": 'in',
    notIn: 'notIn',
    except: 'except',
    only: 'only',
    accepts: 'accepts'
  };

  Validator.createAll = function(attributes, validations) {
    var key, options, validatorOptions, validators, value;
    if (validations == null) {
      validations = {};
    }
    options = _.moveProperties({}, validations, 'on', 'if', 'unless', 'allow');
    validators = [];
    for (key in validations) {
      value = validations[key];
      validatorOptions = _.clone(options);
      if (_.isBaseObject(value)) {
        validatorOptions = _.moveProperties(validatorOptions, value, 'on', 'if', 'unless', 'allow');
      }
      validators.push(Tower.Model.Validator.create(key, value, attributes, validatorOptions));
    }
    return validators;
  };

  Validator.create = function(name, value, attributes, options) {
    var key, _results;
    if (typeof name === 'object') {
      attributes = value;
      _results = [];
      for (key in name) {
        value = name[key];
        _results.push(this._create(key, value, attributes, options));
      }
      return _results;
    } else {
      return this._create(name, value, attributes, options);
    }
  };

  Validator._create = function(name, value, attributes, options) {
    switch (name) {
      case 'presence':
      case 'required':
        return new this.Presence(name, value, attributes, options);
      case 'count':
      case 'length':
      case 'min':
      case 'max':
      case 'gte':
      case 'gt':
      case 'lte':
      case 'lt':
        return new this.Length(name, value, attributes, options);
      case 'format':
        return new this.Format(name, value, attributes, options);
      case 'in':
      case 'except':
      case 'only':
      case 'notIn':
      case 'values':
      case 'accepts':
        return new this.Set(name, value, attributes, options);
      case 'uniqueness':
      case 'unique':
        return new this.Uniqueness(name, value, attributes, options);
    }
  };

  function Validator(name, value, attributes, options) {
    if (options == null) {
      options = {};
    }
    this.name = name;
    this.value = value;
    this.attributes = _.castArray(attributes);
    this.options = options;
  }

  Validator.prototype.validateEach = function(record, errors, callback) {
    var success,
      _this = this;
    success = void 0;
    this.check(record, function(error, result) {
      var iterator;
      success = result;
      if (success) {
        iterator = function(attribute, next) {
          return _this.validate(record, attribute, errors, function(error) {
            return next();
          });
        };
        return Tower.parallel(_this.attributes, iterator, function(error) {
          success = !error;
          if (callback) {
            return callback.call(_this, error);
          }
        });
      } else {
        if (callback) {
          return callback.call(_this, error);
        }
      }
    });
    return success;
  };

  Validator.prototype.check = function(record, callback) {
    var options,
      _this = this;
    options = this.options;
    if (options["if"]) {
      return this._callMethod(record, options["if"], function(error, result) {
        return callback.call(_this, error, !!result);
      });
    } else if (options.unless) {
      return this._callMethod(record, options.unless, function(error, result) {
        return callback.call(_this, error, !!!result);
      });
    } else {
      return callback.call(this, null, true);
    }
  };

  Validator.prototype.success = function(callback) {
    if (callback) {
      callback.call(this);
    }
    return true;
  };

  Validator.prototype.failure = function(record, attribute, errors, message, callback) {
    errors[attribute] || (errors[attribute] = []);
    errors[attribute].push(message);
    if (callback) {
      callback.call(this, message);
    }
    return false;
  };

  Validator.prototype.getValue = function(binding) {
    if (typeof this.value === 'function') {
      return this.value.call(binding);
    } else {
      return this.value;
    }
  };

  Validator.prototype._callMethod = function(binding, method, callback) {
    var _this = this;
    if (typeof method === 'string') {
      method = binding[method];
    }
    switch (method.length) {
      case 0:
        callback.call(this, null, method.call(binding));
        break;
      default:
        method.call(binding, function(error, result) {
          return callback.call(_this, error, result);
        });
    }
    return;
  };

  return Validator;

})();

require('./validator/format');

require('./validator/length');

require('./validator/presence');

require('./validator/set');

require('./validator/uniqueness');

module.exports = Tower.Model.Validation;
