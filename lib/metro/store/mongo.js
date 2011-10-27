(function() {
  var Mongo;
  Mongo = (function() {
    function Mongo() {}
    Mongo.prototype.find = function(query, callback) {};
    Mongo.alias("select", "find");
    Mongo.prototype.first = function(query, callback) {};
    Mongo.prototype.last = function(query, callback) {};
    Mongo.prototype.all = function(query, callback) {};
    Mongo.prototype.length = function(query, callback) {};
    Mongo.alias("count", "length");
    Mongo.prototype.remove = function(query, callback) {};
    Mongo.prototype.clear = function() {};
    Mongo.prototype.toArray = function() {};
    Mongo.prototype.create = function(record) {};
    Mongo.prototype.update = function(record) {};
    Mongo.prototype.destroy = function(record) {};
    Mongo.prototype.sort = function() {};
    return Mongo;
  })();
  module.exports = Mongo;
}).call(this);
