var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Generator.Mocha.ViewGenerator = (function() {

  __extends(ViewGenerator, Tower.Generator);

  function ViewGenerator() {
    ViewGenerator.__super__.constructor.apply(this, arguments);
  }

  ViewGenerator.prototype.sourceRoot = __dirname;

  ViewGenerator.prototype.run = function() {
    this.inside("test", function() {
      return this.directory("views");
    });
    return this.template("view.coffee", "test/views/" + this.model.name + "Test.coffee", function() {});
  };

  return ViewGenerator;

})();

module.exports = Tower.Generator.Mocha.ViewGenerator;
