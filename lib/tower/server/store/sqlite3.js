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

Tower.Store.SQLite3 = (function(_super) {
  var SQLite3;

  function SQLite3() {
    return SQLite3.__super__.constructor.apply(this, arguments);
  }

  SQLite3 = __extends(SQLite3, _super);

  return SQLite3;

})(Tower.Store);

module.exports = Tower.Store.SQLite3;
