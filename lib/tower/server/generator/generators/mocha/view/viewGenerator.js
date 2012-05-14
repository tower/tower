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

Tower.Generator.Mocha.ViewGenerator = (function(_super) {
  var ViewGenerator;

  function ViewGenerator() {
    return ViewGenerator.__super__.constructor.apply(this, arguments);
  }

  ViewGenerator = __extends(ViewGenerator, _super);

  __defineProperty(ViewGenerator,  "sourceRoot", __dirname);

  __defineProperty(ViewGenerator,  "run", function() {
    this.inside("test", function() {
      return this.directory("views");
    });
    return this.template("view.coffee", "test/views/" + this.model.name + "Test.coffee", function() {});
  });

  return ViewGenerator;

})(Tower.Generator);

module.exports = Tower.Generator.Mocha.ViewGenerator;
