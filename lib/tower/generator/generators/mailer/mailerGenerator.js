var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Generator.MailerGenerator = (function() {

  __extends(MailerGenerator, Tower.Generator);

  function MailerGenerator(argv, options) {
    var model, name, pair, type, _i, _len;
    if (options == null) options = {};
    MailerGenerator.__super__.constructor.call(this, options);
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
    model.fileName = Tower.Support.String.camelize(model.className, true);
  }

  MailerGenerator.prototype.run = function() {
    return this.inside("app", function() {
      return this.inside("controllers", function() {
        return this.template("controller.coffee", "" + this.model.resourceName + ".coffee", function() {});
      });
    });
  };

  return MailerGenerator;

})();

module.exports = Tower.Generator.ModelGenerator;
