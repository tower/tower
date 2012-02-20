var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Generator.ViewGenerator = (function(_super) {

  __extends(ViewGenerator, _super);

  function ViewGenerator() {
    ViewGenerator.__super__.constructor.apply(this, arguments);
  }

  ViewGenerator.prototype.sourceRoot = __dirname;

  ViewGenerator.prototype.run = function() {
    var view, views, _i, _len, _results;
    this.inside("app", function() {
      return this.inside("views", function() {
        return this.directory("" + this.model.pluralName);
      });
    });
    views = ["_form", "_item", "_list", "_table", "edit", "index", "new", "show"];
    _results = [];
    for (_i = 0, _len = views.length; _i < _len; _i++) {
      view = views[_i];
      _results.push(this.template("" + view + ".coffee", "app/views/" + this.model.pluralName + "/" + view + ".coffee"));
    }
    return _results;
  };

  return ViewGenerator;

})(Tower.Generator);

module.exports = Tower.Generator.ViewGenerator;
