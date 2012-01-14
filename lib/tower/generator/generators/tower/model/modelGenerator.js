var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Generator.ModelGenerator = (function() {

  __extends(ModelGenerator, Tower.Generator);

  function ModelGenerator() {
    ModelGenerator.__super__.constructor.apply(this, arguments);
  }

  ModelGenerator.prototype.run = function() {
    this.inside("app", function() {
      return this.directory("models");
    });
    return this.template("model.coffee", "app/models/" + this.model.fileName + ".coffee", function() {});
  };

  return ModelGenerator;

})();

module.exports = Tower.Generator.ModelGenerator;
