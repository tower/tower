
Tower.Application.Watcher = {
  reloadMap: {
    models: {
      pattern: /app\/models/,
      paths: []
    },
    controllers: {
      pattern: /app\/controllers/,
      paths: []
    },
    helpers: {
      pattern: /app\/helpers/,
      paths: []
    }
  },
  watch: function() {
    var child, forever,
      _this = this;
    forever = require("forever");
    child = new forever.Monitor("node_modules/design.io/bin/design.io", {
      max: 1,
      silent: false,
      options: []
    });
    child.start();
    child.on("stdout", function(data) {
      data = data.toString();
      try {
        return data.replace(/\[([^\]]+)\] (\w+) (\w+) (.+)/, function(_, date, type, action, path) {
          var ext;
          ext = path.match(/\.(\w+)$/g);
          if (ext) {
            ext = ext[0];
          }
          if (ext && ext.match(/(js|coffee)/) && !path.match(/^public/) && action.match(/(updated|deleted)/)) {
            _this.fileChanged(path);
          }
          return _;
        });
      } catch (error) {
        return _this;
      }
    });
    child.on("error", function(error) {
      return console.log(error);
    });
    return forever.startServer(child);
  },
  fileChanged: function(path) {
    if (path.match(/app\/views/)) {
      Tower.View.cache = {};
    }
    if (!path.match(/app\/(models|controllers)/)) {
      return;
    }
    path = require.resolve("" + Tower.root + "/" + path);
    delete require.cache[path];
    return process.nextTick(function() {
      return require(path);
    });
  }
};
