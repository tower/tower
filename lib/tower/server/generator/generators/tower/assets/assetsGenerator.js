var __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) { 
    if(typeof parent.__extend == 'function') return parent.__extend(child);
      
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if(typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.Generator.AssetsGenerator = (function(_super) {
  var AssetsGenerator;

  function AssetsGenerator() {
    return AssetsGenerator.__super__.constructor.apply(this, arguments);
  }

  AssetsGenerator = __extends(AssetsGenerator, _super);

  __defineProperty(AssetsGenerator,  "sourceRoot", __dirname);

  __defineProperty(AssetsGenerator,  "run", function() {
    return this.inside("app", '.', function() {
      return this.inside("client", '.', function() {
        return this.inside("stylesheets", '.', function() {});
      });
    });
  });

  return AssetsGenerator;

})(Tower.Generator);

module.exports = Tower.Generator.AssetsGenerator;
