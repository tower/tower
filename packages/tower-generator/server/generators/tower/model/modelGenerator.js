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

Tower.GeneratorModelGenerator = (function(_super) {
  var GeneratorModelGenerator;

  function GeneratorModelGenerator() {
    return GeneratorModelGenerator.__super__.constructor.apply(this, arguments);
  }

  GeneratorModelGenerator = __extends(GeneratorModelGenerator, _super);

  __defineProperty(GeneratorModelGenerator,  "sourceRoot", __dirname);

  __defineProperty(GeneratorModelGenerator,  "run", function() {
    var scriptType;
    scriptType = 'coffee';
    this.directory('app/models');
    this.directory('app/models/shared');
    this.template("model." + scriptType, "app/models/shared/" + this.model.name + "." + scriptType);
    this.template("factory." + scriptType, "test/factories/" + this.model.name + "Factory." + scriptType);
    this.asset("/app/models/shared/" + this.model.name);
    this.bootstrap(this.model);
    this.seed(this.model);
    return this.generate('mocha:model');
  });

  return GeneratorModelGenerator;

})(Tower.Generator);

module.exports = Tower.GeneratorModelGenerator;
