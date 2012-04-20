var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Generator.LibraryGenerator = (function(_super) {

  __extends(LibraryGenerator, _super);

  LibraryGenerator.name = 'LibraryGenerator';

  function LibraryGenerator() {
    return LibraryGenerator.__super__.constructor.apply(this, arguments);
  }

  LibraryGenerator.prototype.sourceRoot = __dirname;

  LibraryGenerator.prototype.buildApp = function(name) {
    var app;
    if (name == null) {
      name = this.appName;
    }
    app = LibraryGenerator.__super__.buildApp.call(this, name);
    app.title = this.program.title || _.titleize(app.name);
    app.description = this.program.description;
    app.keywords = this.program.keywords;
    return app;
  };

  LibraryGenerator.prototype.run = function() {
    return this.inside(this.app.name, '.', function() {
      if (!this.program.skipGitfile) {
        this.template("gitignore", ".gitignore");
      }
      this.template("npmignore", ".npmignore");
      this.template("cake", "Cakefile");
      this.template("pack", "package.json");
      this.template("README.md");
      this.directory("lib");
      this.inside("src", function() {
        return this.template("index.coffee", "" + this.app.name + ".coffee");
      });
      this.inside("test", function() {
        this.template("server.coffee");
        this.template("client.coffee");
        return this.template("mocha.opts");
      });
      this.directory("tmp");
      return this.template("watch", "Watchfile");
    });
  };

  return LibraryGenerator;

})(Tower.Generator);

module.exports = Tower.Generator.LibraryGenerator;
