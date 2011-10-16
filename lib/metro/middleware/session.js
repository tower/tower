(function() {
  var Session, exports;
  Session = (function() {
    function Session() {}
    Session.middleware = require("connect").session({
      cookie: {
        maxAge: 60000
      }
    });
    return Session;
  })();
  exports = module.exports = Session;
}).call(this);
