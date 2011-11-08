(function() {
  var Cookies;
  Cookies = (function() {
    function Cookies() {}
    Cookies.middleware = require("connect").cookieParser('keyboard cat');
    return Cookies;
  })();
  module.exports = Cookies;
}).call(this);
