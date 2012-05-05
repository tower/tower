var __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) { 
    if(typeof parent.__extend == 'function') return parent.__extend(child);
      
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if(typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.Generator.ControllerGenerator = (function(_super) {
  var ControllerGenerator;

  function ControllerGenerator() {
    return ControllerGenerator.__super__.constructor.apply(this, arguments);
  }

  ControllerGenerator = __extends(ControllerGenerator, _super);

  __defineProperty(ControllerGenerator,  "sourceRoot", __dirname);

  __defineProperty(ControllerGenerator,  "run", function() {
    this.directory("app/controllers/" + this.controller.directory);
    this.template("controller.coffee", "app/controllers/" + this.controller.directory + "/" + this.controller.name + ".coffee");
    this.template("client/controller.coffee", ("app/client/controllers/" + this.controller.directory + "/" + this.controller.name + ".coffee").replace(/\/+/g, "/"));
    this.route('@resources "' + this.model.paramNamePlural + '"');
    this.navigation(this.model.namePlural, "urlFor(" + this.app.namespace + "." + this.model.className + ")");
    this.locale(/links: */, "\n    " + this.model.namePlural + ": \"" + this.model.humanName + "\"");
    this.asset(("/app/client/controllers/" + this.controller.directory + "/" + this.controller.name).replace(/\/+/g, "/"));
    return this.generate("mocha:controller");
  });

  return ControllerGenerator;

})(Tower.Generator);

module.exports = Tower.Generator.ControllerGenerator;
