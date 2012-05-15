var __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) {
    if (typeof parent.__extend == 'function') return parent.__extend(child);
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if (typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.Model.Validator.Length = (function(_super) {
  var Length;

  Length = __extends(Length, _super);

  function Length(name, value, attributes, options) {
    Length.__super__.constructor.apply(this, arguments);
    this.validate = (function() {
      switch (name) {
        case 'min':
          return this.validateMinimum;
        case 'max':
          return this.validateMaximum;
        case 'gte':
          return this.validateGreaterThanOrEqual;
        case 'gt':
          return this.validateGreaterThan;
        case 'lte':
          return this.validateLessThanOrEqual;
        case 'lt':
          return this.validateLessThan;
        default:
          return this.validateLength;
      }
    }).call(this);
  }

  __defineProperty(Length,  "validateGreaterThanOrEqual", function(record, attribute, errors, callback) {
    var value;
    value = record.get(attribute);
    if (!(value >= this.getValue(record))) {
      return this.failure(record, attribute, errors, Tower.t('model.errors.minimum', {
        attribute: attribute,
        value: this.value
      }), callback);
    }
    return this.success(callback);
  });

  __defineProperty(Length,  "validateGreaterThan", function(record, attribute, errors, callback) {
    var value;
    value = record.get(attribute);
    if (!(value > this.getValue(record))) {
      return this.failure(record, attribute, errors, Tower.t('model.errors.minimum', {
        attribute: attribute,
        value: this.value
      }), callback);
    }
    return this.success(callback);
  });

  __defineProperty(Length,  "validateLessThanOrEqual", function(record, attribute, errors, callback) {
    var value;
    value = record.get(attribute);
    if (!(value <= this.getValue(record))) {
      return this.failure(record, attribute, errors, Tower.t('model.errors.minimum', {
        attribute: attribute,
        value: this.value
      }), callback);
    }
    return this.success(callback);
  });

  __defineProperty(Length,  "validateLessThan", function(record, attribute, errors, callback) {
    var value;
    value = record.get(attribute);
    if (!(value < this.getValue(record))) {
      return this.failure(record, attribute, errors, Tower.t('model.errors.minimum', {
        attribute: attribute,
        value: this.value
      }), callback);
    }
    return this.success(callback);
  });

  __defineProperty(Length,  "validateMinimum", function(record, attribute, errors, callback) {
    var value;
    value = record.get(attribute);
    if (!(typeof value === 'number' && value >= this.getValue(record))) {
      return this.failure(record, attribute, errors, Tower.t('model.errors.minimum', {
        attribute: attribute,
        value: this.value
      }), callback);
    }
    return this.success(callback);
  });

  __defineProperty(Length,  "validateMaximum", function(record, attribute, errors, callback) {
    var value;
    value = record.get(attribute);
    if (!(typeof value === 'number' && value <= this.getValue(record))) {
      return this.failure(record, attribute, errors, Tower.t('model.errors.maximum', {
        attribute: attribute,
        value: this.value
      }), callback);
    }
    return this.success(callback);
  });

  __defineProperty(Length,  "validateLength", function(record, attribute, errors, callback) {
    var value;
    value = record.get(attribute);
    if (!(typeof value === 'number' && value === this.getValue(record))) {
      return this.failure(record, attribute, errors, Tower.t('model.errors.length', {
        attribute: attribute,
        value: this.value
      }), callback);
    }
    return this.success(callback);
  });

  return Length;

})(Tower.Model.Validator);

module.exports = Tower.Model.Validator.Length;
