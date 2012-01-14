var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Generator.ViewGenerator = (function() {

  __extends(ViewGenerator, Tower.Generator);

  function ViewGenerator(argv, options) {
    var model, name, pair, type, _i, _len;
    if (options == null) options = {};
    ViewGenerator.__super__.constructor.call(this, options);
    this.model = model = {
      className: argv.shift(),
      attributes: []
    };
    for (_i = 0, _len = argv.length; _i < _len; _i++) {
      pair = argv[_i];
      pair = pair.split(":");
      name = pair[0];
      type = Tower.Support.String.camelize(pair[1] || pair[0], true);
      model.attributes.push(new Tower.Generator.Attribute(name, Tower.Support.String.camelize(type)));
    }
    model.resourceName = Tower.Support.String.camelize(model.className, true);
  }

  ViewGenerator.prototype.run = function() {
    return this.inside("app", function() {
      return this.inside("views", function() {
        return this.inside("" + this.model.collectionName, function() {
          this.template("_form.coffee");
          this.template("_item.coffee");
          this.template("_list.coffee");
          this.template("_table.coffee");
          this.template("edit.coffee");
          this.template("index.coffee");
          this.template("new.coffee");
          return this.template("show.coffee");
        });
      });
    });
  };

  return ViewGenerator;

})();

module.exports = Tower.Generator.ViewGenerator;
