(function() {
  var Cookies, exports;
  Cookies = (function() {
    function Cookies() {}
    Cookies.middleware = require("connect").cookieParser('keyboard cat');
    return Cookies;
  })();
  exports = module.exports = Cookies;
}).call(this);
