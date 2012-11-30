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

Tower.GeneratorAssetsGenerator = (function(_super) {
  var GeneratorAssetsGenerator;

  function GeneratorAssetsGenerator() {
    return GeneratorAssetsGenerator.__super__.constructor.apply(this, arguments);
  }

  GeneratorAssetsGenerator = __extends(GeneratorAssetsGenerator, _super);

  __defineProperty(GeneratorAssetsGenerator,  "sourceRoot", __dirname);

  __defineProperty(GeneratorAssetsGenerator,  "run", function() {
    return this.inside("app", '.', function() {
      return this.inside("stylesheets", '.', function() {
        return this.inside("client", '.', function() {});
      });
    });
  });

  return GeneratorAssetsGenerator;

})(Tower.Generator);

module.exports = Tower.GeneratorAssetsGenerator;
