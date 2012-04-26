(function() {

  Tower.Model.Attachment = {
    ClassMethod: {
      attachment: function(name, options) {
        if (options == null) options = {};
      },
      attachments: function() {
        return this.metadata().attachments;
      }
    }
  };

  module.exports = Tower.Model.Attachment;

}).call(this);
