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

Tower.Model.Criteria = (function(_super) {
  var Criteria;

  function Criteria() {
    return Criteria.__super__.constructor.apply(this, arguments);
  }

  Criteria = __extends(Criteria, _super);

  __defineProperty(Criteria,  "defaultLimit", 20);

  __defineProperty(Criteria,  "init", function(options) {
    if (options == null) {
      options = {};
    }
    return this.initialize(options);
  });

  return Criteria;

})(Tower.Class);

module.exports = Tower.Model.Criteria;
