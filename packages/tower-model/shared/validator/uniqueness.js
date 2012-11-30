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

Tower.ModelValidatorUniqueness = (function(_super) {
  var ModelValidatorUniqueness;

  ModelValidatorUniqueness = __extends(ModelValidatorUniqueness, _super);

  function ModelValidatorUniqueness(name, value, attributes, options) {
    ModelValidatorUniqueness.__super__.constructor.call(this, name, value, attributes, options);
  }

  __defineProperty(ModelValidatorUniqueness,  "validate", function(record, attribute, errors, callback) {
    var conditions, scope, value,
      _this = this;
    value = record.get(attribute);
    conditions = {};
    conditions[attribute] = value;
    scope = this.value;
    if (_.isHash(scope)) {
      scope = this.value.scope;
    }
    if (typeof scope === 'string') {
      conditions[scope] = record.get(scope);
    }
    return record.constructor.where(conditions).exists(function(error, result) {
      if (result) {
        return _this.failure(record, attribute, errors, Tower.t('model.errors.uniqueness', {
          attribute: attribute,
          value: value
        }), callback);
      } else {
        return _this.success(callback);
      }
    });
  });

  return ModelValidatorUniqueness;

})(Tower.ModelValidator);

module.exports = Tower.ModelValidatorUniqueness;
