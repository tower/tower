var __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) { 
    if(typeof parent.__extend == 'function') return parent.__extend(child);
      
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if(typeof parent.extended == 'function') parent.extended(child); 
    return child; 
},
  __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
};

Tower.Model.Relation.HasOne = (function(_super) {
  var HasOne;

  function HasOne() {
    return HasOne.__super__.constructor.apply(this, arguments);
  }

  HasOne = __extends(HasOne, _super);

  return HasOne;

})(Tower.Model.Relation);

Tower.Model.Relation.HasOne.Criteria = (function(_super) {
  var Criteria;

  function Criteria() {
    return Criteria.__super__.constructor.apply(this, arguments);
  }

  Criteria = __extends(Criteria, _super);

  __defineProperty(Criteria,  "isHasOne", true);

  return Criteria;

})(Tower.Model.Relation.Criteria);

module.exports = Tower.Model.Relation.HasOne;
