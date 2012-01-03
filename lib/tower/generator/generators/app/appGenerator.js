var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Generator.AppGenerator = (function() {

  __extends(AppGenerator, Tower.Generator);

  function AppGenerator() {
    AppGenerator.__super__.constructor.apply(this, arguments);
  }

  AppGenerator.prototype.run = function() {
    this.template("Cakefile");
    this.template("Watchfile");
    this.inside("config", function() {
      this.template("routes.coffee");
      this.template("application.coffee");
      this.template("environment.coffee");
      this.directory("environments");
      this.directory("initializers");
      return this.directory("locales");
    });
    return this.inside("public", function() {
      this.template("humans.txt");
      return this.template("robots.txt");
    });
  };

  return AppGenerator;

})();

module.exports = Tower.Generator.AppGenerator;
