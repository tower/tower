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

Tower.GeneratorMailerGenerator = (function(_super) {
  var GeneratorMailerGenerator;

  function GeneratorMailerGenerator() {
    return GeneratorMailerGenerator.__super__.constructor.apply(this, arguments);
  }

  GeneratorMailerGenerator = __extends(GeneratorMailerGenerator, _super);

  __defineProperty(GeneratorMailerGenerator,  "sourceRoot", __dirname);

  __defineProperty(GeneratorMailerGenerator,  "run", function() {
    return this.inside("app", '.', function() {
      return this.inside("mailers", '.', function() {
        return this.template("mailer.coffee", "" + this.model.name + "Mailer.coffee", function() {});
      });
    });
  });

  return GeneratorMailerGenerator;

})(Tower.Generator);

module.exports = Tower.GeneratorMailerGenerator;
