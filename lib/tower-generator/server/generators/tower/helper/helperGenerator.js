var __hasProp = {}.hasOwnProperty,
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

Tower.GeneratorHelperGenerator = (function(_super) {
  var GeneratorHelperGenerator;

  function GeneratorHelperGenerator() {
    return GeneratorHelperGenerator.__super__.constructor.apply(this, arguments);
  }

  GeneratorHelperGenerator = __extends(GeneratorHelperGenerator, _super);

  GeneratorHelperGenerator.reopen({
    sourceRoot: __dirname,
    run: function() {
      return this.inside("app", '.', function() {
        return this.inside("helpers", '.', function() {
          return this.template("helper.coffee", "" + this.model.name + "Helper.coffee", function() {});
        });
      });
    }
  });

  return GeneratorHelperGenerator;

})(Tower.Generator);

module.exports = Tower.GeneratorHelperGenerator;
