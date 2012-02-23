var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Generator.ControllerGenerator = (function(_super) {

  __extends(ControllerGenerator, _super);

  function ControllerGenerator() {
    ControllerGenerator.__super__.constructor.apply(this, arguments);
  }

  ControllerGenerator.prototype.sourceRoot = __dirname;

  ControllerGenerator.prototype.run = function() {
    this.inside("app", '.', function() {
      this.inside("controllers", '.', function() {
        return this.template("controller.coffee", "" + this.model.pluralName + "Controller.coffee");
      });
      return this.inside("client", function() {
        return this.inside("controllers", '.', function() {
          return this.template("controller.coffee", "" + this.model.pluralName + "Controller.coffee");
        });
      });
    });
    return this.route('@resources "' + this.model.pluralName + '"');
  };

  return ControllerGenerator;

})(Tower.Generator);

module.exports = Tower.Generator.ControllerGenerator;
