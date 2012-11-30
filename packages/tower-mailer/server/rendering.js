var _this = this;

Tower.MailerRendering = {
  ClassMethods: {
    config: {},
    transport: function() {
      var config;
      if (this._transport) {
        return this._transport;
      }
      config = this.config = Tower.Mailer.config[Tower.env] || {};
      return this._transport = require('nodemailer').createTransport('SMTP', config);
    },
    mail: function(options, callback) {
      var _this = this;
      if (options == null) {
        options = {};
      }
      return this.render(options, function(error, options) {
        return _this.transport().sendMail(options, callback);
      });
    },
    render: function(options, callback) {
      var locals, template;
      template = options.template;
      delete options.template;
      if (template) {
        locals = options.locals || {};
        delete options.locals;
        return Tower.module('mint').render({
          path: template,
          locals: locals
        }, function(error, result) {
          options.html = result;
          return callback.call(_this, error, options);
        });
      } else {
        return callback.call(_this, null, options);
      }
    }
  }
};

module.exports = Tower.MailerRendering;
