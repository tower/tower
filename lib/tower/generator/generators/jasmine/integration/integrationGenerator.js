var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Generator.Jasmine.IntegrationGenerator = (function(_super) {

  __extends(IntegrationGenerator, _super);

  function IntegrationGenerator() {
    IntegrationGenerator.__super__.constructor.apply(this, arguments);
  }

  IntegrationGenerator.prototype.sourceRoot = __dirname;

  IntegrationGenerator.prototype.run = function() {
    return this.inside("test", '.', function() {
      return this.inside("integration", '.', function() {
        return this.template("integration.coffee", "" + this.model.name + "IntegrationTest.coffee");
      });
    });
  };

  return IntegrationGenerator;

})(Tower.Generator);

module.exports = Tower.Generator.Jasmine.IntegrationGenerator;
