var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Generator.ControllerGenerator = (function() {

  __extends(ControllerGenerator, Tower.Generator);

  function ControllerGenerator() {
    ControllerGenerator.__super__.constructor.apply(this, arguments);
  }

  ControllerGenerator.prototype.sourceRoot = __dirname;

  ControllerGenerator.prototype.run = function() {
    this.directory("app/controllers/" + this.controller.directory);
    this.template("controller.coffee", "app/controllers/" + this.controller.directory + "/" + this.controller.name + ".coffee");
    this.template("client/controller.coffee", ("app/controllers/client/" + this.controller.directory + "/" + this.controller.name + ".coffee").replace(/\/+/g, "/"));
    this.route('@resources "' + this.model.namePlural + '"');
    return this.asset(("/app/controllers/client/" + this.controller.directory + "/" + this.controller.name).replace(/\/+/g, "/"));
  };

  return ControllerGenerator;

})();

module.exports = Tower.Generator.ControllerGenerator;
