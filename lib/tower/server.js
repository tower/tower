var Tower;

require('ember-metal-node');

require('ember-runtime-node');

require('ember-states-node');

require('underscore.logger');

global._ = require('underscore');

_.mixin(require('underscore.string'));

module.exports = global.Tower = Tower = {};

Tower.version = JSON.parse(require('fs').readFileSync(require('path').normalize("" + __dirname + "/../../package.json"))).version;

Tower.logger = _console;

Tower.modules = {
  validator: require('validator'),
  accounting: require('accounting'),
  moment: require('moment'),
  geo: require('geolib'),
  inflector: require('inflection'),
  async: require('async'),
  superagent: require('superagent'),
  mime: require('mime'),
  mint: require('mint'),
  kue: (function() {
    try {
      return require('kue');
    } catch (_error) {}
  })(),
  coffeecup: require('coffeecup')
};

require('./support');

require('./application');

require('./server/application');

require('./store');

require('./server/store');

require('./model');

require('./view');

require('./controller');

require('./server/controller');

require('./controller/tst');

require('./http');

require('./server/mailer');

require('./middleware');

require('./server/middleware');

require('./server/command');

require('./server/generator');

Tower.watch = true;

Tower.View.store(new Tower.Store.FileSystem(['app/views']));

Tower.root = process.cwd();

Tower.publicPath = process.cwd() + '/public';

Tower.publicCacheDuration = 60 * 1000;

Tower.render = function(string, options) {
  if (options == null) {
    options = {};
  }
  return Tower.modules.mint.render(options.type, string, options);
};

Tower.domain = 'localhost';

Tower.run = function(argv) {
  return (new Tower.Command.Server(argv)).run();
};
