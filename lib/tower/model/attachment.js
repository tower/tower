
Tower.Model.Attachment = {
  ClassMethods: {
    attachment: function(name, options) {
      if (options == null) {
        options = {};
      }
      return this.field(name, function() {
        this.field('name');
        this.field('size');
        return this.field('path');
      });
    },
    attachments: function() {
      return this.metadata().attachments;
    }
  },
  attachments: function() {}
};

module.exports = Tower.Model.Attachment;
