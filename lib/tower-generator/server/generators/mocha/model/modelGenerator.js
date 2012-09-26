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

Tower.GeneratorMochaModelGenerator = (function(_super) {
  var GeneratorMochaModelGenerator;

  function GeneratorMochaModelGenerator() {
    return GeneratorMochaModelGenerator.__super__.constructor.apply(this, arguments);
  }

  GeneratorMochaModelGenerator = __extends(GeneratorMochaModelGenerator, _super);

  __defineProperty(GeneratorMochaModelGenerator,  "sourceRoot", __dirname);

  __defineProperty(GeneratorMochaModelGenerator,  "run", function() {
    this.directory('test/cases/models');
    this.directory('test/cases/models/client');
    this.directory('test/cases/models/server');
    this.directory('test/cases/models/shared');
    this.template('model.coffee', "test/cases/models/shared/" + this.model.name + "Test.coffee");
    return this.asset("/test/cases/models/shared/" + this.model.name + "Test", {
      bundle: 'development'
    });
  });

  return GeneratorMochaModelGenerator;

})(Tower.Generator);

module.exports = Tower.GeneratorMochaModelGenerator;
