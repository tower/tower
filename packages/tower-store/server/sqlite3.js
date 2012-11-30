var __hasProp = {}.hasOwnProperty,
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

Tower.StoreSQLite3 = (function(_super) {
  var StoreSQLite3;

  function StoreSQLite3() {
    return StoreSQLite3.__super__.constructor.apply(this, arguments);
  }

  StoreSQLite3 = __extends(StoreSQLite3, _super);

  return StoreSQLite3;

})(Tower.Store);

module.exports = Tower.StoreSQLite3;
