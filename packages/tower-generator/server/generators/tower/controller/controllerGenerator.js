var __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) {
    if (typeof parent.__extend == 'function') return parent.__extend(child);
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if (typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.GeneratorControllerGenerator = (function(_super) {
  var GeneratorControllerGenerator;

  function GeneratorControllerGenerator() {
    return GeneratorControllerGenerator.__super__.constructor.apply(this, arguments);
  }

  GeneratorControllerGenerator = __extends(GeneratorControllerGenerator, _super);

  __defineProperty(GeneratorControllerGenerator,  "sourceRoot", __dirname);

  __defineProperty(GeneratorControllerGenerator,  "run", function() {
    var scriptType;
    scriptType = 'coffee';
    this.directory("app/controllers/server/" + this.controller.directory);
    this.template("controller." + scriptType, "app/controllers/server/" + this.controller.directory + "/" + this.controller.name + "." + scriptType);
    this.template("client/controller." + scriptType, ("app/controllers/client/" + this.controller.directory + "/" + this.controller.name + "." + scriptType).replace(/\/+/g, "/"));
    this.route("@resources '" + this.model.paramNamePlural + "'");
    this.navigation(this.model.namePlural, "urlFor(" + this.app.namespace + "." + this.model.className + ")");
    this.locale(/links: */, "\n    " + this.model.namePlural + ": \"" + this.model.humanNamePlural + "\"");
    this.asset(("/app/controllers/client/" + this.controller.directory + "/" + this.controller.name).replace(/\/+/g, "/"));
    return this.generate('mocha:controller');
  });

  return GeneratorControllerGenerator;

})(Tower.Generator);

module.exports = Tower.GeneratorControllerGenerator;
