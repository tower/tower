// Define top-level variables.
var fs, path;
// Initialize those variables.
path = require('path');
/**
 * Create a new application instance;
 * @return {[type]} [description]
 */
Tower.create = function () {
  return new Tower.Application();
};

var app = Tower.Packager.findApp();

app.autoload.forEach(function(file) {
  require(path.join(app.path, file));
});

/**

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