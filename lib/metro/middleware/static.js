(function() {
  Metro.Middleware.Static = (function() {
    function Static() {}
    Static.middleware = function(request, result, next) {
      this._middleware || (this._middleware = require("connect").static(Metro.publicPath, {
        maxAge: 0
      }));
      return this._middleware(request, result, next);
    };
    return Static;
  })();
  module.exports = Metro.Middleware.Static;
}).call(this);
