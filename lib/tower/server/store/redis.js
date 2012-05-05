var __defineStaticProperty = function(clazz, key, value) {
  if(typeof clazz.__defineStaticProperty == 'function') return clazz.__defineStaticProperty(key, value);
  return clazz[key] = value;
},
  __defineProperty = function(clazz, key, value) {
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

Tower.Store.Redis = (function(_super) {
  var Redis;

  function Redis() {
    return Redis.__super__.constructor.apply(this, arguments);
  }

  Redis = __extends(Redis, _super);

  __defineStaticProperty(Redis,  "lib", function() {
    return require("redis");
  });

  __defineStaticProperty(Redis,  "client", function() {
    var _ref;
    return (_ref = this._client) != null ? _ref : this._client = this.lib().createClient();
  });

  __defineProperty(Redis,  "find", function(query, callback) {});

  Redis.alias("select", "find");

  __defineProperty(Redis,  "first", function(query, callback) {});

  __defineProperty(Redis,  "last", function(query, callback) {});

  __defineProperty(Redis,  "all", function(query, callback) {});

  __defineProperty(Redis,  "length", function(query, callback) {});

  Redis.alias("count", "length");

  __defineProperty(Redis,  "remove", function(query, callback) {});

  __defineProperty(Redis,  "clear", function() {});

  __defineProperty(Redis,  "create", function(record) {});

  __defineProperty(Redis,  "update", function(record) {});

  __defineProperty(Redis,  "destroy", function(record) {});

  __defineProperty(Redis,  "sort", function() {});

  return Redis;

})(Tower.Store);

module.exports = Tower.Store.Redis;
