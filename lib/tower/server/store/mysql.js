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

Tower.Store.MySQL = (function(_super) {
  var MySQL;

  function MySQL() {
    return MySQL.__super__.constructor.apply(this, arguments);
  }

  MySQL = __extends(MySQL, _super);

  return MySQL;

})(Tower.Store);

module.exports = Tower.Store.MySQL;
