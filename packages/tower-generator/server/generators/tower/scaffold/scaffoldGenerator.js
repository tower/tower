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

Tower.GeneratorScaffoldGenerator = (function(_super) {
  var GeneratorScaffoldGenerator;

  function GeneratorScaffoldGenerator() {
    return GeneratorScaffoldGenerator.__super__.constructor.apply(this, arguments);
  }

  GeneratorScaffoldGenerator = __extends(GeneratorScaffoldGenerator, _super);

  __defineProperty(GeneratorScaffoldGenerator,  "sourceRoot", __dirname);

  __defineProperty(GeneratorScaffoldGenerator,  "run", function() {
    this.generate('model');
    this.generate('template');
    this.generate('view');
    this.generate('controller');
    return this.generate('assets');
  });

  return GeneratorScaffoldGenerator;

})(Tower.Generator);

module.exports = Tower.GeneratorScaffoldGenerator;
