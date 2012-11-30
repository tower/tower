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

Tower.GeneratorMochaServiceGenerator = (function(_super) {
  var GeneratorMochaServiceGenerator;

  function GeneratorMochaServiceGenerator() {
    return GeneratorMochaServiceGenerator.__super__.constructor.apply(this, arguments);
  }

  GeneratorMochaServiceGenerator = __extends(GeneratorMochaServiceGenerator, _super);

  __defineProperty(GeneratorMochaServiceGenerator,  "sourceRoot", __dirname);

  __defineProperty(GeneratorMochaServiceGenerator,  "run", function() {
    this.directory('test/cases/services');
    this.directory('test/cases/services/server');
    this.template('service.coffee', "test/cases/services/server/" + this.model.name + "Test.coffee");
    return this.asset("/test/cases/services/server/" + this.model.name + "Test", {
      bundle: 'development'
    });
  });

  return GeneratorMochaServiceGenerator;

})(Tower.Generator);

module.exports = Tower.GeneratorMochaServiceGenerator;
