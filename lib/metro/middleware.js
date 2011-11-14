(function() {
  Metro.Middleware = {};
  require('./middleware/dependencies');
  require('./middleware/routes');
  require('./middleware/cookies');
  require('./middleware/static');
  require('./middleware/query');
  require('./middleware/assets');
  module.exports = Metro.Middleware;
}).call(this);
