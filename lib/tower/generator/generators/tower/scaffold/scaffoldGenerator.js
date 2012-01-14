var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Generator.ScaffoldGenerator = (function() {

  __extends(ScaffoldGenerator, Tower.Generator);

  function ScaffoldGenerator() {
    ScaffoldGenerator.__super__.constructor.apply(this, arguments);
  }

  ScaffoldGenerator.prototype.run = function() {
    this.hookFor("model");
    this.hookFor("view");
    this.hookFor("controller");
    this.hookFor("mailer");
    this.hookFor("helper");
    return this.hookFor("assets");
  };

  return ScaffoldGenerator;

})();

module.exports = Tower.Generator.ScaffoldGenerator;
