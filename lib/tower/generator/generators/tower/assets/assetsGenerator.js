var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Generator.ScaffoldGenerator = (function() {

  __extends(ScaffoldGenerator, Tower.Generator);

  function ScaffoldGenerator() {
    ScaffoldGenerator.__super__.constructor.apply(this, arguments);
  }

  ScaffoldGenerator.prototype.sourceRoot = __dirname;

  ScaffoldGenerator.prototype.run = function() {
    return this.inside("app", function() {
      return this.inside("client", function() {
        this.inside("stylesheets", function() {
          return this.template("stylesheet.css", "" + this.model.name + ".styl");
        });
        return this.inside("controllers", function() {
          return this.template("javascript.js", "" + this.model.pluralName + "Controller.coffee");
        });
      });
    });
  };

  return ScaffoldGenerator;

})();

module.exports = Tower.Generator.ScaffoldGenerator;
