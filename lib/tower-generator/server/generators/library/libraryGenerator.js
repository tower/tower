var __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) {
    if (typeof parent.__extend == 'function') return parent.__extend(child);
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if (typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.GeneratorLibraryGenerator = (function(_super) {
  var GeneratorLibraryGenerator;

  function GeneratorLibraryGenerator() {
    return GeneratorLibraryGenerator.__super__.constructor.apply(this, arguments);
  }

  GeneratorLibraryGenerator = __extends(GeneratorLibraryGenerator, _super);

  __defineProperty(GeneratorLibraryGenerator,  "sourceRoot", __dirname);

  __defineProperty(GeneratorLibraryGenerator,  "buildApp", function(name) {
    var app, _base;
    (_base = this.program).namespace || (_base.namespace = this.program.args[2]);
    name || (name = this.program.namespace);
    app = GeneratorLibraryGenerator.__super__[ "buildApp"].call(this, name);
    app.title = this.program.title || _.titleize(app.name);
    app.description = this.program.description;
    app.keywords = this.program.keywords;
    return app;
  });

  __defineProperty(GeneratorLibraryGenerator,  "run", function() {
    return this.inside(this.app.name, '.', function() {
      if (!this.program.skipGitfile) {
        this.template("gitignore", ".gitignore");
      }
      this.template("npmignore", ".npmignore");
      this.template("cake", "Cakefile");
      this.template("pack", "package.json");
      this.template("README.md");
      this.directory("lib");
      this.directory("src");
      this.template("index.coffee", "src/index.coffee");
      this.inside("test", function() {
        this.template("server.coffee");
        this.template("client.coffee");
        return this.template("mocha.opts");
      });
      this.directory("tmp");
      return this.template("watch", "Watchfile");
    });
  });

  return GeneratorLibraryGenerator;

})(Tower.Generator);

module.exports = Tower.GeneratorLibraryGenerator;
