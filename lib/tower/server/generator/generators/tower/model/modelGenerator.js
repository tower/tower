var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Generator.ModelGenerator = (function(_super) {

  __extends(ModelGenerator, _super);

  function ModelGenerator() {
    ModelGenerator.__super__.constructor.apply(this, arguments);
  }

  ModelGenerator.prototype.sourceRoot = __dirname;

  ModelGenerator.prototype.run = function() {
    this.directory("app/models");
    this.template("model.coffee", "app/models/" + this.model.name + ".coffee");
    return this.asset("/app/models/" + this.model.name);
  };

  return ModelGenerator;

})(Tower.Generator);

module.exports = Tower.Generator.ModelGenerator;
