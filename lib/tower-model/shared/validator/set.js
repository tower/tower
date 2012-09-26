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

Tower.ModelValidatorSet = (function(_super) {
  var ModelValidatorSet;

  ModelValidatorSet = __extends(ModelValidatorSet, _super);

  function ModelValidatorSet(name, value, attributes, options) {
    ModelValidatorSet.__super__.constructor.call(this, name, _.castArray(value), attributes, options);
  }

  __defineProperty(ModelValidatorSet,  "validate", function(record, attribute, errors, callback) {
    var success, testValue, value;
    value = record.get(attribute);
    testValue = this.getValue(record);
    success = (function() {
      switch (this.name) {
        case 'in':
          return _.indexOf(testValue, value) > -1;
        case 'notIn':
          return _.indexOf(testValue, value) === -1;
        default:
          return false;
      }
    }).call(this);
    if (!success) {
      return this.failure(record, attribute, errors, Tower.t('model.errors.format', {
        attribute: attribute,
        value: testValue.toString()
      }), callback);
    } else {
      return this.success(callback);
    }
  });

  return ModelValidatorSet;

})(Tower.ModelValidator);

module.exports = Tower.ModelValidatorFormat;
