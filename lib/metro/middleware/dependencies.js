(function() {
  var Dependencies;
  Dependencies = (function() {
    function Dependencies() {}
    Dependencies.middleware = function(request, result, next) {
      return (new Dependencies).call(request, result, next);
    };
    Dependencies.prototype.call = function(request, result, next) {
      Metro.Support.Dependencies.reload_modified();
      Metro.Routes.reload();
      if (next != null) {
        return next();
      }
    };
    return Dependencies;
  })();
  module.exports = Dependencies;
}).call(this);
