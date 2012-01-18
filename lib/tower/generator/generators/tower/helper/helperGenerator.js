var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Generator.HelperGenerator = (function() {

  __extends(HelperGenerator, Tower.Generator);

  function HelperGenerator() {
    HelperGenerator.__super__.constructor.apply(this, arguments);
  }

  HelperGenerator.prototype.sourceRoot = __dirname;

  HelperGenerator.prototype.run = function() {
    return this.inside("app", function() {
      return this.inside("helpers", function() {
        return this.template("helper.coffee", "" + this.model.resourceName + "Helper.coffee", function() {});
      });
    });
  };

  return HelperGenerator;

})();

module.exports = Tower.Generator.HelperGenerator;
