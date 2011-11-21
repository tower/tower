(function() {
  var Session;

  Session = (function() {

    function Session() {}

    Session.middleware = require("connect").session({
      cookie: {
        maxAge: 60000
      }
    });

    return Session;

  })();

  module.exports = Session;

}).call(this);
