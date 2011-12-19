
  Coach.Mailer.Configuration = {
    ClassMethods: {
      lib: function() {
        return require('mailer');
      }
    }
  };

  module.exports = Coach.Mailer.Configuration;
