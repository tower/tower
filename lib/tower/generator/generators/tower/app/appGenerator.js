var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Generator.AppGenerator = (function() {

  __extends(AppGenerator, Tower.Generator);

  function AppGenerator() {
    AppGenerator.__super__.constructor.apply(this, arguments);
  }

  AppGenerator.prototype.run = function() {
    this.template(".gitignore");
    this.template(".npmignore");
    this.template(".slugignore");
    this.template("Cakefile");
    this.inside("app", function() {
      this.inside("client", function() {
        this.inside("controllers", function() {
          return this.template("applicationController.coffee");
        });
        return this.inside("stylesheets", function() {
          return this.template("application.stylus");
        });
      });
      this.inside("controllers", function() {
        return this.template("applicationController.coffee");
      });
      this.inside("helpers", function() {
        return this.template("applicationHelper.coffee");
      });
      this.directory("models");
      return this.inside("views", function() {
        return this.inside("layouts", function() {
          return this.template("application.coffee");
        });
      });
    });
    this.inside("config", function() {
      this.template("routes.coffee");
      this.template("application.coffee");
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
      return this.directory("tasks");
    });
    this.directory("log");
    this.template("package.json");
    this.template("Procfile");
    this.inside("public", function() {
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
      this.directory("javascripts");
      this.directory("stylesheets");
      return this.directory("swfs");
    });
    return this.template("Watchfile");
  };

  return AppGenerator;

})();

module.exports = Tower.Generator.AppGenerator;
