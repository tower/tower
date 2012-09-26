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

Tower.StoreMySQL = (function(_super) {
  var StoreMySQL;

  function StoreMySQL() {
    return StoreMySQL.__super__.constructor.apply(this, arguments);
  }

  StoreMySQL = __extends(StoreMySQL, _super);

  return StoreMySQL;

})(Tower.Store);

module.exports = Tower.StoreMySQL;
