var __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) { 
    if(typeof parent.__extend == 'function') return parent.__extend();
      
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if(typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.Model.Validator.Presence = (function(_super) {
  var Presence;

  function Presence() {
    return Presence.__super__.constructor.apply(this, arguments);
  }

  Presence = __extends(Presence, _super);

  __defineProperty(Presence,  "validate", function(record, attribute, errors, callback) {
    if (!_.isPresent(record.get(attribute))) {
      return this.failure(record, attribute, errors, Tower.t("model.errors.presence", {
        attribute: attribute
      }), callback);
    }
    return this.success(callback);
  });

  return Presence;

})(Tower.Model.Validator);

module.exports = Tower.Model.Validator.Presence;
