
  Coach.Mailer.Rendering = {
    ClassMethods: {
      mail: function(options, callback) {
        if (options == null) options = {};
        this.host = options.host;
        this.port = options.port;
        this.domain = options.domain;
        this.to = options.to;
        this.from = options.from;
        this.subject = options.subject;
        this.locals = options.locals || {};
        return this.template = options.template;
      }
    },
    deliver: function() {
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
    }
  };

  module.exports = Coach.Mailer.Rendering;
