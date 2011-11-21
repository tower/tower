(function() {
  var File, connect;

  connect = require('connect');

  File = require('pathfinder').File;

  Metro.Application = (function() {

    function Application() {
      this.server || (this.server = require('connect')());
    }

    Application.instance = function() {
      return this._instance || (this._instance = new Metro.Application);
    };

    Application.initialize = function() {
      Metro.Route.initialize();
      Metro.View.initialize();
      Metro.Controller.initialize();
      this.loadInitializers();
      return this.instance();
    };

    Application.loadInitializers = function() {
      var path, paths, _i, _len, _results;
      require("" + Metro.root + "/config/application");
      require("" + Metro.root + "/config/environments/" + Metro.env);
      paths = File.files("" + Metro.root + "/config/initializers");
      _results = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        _results.push(require(path));
      }
      return _results;
    };

    Application.teardown = function() {
      Metro.Route.teardown();
      Metro.View.teardown();
      Metro.Controller.teardown();
      return delete this._instance;
    };

    Application.prototype.stack = function() {
      this.server.use(connect.favicon(Metro.publicPath + "/favicon.ico"));
      this.server.use(Metro.Middleware.Static.middleware);
      this.server.use(Metro.Middleware.Query.middleware);
      this.server.use(connect.bodyParser());
      this.server.use(Metro.Middleware.Dependencies.middleware);
      this.server.use(Metro.Middleware.Router.middleware);
      return this.server;
    };

    Application.prototype.listen = function() {
      if (Metro.env !== "test") {
        this.server.listen(Metro.port);
        return console.log("Metro " + Metro.env + " server listening on port " + Metro.port);
      }
    };

    Application.run = function() {
      Metro.Application.instance().stack();
      return Metro.Application.instance().listen();
    };

    return Application;

  })();

  module.exports = Metro.Application;

}).call(this);
