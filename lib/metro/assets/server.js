(function() {
  var Server;
  Server = (function() {
    function Server() {}
    Server.middleware = function(req, res, next) {
      return new Server.call(req, res, next);
    };
    Server.prototype.call = function(req, res, next) {
      var asset, start_time;
      start_time = new Date();
      return asset = this.findAsset(req.path);
    };
    Server.prototype.forbiddenRequest = function(req) {
      return false;
    };
    Server.prototype.findAsset = function(path) {};
    return Server;
  })();
  module.exports = Server;
}).call(this);
