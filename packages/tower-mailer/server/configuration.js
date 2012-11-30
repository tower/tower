
Tower.MailerConfiguration = {
  ClassMethods: {
    lib: function() {
      return require('mailer');
    }
  }
};

module.exports = Tower.MailerConfiguration;
