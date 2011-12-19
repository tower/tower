(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Coach.Mailer = (function() {

    __extends(Mailer, Coach.Class);

    function Mailer() {
      Mailer.__super__.constructor.apply(this, arguments);
    }

    return Mailer;

  })();

  require('./mailer/configuration');

  require('./mailer/rendering');

  Coach.Mailer.include(Coach.Mailer.Configuration);

  Coach.Mailer.include(Coach.Mailer.Rendering);

  module.exports = Coach.Mailer;

}).call(this);
