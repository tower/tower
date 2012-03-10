var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Generator.Mocha.ModelGenerator = (function() {

  __extends(ModelGenerator, Tower.Generator);

  function ModelGenerator() {
    ModelGenerator.__super__.constructor.apply(this, arguments);
  }

  ModelGenerator.prototype.sourceRoot = __dirname;

  ModelGenerator.prototype.run = function() {
    this.directory("test/models");
    return this.template("model.coffee", "test/models/" + this.model.name + "Test.coffee");
  };

  return ModelGenerator;

})();

module.exports = Tower.Generator.Mocha.ModelGenerator;
