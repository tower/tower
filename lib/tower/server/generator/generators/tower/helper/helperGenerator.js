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

Tower.Generator.HelperGenerator = (function(_super) {
  var HelperGenerator;

  function HelperGenerator() {
    return HelperGenerator.__super__.constructor.apply(this, arguments);
  }

  HelperGenerator = __extends(HelperGenerator, _super);

  __defineProperty(HelperGenerator,  "sourceRoot", __dirname);

  __defineProperty(HelperGenerator,  "run", function() {
    return this.inside("app", '.', function() {
      return this.inside("helpers", '.', function() {
        return this.template("helper.coffee", "" + this.model.name + "Helper.coffee", function() {});
      });
    });
  });

  return HelperGenerator;

})(Tower.Generator);

module.exports = Tower.Generator.HelperGenerator;
