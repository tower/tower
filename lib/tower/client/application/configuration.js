var __hasProp = {}.hasOwnProperty,
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

Tower.Application.Configuration = (function(_super) {
  var Configuration;

  function Configuration() {
    return Configuration.__super__.constructor.apply(this, arguments);
  }

  Configuration = __extends(Configuration, _super);

  Configuration.include(Tower.Support.Callbacks);

  return Configuration;

})(Tower.Class);

module.exports = Tower.Application.Configuration;
