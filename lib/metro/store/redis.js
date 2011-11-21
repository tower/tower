(function() {
  var Redis;

  Redis = (function() {

    function Redis() {}

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

    Redis.prototype.toArray = function() {};

    Redis.prototype.create = function(record) {};

    Redis.prototype.update = function(record) {};

    Redis.prototype.destroy = function(record) {};

    Redis.prototype.sort = function() {};

    return Redis;

  })();

  module.exports = Redis;

}).call(this);
