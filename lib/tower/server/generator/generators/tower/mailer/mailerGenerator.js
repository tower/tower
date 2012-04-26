(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Tower.Generator.MailerGenerator = (function(_super) {

    __extends(MailerGenerator, _super);

    function MailerGenerator() {
      MailerGenerator.__super__.constructor.apply(this, arguments);
    }

    MailerGenerator.prototype.sourceRoot = __dirname;

    MailerGenerator.prototype.run = function() {
      return this.inside("app", '.', function() {
        return this.inside("mailers", '.', function() {
          return this.template("mailer.coffee", "" + this.model.name + "Mailer.coffee", function() {});
        });
      });
    };

    return MailerGenerator;

  })(Tower.Generator);

  module.exports = Tower.Generator.MailerGenerator;

}).call(this);
