
  Metro.Mailer.Configuration = {
    ClassMethods: {
      lib: function() {
        return require('mailer');
      }
    }
  };

  module.exports = Metro.Mailer.Configuration;
