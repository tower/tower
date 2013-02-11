var fs, path;

path = require('path');

var _modules = {};

function define(module, deps, callback) {
  _modules[module] = {
    deps: deps,
    cb: callback
  };
}

function requireModule(module) {
  return _modules[module].cb();
}

global.define = define;
global.requireModule = requireModule;

var jsdom = require("jsdom");
//var doc = jsdom("<html><body></body></html>", jsdom.level(1, "core"), options);
var document = jsdom.jsdom("<html><head></head><body><div id='#wrapper'></div></body></html>");
var window = jsdom.createWindow();
window.document = document;

global.window = window;
require('./shared/jquery');

global.$ = window.$;
global.Handlebars = require('handlebars');
//window.$("body").append('<div class="testing">Hello World, It works</div>');
//console.log(window.$(".testing").text());
require('ember-metal-node');
Ember.$ = $;
//console.log(Ember);
require('ember-runtime-node');
require('ember-states-node');
require('ember-routing-node');
require('ember-application-node');
require('ember-views-node');
require('./shared/handlebar-helpers');
var helpers = Ember.Handlebars.helpers;

var template = Ember.Handlebars.compile('Hello World!!!');

var App = Ember.Application.create({
  init: function() {
    //console.log(1);
  },
  rootElement: '#wrapper'
});

App.ApplicationController = Ember.Controller.extend({
  name: '12222223'
});

var View = Ember.View.extend({
  classNames: ['server-view']
});

var time;

App.ApplicationView = View.extend({
  template: template,
  insertElement: function() {
    this._super();
  },
  willInsertElement: function() {
    this._super();
    //time = new Date;
  },
  didInsertElement: function() {
    this._super();
    //console.log($("html").html());
    //console.log("1", ((new Date().getTime() - time.getTime())) + 'ms');
  }
});

var view = App.ApplicationView.create();

App.initialize();
time = new Date;
Em.run(function(){
  view.append();
});   
console.log("1", ((new Date().getTime() - time.getTime())) + 'ms');

Ember.run.scheduleOnce('afterRender', this, function() {
  //console.log(((new Date().getTime() - time.getTime())) + 'ms');
  console.log($("html").html());
});


/**
fs = require('fs');

if (process.env.TOWER_COMMAND === 'new') {
  module.exports = global.Tower = {
    isNew: true,
    toString: function() {
      return 'Tower';
    }
  };
} else {
  global.Ember = {
    lookup: global
  };
  
  module.exports = global.Tower = Ember.Namespace.create();
}

Tower.version = JSON.parse(fs.readFileSync(_path.normalize("" + __dirname + "/../../package.json"))).version;

Tower._modules = {
  validator: function() {
    return require('validator');
  },
  accounting: function() {
    return require('accounting');
  },
  moment: function() {
    return require('moment');
  },
  geo: function() {
    return require('geolib');
  },
  inflector: function() {
    return require('inflection');
  },
  async: function() {
    return require('async');
  },
  superagent: function() {
    return require('superagent');
  },
  mime: function() {
    return require('mime');
  },
  mint: function() {
    return require('mint');
  },
  kue: function() {
    return require('kue');
  },
  coffeecup: function() {
    return require('coffeecup');
  },
  socketio: function() {
    try {
      return require('socket.io');
    } catch (_error) {}
  },
  sockjs: function() {
    try {
      return require('sockjs');
    } catch (_error) {}
  },
  _: function() {
    return _;
  },
  wrench: function() {
    return require('wrench');
  },
  crypto: function() {
    return require('crypto');
  },
  mkdirp: function() {
    return require('mkdirp');
  }
};

Tower._ = require('underscore');

Tower._.mixin(require('underscore.string'));

require('../tower-support/server');

if (!Tower.isNew) {
  require('../tower-application/server');
  require('../tower-store/server');
  require('../tower-model/server');
  require('../tower-view/server');
  require('../tower-controller/server');
  require('../tower-net/server');
  require('../tower-mailer/server');
  require('../tower-middleware/server');
}

require('../tower-command/server');

require('../tower-generator/server');

global._ = Tower._;

_.extend(Tower, {
  watch: true,
  publicCacheDuration: 60 * 1000,
  domain: 'localhost',
  defaultEncoding: 'utf-8',
  logger: console,
  pathSeparator: _path.sep,
  pathSeparatorEscaped: _.regexpEscape(_path.sep),
  pathRegExp: new RegExp(_.regexpEscape(_path.sep), 'g'),
  render: function(string, options) {
    if (options == null) {
      options = {};
    }
    return Tower.modules.mint.render(options.type, string, options);
  },
  joinPath: function() {
    return _path.join.apply(_path, arguments);
  },
  run: function(argv) {
    Tower.Command.load('server');
    return (new Tower.CommandServer(argv)).run();
  },
  testIfRoot: function(path) {
    var ext, _i, _len, _ref;
    if (!(fs.existsSync(path) && fs.statSync(path).isDirectory(path))) {
      return false;
    }
    if (!fs.existsSync(_path.join(path, 'package.json'))) {
      return false;
    }
    if (!fs.existsSync(_path.join(path, 'server.js'))) {
      return false;
    }
    _ref = ['coffee', 'js', 'iced'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      ext = _ref[_i];
      if (fs.existsSync(_path.join(path, "app/config/shared/application." + ext))) {
        return path;
      }
    }
    return false;
  },
  setRoot: function(path) {
    path || (path = process.env.TOWER_ROOT);
    if (!path) {
      path = process.cwd();
      while (!Tower.testIfRoot(path) && path !== _path.sep && !path.match(/(?:\\|\/)$/)) {
        path = _path.join(path, '..');
      }
    }
    if (path !== _path.sep) {
      Tower.root = path;
    }
    if (Tower.root == null) {
      throw new Error('Could not find Tower.root');
    }
    Tower.publicPath = Tower.joinPath(Tower.root, 'public');
    return Tower.root;
  }
});

try {
  Tower.setRoot();
} catch (error) {
  console.log(error);
}

if (Tower.View) {
  Tower.View.store(new Tower.StoreFileSystem(['app/templates/shared', 'app/templates/server']));
}
**/