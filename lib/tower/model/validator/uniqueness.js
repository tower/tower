var __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) { 
    if(typeof parent.__extend == 'function') return parent.__extend(child);
      
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if(typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.Model.Validator.Uniqueness = (function(_super) {
  var Uniqueness;

  function Uniqueness() {
    return Uniqueness.__super__.constructor.apply(this, arguments);
  }

  Uniqueness = __extends(Uniqueness, _super);

  __defineProperty(Uniqueness,  "validate", function(record, attribute, errors, callback) {
    var conditions, value,
      _this = this;
    value = record.get(attribute);
    conditions = {};
    conditions[attribute] = value;
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

  return Uniqueness;

})(Tower.Model.Validator);

module.exports = Tower.Model.Validator.Uniqueness;
