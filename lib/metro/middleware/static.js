(function() {
  var Static, exports;
  Static = (function() {
    function Static() {}
    Static.middleware = function(request, result, next) {
      var _ref;
      if ((_ref = this._middleware) == null) {
        this._middleware = require("connect").static(Metro.public_path, {
          maxAge: 0
        });
      }
      return this._middleware(request, result, next);
    };
    return Static;
  })();
  exports = module.exports = Static;
}).call(this);
