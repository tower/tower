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

Tower.Store.Cassandra = (function(_super) {
  var Cassandra;

  function Cassandra() {
    return Cassandra.__super__.constructor.apply(this, arguments);
  }

  Cassandra = __extends(Cassandra, _super);

  return Cassandra;

})(Tower.Store);

module.exports = Tower.Store.Cassandra;
