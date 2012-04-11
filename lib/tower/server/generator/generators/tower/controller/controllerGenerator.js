var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Generator.ControllerGenerator = (function(_super) {

  __extends(ControllerGenerator, _super);

  function ControllerGenerator() {
    ControllerGenerator.__super__.constructor.apply(this, arguments);
  }

  ControllerGenerator.prototype.sourceRoot = __dirname;

  ControllerGenerator.prototype.run = function() {
    this.directory("app/controllers/" + this.controller.directory);
    this.template("controller.coffee", "app/controllers/" + this.controller.directory + "/" + this.controller.name + ".coffee");
    this.template("client/controller.coffee", ("app/client/controllers/" + this.controller.directory + "/" + this.controller.name + ".coffee").replace(/\/+/g, "/"));
    this.route('@resources "' + this.model.paramNamePlural + '"');
    this.navigation(this.model.namePlural, "urlFor(" + this.app.namespace + "." + this.model.className + ")");
    this.locale(/links: */, "\n    " + this.model.namePlural + ": \"" + this.model.humanName + "\"");
    return this.asset(("/app/client/controllers/" + this.controller.directory + "/" + this.controller.name).replace(/\/+/g, "/"));
  };

  return ControllerGenerator;

})(Tower.Generator);

module.exports = Tower.Generator.ControllerGenerator;
