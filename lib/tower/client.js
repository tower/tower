var Tower, module, _;

window.global || (window.global = window);

_ = global._;

module = global.module || {};

global.Tower = Tower = Ember.Namespace.create();

Tower.version = "0.0.0";

Tower.logger = console;

_.mixin(_.string.exports());

Tower._modules = {
  validator: function() {
    return global;
  },
  accounting: function() {
    return global.accounting;
  },
  moment: function() {
    return global.moment;
  },
  geo: function() {
    return global.geolib;
  },
  inflector: function() {
    return global.inflector;
  },
  async: function() {
    return global.async;
  },
  coffeecup: function() {
    if (global.CoffeeCup) {
      return global.CoffeeCup;
    } else {
      return global.CoffeeKup;
    }
  },
  socketio: function() {
    try {
      return global.io;
    } catch (_error) {}
  },
  sockjs: function() {
    try {
      return global.SockJS;
    } catch (_error) {}
  },
  _: function() {
    return _;
  }
};

require('../tower-support/client');

require('../tower-application/client');

require('../tower-store/client');

require('../tower-model/client');

require('../tower-view/client');

require('../tower-controller/client');

require('../tower-net/client');

require('../tower-middleware/server');

Tower.goTo = function(string, params) {};

Tower.joinPath = function() {
  return _.args(arguments).join('/');
};
