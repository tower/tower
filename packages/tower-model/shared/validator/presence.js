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

Tower.ModelValidatorPresence = (function(_super) {
  var ModelValidatorPresence;

  function ModelValidatorPresence() {
    return ModelValidatorPresence.__super__.constructor.apply(this, arguments);
  }

  ModelValidatorPresence = __extends(ModelValidatorPresence, _super);

  __defineProperty(ModelValidatorPresence,  "validate", function(record, attribute, errors, callback) {
    if (!_.isPresent(record.get(attribute))) {
      return this.failure(record, attribute, errors, Tower.t('model.errors.presence', {
        attribute: attribute
      }), callback);
    }
    return this.success(callback);
  });

  return ModelValidatorPresence;

})(Tower.ModelValidator);

module.exports = Tower.ModelValidatorPresence;
