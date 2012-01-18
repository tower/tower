var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Generator.ControllerGenerator = (function() {

  __extends(ControllerGenerator, Tower.Generator);

  function ControllerGenerator() {
    ControllerGenerator.__super__.constructor.apply(this, arguments);
  }

  ControllerGenerator.prototype.sourceRoot = __dirname;

  ControllerGenerator.prototype.run = function() {
    return this.inside("app", function() {
      return this.inside("controllers", function() {
        return this.template("controller.coffee", "" + this.model.pluralName + "Controller.coffee", function() {});
      });
    });
  };

  return ControllerGenerator;

})();

module.exports = Tower.Generator.ControllerGenerator;
