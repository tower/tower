var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Store.Redis = (function(_super) {

  __extends(Redis, _super);

  Redis.name = 'Redis';

  function Redis() {
    return Redis.__super__.constructor.apply(this, arguments);
  }

  Redis.lib = function() {
    return require("redis");
  };

  Redis.client = function() {
    var _ref;
    return (_ref = this._client) != null ? _ref : this._client = this.lib().createClient();
  };

  Redis.prototype.find = function(query, callback) {};

  Redis.alias("select", "find");

  Redis.prototype.first = function(query, callback) {};

  Redis.prototype.last = function(query, callback) {};

  Redis.prototype.all = function(query, callback) {};

  Redis.prototype.length = function(query, callback) {};

  Redis.alias("count", "length");

  Redis.prototype.remove = function(query, callback) {};

  Redis.prototype.clear = function() {};

  Redis.prototype.create = function(record) {};

  Redis.prototype.update = function(record) {};

  Redis.prototype.destroy = function(record) {};

  Redis.prototype.sort = function() {};

  return Redis;

})(Tower.Store);

module.exports = Tower.Store.Redis;
