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

Tower.GeneratorMochaViewGenerator = (function(_super) {
  var GeneratorMochaViewGenerator;

  function GeneratorMochaViewGenerator() {
    return GeneratorMochaViewGenerator.__super__.constructor.apply(this, arguments);
  }

  GeneratorMochaViewGenerator = __extends(GeneratorMochaViewGenerator, _super);

  __defineProperty(GeneratorMochaViewGenerator,  "sourceRoot", __dirname);

  __defineProperty(GeneratorMochaViewGenerator,  "run", function() {
    this.directory('test/cases/views');
    this.directory('test/cases/views/client');
    return this.template('view.coffee', "test/cases/views/client/" + this.model.name + "Test.coffee", function() {});
  });

  return GeneratorMochaViewGenerator;

})(Tower.Generator);

module.exports = Tower.GeneratorMochaViewGenerator;
