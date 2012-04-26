(function() {
  var Tower, module;

  window.global || (window.global = window);

  module = global.module || {};

  global.Tower = Tower = {};

  Tower.version = "0.0.0";

  Tower.logger = console;

  Tower.modules = {
    validator: global,
    accounting: global.accounting,
    moment: global.moment,
    geo: global.geolib,
    inflector: global.inflector,
    async: global.async
  };

  require('./support');

  require('./application');

  require('./client/application');

  require('./store');

  require('./client/store');

  require('./model');

  require('./view');

  require('./client/view');

  require('./controller');

  require('./client/controller');

  require('./http');

  require('./middleware');

}).call(this);
