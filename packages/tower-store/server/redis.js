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

Tower.StoreRedis = (function(_super) {
  var StoreRedis;

  function StoreRedis() {
    return StoreRedis.__super__.constructor.apply(this, arguments);
  }

  StoreRedis = __extends(StoreRedis, _super);

  StoreRedis.reopenClass({
    lib: function() {
      return require("redis");
    },
    client: function() {
      var _ref;
      return (_ref = this._client) != null ? _ref : this._client = this.lib().createClient();
    }
  });

  return StoreRedis;

})(Tower.Store);

module.exports = Tower.StoreRedis;
