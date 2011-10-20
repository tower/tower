(function() {
  var Body;
  Body = (function() {
    function Body() {}
    Body.middleware = function(request, result, next) {
      return (new Body).call(request, result, next);
    };
    Body.prototype.call = function(request, response, next) {
      if (next != null) {
        return next();
      }
    };
    return Body;
  })();
  module.exports = Body;
}).call(this);
