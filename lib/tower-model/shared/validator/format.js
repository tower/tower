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

Tower.ModelValidatorFormat = (function(_super) {
  var ModelValidatorFormat;

  ModelValidatorFormat = __extends(ModelValidatorFormat, _super);

  function ModelValidatorFormat(name, value, attributes, options) {
    ModelValidatorFormat.__super__.constructor.call(this, name, value, attributes, options);
    if (this.value.hasOwnProperty('value')) {
      this.value = this.value.value;
    }
    if (typeof this.value === 'string') {
      this.matcher = "is" + (_.camelCase(value, true));
    }
  }

  __defineProperty(ModelValidatorFormat,  "validate", function(record, attribute, errors, callback) {
    var success, value;
    value = record.get(attribute);
    success = this.matcher ? !!_[this.matcher](value) : !!this.value.exec(value);
    if (!success) {
      return this.failure(record, attribute, errors, Tower.t('model.errors.format', {
        attribute: attribute,
        value: this.value.toString()
      }), callback);
    } else {
      return this.success(callback);
    }
  });

  return ModelValidatorFormat;

})(Tower.ModelValidator);

module.exports = Tower.ModelValidatorFormat;
