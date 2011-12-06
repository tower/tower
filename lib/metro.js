(function() {
  var Metro;

  require('underscore.logger');

  module.exports = global.Metro = Metro = new (Metro = (function() {

    function Metro() {}

    return Metro;

  })());

  Metro.logger = _console;

  require('./metro/support');

  require('./metro/object');

  require('./metro/event');

  require('./metro/application/server');

  require('./metro/application/configuration');

  require('./metro/store');

  require('./metro/model');

  require('./metro/view');

  require('./metro/controller');

  require('./metro/route');

  require('./metro/net');

  require('./metro/middleware');

  require('./metro/command');

  require('./metro/generator');

  Metro.root = process.cwd();

  Metro.publicPath = process.cwd() + "/public";

  Metro.publicCacheDuration = 60 * 1000;

  Metro.View.store(new Metro.Store.FileSystem(["./app/views"]));

  Metro.sessionSecret = "metro-session-secret";

  Metro.cookieSecret = "metro-cookie-secret";

  Metro.run = function(argv) {
    return (new Metro.Command.Server(argv)).run();
  };

}).call(this);
