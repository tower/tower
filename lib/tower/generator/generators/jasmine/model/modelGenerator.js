var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Generator.Jasmine.ModelGenerator = (function(_super) {

  __extends(ModelGenerator, _super);

  function ModelGenerator() {
    ModelGenerator.__super__.constructor.apply(this, arguments);
  }

  ModelGenerator.prototype.sourceRoot = __dirname;

  ModelGenerator.prototype.run = function() {
    return this.inside("test", '.', function() {
      return this.inside("models", '.', function() {
        return this.template("model.coffee", "" + this.model.name + "Test.coffee");
      });
    });
  };

  return ModelGenerator;

})(Tower.Generator);

module.exports = Tower.Generator.Jasmine.ModelGenerator;
