var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Generator.Mocha.ControllerGenerator = (function(_super) {

  __extends(ControllerGenerator, _super);

  ControllerGenerator.name = 'ControllerGenerator';

  function ControllerGenerator() {
    return ControllerGenerator.__super__.constructor.apply(this, arguments);
  }

  ControllerGenerator.prototype.sourceRoot = __dirname;

  ControllerGenerator.prototype.run = function() {
    this.directory("test/controllers");
    return this.template("controllers.coffee", "test/controllers/" + this.model.name + "Test.coffee", function() {});
  };

  return ControllerGenerator;

})(Tower.Generator);

module.exports = Tower.Generator.Mocha.ControllerGenerator;
