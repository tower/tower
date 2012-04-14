var __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) { 
    if(typeof parent.__extend == 'function') return parent.__extend();
      
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if(typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.Generator.LibraryGenerator = (function(_super) {
  var LibraryGenerator;

  function LibraryGenerator() {
    return LibraryGenerator.__super__.constructor.apply(this, arguments);
  }

  LibraryGenerator = __extends(LibraryGenerator, _super);

  __defineProperty(LibraryGenerator,  "sourceRoot", __dirname);

  __defineProperty(LibraryGenerator,  "buildApp", function(name) {
    var app;
    if (name == null) {
      name = this.appName;
    }
    app = LibraryGenerator.__super__[ "buildApp"].call(this, name);
    app.title = this.program.title || _.titleize(app.name);
    app.description = this.program.description;
    app.keywords = this.program.keywords;
    return app;
  });

  __defineProperty(LibraryGenerator,  "run", function() {
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
  });

  return LibraryGenerator;

})(Tower.Generator);

module.exports = Tower.Generator.LibraryGenerator;
