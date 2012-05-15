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

Tower.Generator.Mocha.ControllerGenerator = (function(_super) {
  var ControllerGenerator;

  function ControllerGenerator() {
    return ControllerGenerator.__super__.constructor.apply(this, arguments);
  }

  ControllerGenerator = __extends(ControllerGenerator, _super);

  __defineProperty(ControllerGenerator,  "sourceRoot", __dirname);

  __defineProperty(ControllerGenerator,  "run", function() {
    this.directory("test/controllers");
    return this.template("controller.coffee", "test/controllers/" + this.model.namePlural + "ControllerTest.coffee", function() {});
  });

  return ControllerGenerator;

})(Tower.Generator);

module.exports = Tower.Generator.Mocha.ControllerGenerator;
