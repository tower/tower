var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Generator.AppGenerator = (function() {

  __extends(AppGenerator, Tower.Generator);

  function AppGenerator() {
    AppGenerator.__super__.constructor.apply(this, arguments);
  }

  AppGenerator.prototype.sourceRoot = __dirname;

  AppGenerator.prototype.buildProject = function(name) {
    var project;
    if (name == null) name = this.projectName;
    project = AppGenerator.__super__.buildProject.call(this, name);
    project.title = this.program.title || Tower.Support.String.camelize(project.name);
    project.description = this.program.description;
    project.keywords = this.program.keywords;
    return project;
  };

  AppGenerator.prototype.run = function() {
    return this.inside(this.project.name, '.', function() {
      if (!this.program.skipProcfile) this.template(".gitignore");
      this.template(".npmignore");
      if (!this.program.skipProcfile) this.template(".slugignore");
      this.template("Cakefile");
      this.inside("app", function() {
        this.inside("client", function() {
          this.inside("config", function() {
            return this.template("application.coffee");
          });
          this.directory("helpers");
          return this.inside("stylesheets", function() {
            return this.template("application.styl");
          });
        });
        this.inside("controllers", function() {
          return this.template("applicationController.coffee");
        });
        this.inside("helpers", function() {
          return this.template("applicationHelper.coffee");
        });
        this.directory("mailers");
        this.directory("models");
        return this.inside("views", function() {
          this.template("index.coffee");
          this.inside("layouts", function() {
            return this.template("application.coffee");
          });
          return this.inside("shared", function() {
            this.template("_footer.coffee");
            this.template("_header.coffee");
            this.template("_meta.coffee");
            this.template("_navigation.coffee");
            return this.template("_sidebar.coffee");
          });
        });
      });
      this.inside("config", function() {
        this.template("application.coffee");
        this.template("assets.coffee");
        this.template("routes.coffee");
        this.inside("environments", function() {
          this.template("development.coffee");
          this.template("production.coffee");
          return this.template("test.coffee");
        });
        this.inside("initializers", function() {
          this.template("secrets.coffee");
          return this.template("session.coffee");
        });
        return this.inside("locales", function() {
          return this.template("en.coffee");
        });
      });
      this.inside("lib", function() {
        this.directory("tasks");
        return this.inside("stylesheets", function() {
          return this.template("reset.styl");
        });
      });
      this.directory("log");
      this.template("package.json");
      if (!this.program.skipProcfile) this.template("Procfile");
      this.inside("public", function() {
        this.template("404.html");
        this.template("500.html");
        this.template("favicon.ico");
        this.template("crossdomain.xml");
        this.template("humans.txt");
        return this.template("robots.txt");
      });
      this.template("README.md");
      this.template("server.js");
      this.inside("test", function() {
        this.directory("controllers");
        this.directory("factories");
        this.directory("features");
        this.directory("models");
        return this.template("config.coffee");
      });
      this.directory("tmp");
      this.inside("vendor", function() {
        this.inside("javascripts", function() {
          this.get("https://raw.github.com/documentcloud/underscore/master/underscore.js", "underscore.js");
          this.get("https://raw.github.com/epeli/underscore.string/master/lib/underscore.string.js", "underscore.string.js");
          this.get("https://raw.github.com/caolan/async/master/lib/async.js", "async.js");
          this.get("https://raw.github.com/LearnBoost/socket.io-client/master/dist/socket.io.js", "socket.io.js");
          this.get("https://raw.github.com/viatropos/design.io/master/design.io.js", "design.io.js");
          this.get("https://raw.github.com/viatropos/tower.js/master/dist/tower.js", "tower.js");
          this.get("https://raw.github.com/balupton/history.js/master/scripts/uncompressed/history.js", "history.js");
          this.get("https://raw.github.com/timrwood/moment/master/moment.js", "moment.js");
          return this.get("https://raw.github.com/medialize/URI.js/gh-pages/src/URI.js", "uri.js");
        });
        this.directory("stylesheets");
        return this.inside("swfs", function() {
          this.get("https://raw.github.com/LearnBoost/socket.io-client/master/dist/WebSocketMain.swf", "WebSocketMain.swf");
          return this.get("https://raw.github.com/LearnBoost/socket.io-client/master/dist/WebSocketMainInsecure.swf", "WebSocketMainInsecure.swf");
        });
      });
      return this.template("Watchfile");
    });
  };

  return AppGenerator;

})();

module.exports = Tower.Generator.AppGenerator;
