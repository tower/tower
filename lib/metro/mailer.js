(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Metro.Mailer = (function() {

    __extends(Mailer, Metro.Object);

    function Mailer() {
      Mailer.__super__.constructor.apply(this, arguments);
    }

    Mailer.lib = function() {
      return require('mailer');
    };

    Mailer.mail = function(options, callback) {
      if (options == null) options = {};
      this.host = options.host;
      this.port = options.port;
      this.domain = options.domain;
      this.to = options.to;
      this.from = options.from;
      this.subject = options.subject;
      this.locals = options.locals || {};
      return this.template = options.template;
    };

    Mailer.prototype.deliver = function() {
      var email, self;
      email = this.constructor.lib();
      self = this;
      return Shift.render({
        path: this.template
      }, this.locals, function(error, body) {
        var options;
        options = {
          host: self.host,
          port: self.port,
          domain: self.domain,
          to: self.to,
          from: self.from,
          subject: self.subject,
          body: body,
          authentication: self.login,
          username: self.username,
          password: self.password
        };
        return email.send(options, function(error, result) {
          if (error) console.log(error);
          return console.log(result);
        });
      });
    };

    return Mailer;

  })();

  module.exports = Metro.Mailer;

}).call(this);
