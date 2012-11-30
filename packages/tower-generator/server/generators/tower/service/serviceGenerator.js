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

Tower.GeneratorServiceGenerator = (function(_super) {
  var GeneratorServiceGenerator;

  function GeneratorServiceGenerator() {
    return GeneratorServiceGenerator.__super__.constructor.apply(this, arguments);
  }

  GeneratorServiceGenerator = __extends(GeneratorServiceGenerator, _super);

  __defineProperty(GeneratorServiceGenerator,  "sourceRoot", __dirname);

  __defineProperty(GeneratorServiceGenerator,  "run", function() {
    var scriptType;
    scriptType = 'coffee';
    this.directory('app/services');
    this.directory('app/services/server');
    this.template("service." + scriptType, "app/services/server/" + this.model.name + "." + scriptType);
    this.asset("/app/services/server/" + this.model.name);
    return this.generate('mocha:service');
  });

  return GeneratorServiceGenerator;

})(Tower.Generator);

module.exports = Tower.GeneratorServiceGenerator;
