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

Tower.Generator.ScaffoldGenerator = (function(_super) {
  var ScaffoldGenerator;

  function ScaffoldGenerator() {
    return ScaffoldGenerator.__super__.constructor.apply(this, arguments);
  }

  ScaffoldGenerator = __extends(ScaffoldGenerator, _super);

  __defineProperty(ScaffoldGenerator,  "sourceRoot", __dirname);

  __defineProperty(ScaffoldGenerator,  "run", function() {
    this.generate("model");
    this.generate("view");
    this.generate("controller");
    this.generate("helper");
    return this.generate("assets");
  });

  return ScaffoldGenerator;

})(Tower.Generator);

module.exports = Tower.Generator.ScaffoldGenerator;
