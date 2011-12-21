(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Tower.Mailer = (function() {

    __extends(Mailer, Tower.Class);

    function Mailer() {
      Mailer.__super__.constructor.apply(this, arguments);
    }

    return Mailer;

  })();

  require('./mailer/configuration');

  require('./mailer/rendering');

  Tower.Mailer.include(Tower.Mailer.Configuration);

  Tower.Mailer.include(Tower.Mailer.Rendering);

  module.exports = Tower.Mailer;

}).call(this);
