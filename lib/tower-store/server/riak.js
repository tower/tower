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

Tower.StoreRiak = (function(_super) {
  var StoreRiak;

  function StoreRiak() {
    return StoreRiak.__super__.constructor.apply(this, arguments);
  }

  StoreRiak = __extends(StoreRiak, _super);

  return StoreRiak;

})(Tower.Store);

module.exports = Tower.StoreRiak;
