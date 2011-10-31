var Dependencies;
Dependencies = (function() {
  function Dependencies() {}
  Dependencies.middleware = function(request, result, next) {
    return (new Dependencies).call(request, result, next);
  };
  Dependencies.prototype.call = function(request, result, next) {
    Metro.Support.Dependencies.reloadModified();
    Metro.Route.reload();
    if (next != null) {
      return next();
    }
  };
  return Dependencies;
})();
module.exports = Dependencies;