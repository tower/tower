var _,
  __defineProperty = function(clazz, key, value) {
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

_ = Tower._;

Tower.ModelValidatorLength = (function(_super) {
  var ModelValidatorLength;

  ModelValidatorLength = __extends(ModelValidatorLength, _super);

  function ModelValidatorLength(name, value, attributes, options) {
    name = this.valueCheck(name, value);
    value = value[name] || (value[name] = value);
    ModelValidatorLength.__super__.constructor.apply(this, arguments);
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

  __defineProperty(ModelValidatorLength,  "validateGreaterThanOrEqual", function(record, attribute, errors, callback) {
    var value;
    value = record.get(attribute);
    if (typeof value === 'string') {
      value = value.length;
    }
    if (!(value >= this.getValue(record))) {
      return this.failure(record, attribute, errors, Tower.t('model.errors.minimum', {
        attribute: attribute,
        value: this.value
      }), callback);
    }
    return this.success(callback);
  });

  __defineProperty(ModelValidatorLength,  "validateGreaterThan", function(record, attribute, errors, callback) {
    var value;
    value = record.get(attribute);
    if (typeof value === 'string') {
      value = value.length;
    }
    if (!(value > this.getValue(record))) {
      return this.failure(record, attribute, errors, Tower.t('model.errors.minimum', {
        attribute: attribute,
        value: this.value
      }), callback);
    }
    return this.success(callback);
  });

  __defineProperty(ModelValidatorLength,  "validateLessThanOrEqual", function(record, attribute, errors, callback) {
    var value;
    value = record.get(attribute);
    if (typeof value === 'string') {
      value = value.length;
    }
    if (!(value <= this.getValue(record))) {
      return this.failure(record, attribute, errors, Tower.t('model.errors.minimum', {
        attribute: attribute,
        value: this.value
      }), callback);
    }
    return this.success(callback);
  });

  __defineProperty(ModelValidatorLength,  "validateLessThan", function(record, attribute, errors, callback) {
    var value;
    value = record.get(attribute);
    if (typeof value === 'string') {
      value = value.length;
    }
    if (!(value < this.getValue(record))) {
      return this.failure(record, attribute, errors, Tower.t('model.errors.minimum', {
        attribute: attribute,
        value: this.value
      }), callback);
    }
    return this.success(callback);
  });

  __defineProperty(ModelValidatorLength,  "validateMinimum", function(record, attribute, errors, callback) {
    var value;
    value = record.get(attribute);
    if (typeof value === 'string') {
      value = value.length;
    }
    if (!(typeof value === 'number' && value >= this.getValue(record))) {
      return this.failure(record, attribute, errors, Tower.t('model.errors.minimum', {
        attribute: attribute,
        value: this.value
      }), callback);
    }
    return this.success(callback);
  });

  __defineProperty(ModelValidatorLength,  "validateMaximum", function(record, attribute, errors, callback) {
    var value;
    value = record.get(attribute);
    if (typeof value === 'string') {
      value = value.length;
    }
    if (!(typeof value === 'number' && value <= this.getValue(record))) {
      return this.failure(record, attribute, errors, Tower.t('model.errors.maximum', {
        attribute: attribute,
        value: this.value
      }), callback);
    }
    return this.success(callback);
  });

  __defineProperty(ModelValidatorLength,  "validateLength", function(record, attribute, errors, callback) {
    var value;
    value = record.get(attribute);
    if (typeof value === 'string') {
      value = value.length;
    }
    if (!(typeof value === 'number' && value === this.getValue(record))) {
      return this.failure(record, attribute, errors, Tower.t('model.errors.length', {
        attribute: attribute,
        value: this.value
      }), callback);
    }
    return this.success(callback);
  });

  __defineProperty(ModelValidatorLength,  "valueCheck", function(name, value) {
    var key;
    if (typeof value === 'object') {
      for (key in value) {
        if (key === "min" || key === "max" || key === "gte" || key === "gt" || key === "lte" || key === "lt") {
          return key;
        }
      }
    }
    return name;
  });

  return ModelValidatorLength;

})(Tower.ModelValidator);

module.exports = Tower.ModelValidatorLength;
