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

Tower.GeneratorMochaControllerGenerator = (function(_super) {
  var GeneratorMochaControllerGenerator;

  function GeneratorMochaControllerGenerator() {
    return GeneratorMochaControllerGenerator.__super__.constructor.apply(this, arguments);
  }

  GeneratorMochaControllerGenerator = __extends(GeneratorMochaControllerGenerator, _super);

  __defineProperty(GeneratorMochaControllerGenerator,  "sourceRoot", __dirname);

  __defineProperty(GeneratorMochaControllerGenerator,  "run", function() {
    this.directory('test/cases/controllers');
    this.directory('test/cases/controllers/client');
    this.directory('test/cases/controllers/server');
    return this.template('controller.coffee', "test/cases/controllers/server/" + this.model.namePlural + "ControllerTest.coffee", function() {});
  });

  return GeneratorMochaControllerGenerator;

})(Tower.Generator);

module.exports = Tower.GeneratorMochaControllerGenerator;
