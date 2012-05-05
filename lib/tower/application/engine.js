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
};

Tower.Engine = (function(_super) {
  var Engine;

  function Engine() {
    return Engine.__super__.constructor.apply(this, arguments);
  }

  Engine = __extends(Engine, _super);

  return Engine;

})(Tower.Hook);

module.exports = Tower.Engine;
