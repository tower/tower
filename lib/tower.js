var Tower;

require('underscore.logger');

global._ = require('underscore');

_.mixin(require('underscore.string'));

module.exports = global.Tower = Tower = new (Tower = (function() {

  function Tower() {}

  return Tower;

})());

Tower.logger = _console;

require('./tower/support');

require('./tower/event');

require('./tower/application/server');

require('./tower/application/configuration');

require('./tower/store');

require('./tower/model');

require('./tower/view');

require('./tower/controller');

require('./tower/dispatch');

require('./tower/middleware');

require('./tower/command');

require('./tower/generator');

Tower.root = process.cwd();

Tower.publicPath = process.cwd() + "/public";

Tower.publicCacheDuration = 60 * 1000;

Tower.View.store(new Tower.Store.FileSystem(["app/views"]));

Tower.sessionSecret = "tower-session-secret";

Tower.cookieSecret = "tower-cookie-secret";

Tower.render = function(string, options) {
  if (options == null) options = {};
  return Shift.render(options.type, string, options);
};

Tower.domain = "localhost";

Tower.async = require('async');

Tower.date = function() {
  return require('moment').apply(null, arguments)._d;
};

Tower.run = function(argv) {
  return (new Tower.Command.Server(argv)).run();
};
