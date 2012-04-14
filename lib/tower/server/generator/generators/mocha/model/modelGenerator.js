var __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) { 
    if(typeof parent.__extend == 'function') return parent.__extend();
      
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if(typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.Generator.Mocha.ModelGenerator = (function(_super) {
  var ModelGenerator;

  function ModelGenerator() {
    return ModelGenerator.__super__.constructor.apply(this, arguments);
  }

  ModelGenerator = __extends(ModelGenerator, _super);

  __defineProperty(ModelGenerator,  "sourceRoot", __dirname);

  __defineProperty(ModelGenerator,  "run", function() {
    this.directory("test/models");
    this.template("model.coffee", "test/models/" + this.model.name + "Test.coffee");
    return this.asset("/test/models/" + this.model.name + "Test", {
      bundle: "development"
    });
  });

  return ModelGenerator;

})(Tower.Generator);

module.exports = Tower.Generator.Mocha.ModelGenerator;
