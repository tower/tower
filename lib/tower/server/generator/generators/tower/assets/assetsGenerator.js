var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Generator.AssetsGenerator = (function(_super) {

  __extends(AssetsGenerator, _super);

  function AssetsGenerator() {
    AssetsGenerator.__super__.constructor.apply(this, arguments);
  }

  AssetsGenerator.prototype.sourceRoot = __dirname;

  AssetsGenerator.prototype.run = function() {
    return this.inside("app", '.', function() {
      return this.inside("client", '.', function() {
        return this.inside("stylesheets", '.', function() {});
      });
    });
  };

  return AssetsGenerator;

})(Tower.Generator);

module.exports = Tower.Generator.AssetsGenerator;
