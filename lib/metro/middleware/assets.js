(function() {
  var Assets;
  Assets = (function() {
    function Assets() {}
    Assets.middleware = function(req, res, next) {
      return new Assets.call(req, res, next);
    };
    Assets.prototype.call = function(req, res, next) {
      var asset, start_time;
      start_time = new Date();
      return asset = this.findAsset(req.path);
    };
    Assets.prototype.forbiddenRequest = function(req) {
      return false;
    };
    Assets.prototype.findAsset = function(path) {};
    return Assets;
  })();
  module.exports = Assets;
}).call(this);
