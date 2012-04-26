(function() {

  Tower.Mailer.Configuration = {
    ClassMethods: {
      lib: function() {
        return require('mailer');
      }
    }
  };

  module.exports = Tower.Mailer.Configuration;

}).call(this);
