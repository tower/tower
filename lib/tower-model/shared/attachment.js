var _;

_ = Tower._;

Tower.ModelAttachment = {
  ClassMethods: {
    attachment: function(name, options) {
      var attachmentClass, attachmentClassName;
      if (typeof name === 'string') {
        options || (options = {});
        attachmentClassName = _.camelize(name);
        attachmentClass = this[attachmentClassName] = Tower.Model.extend();
        attachmentClass._attachmentFields();
        attachmentClass._attachmentProcessing(options);
        return this.hasOne(name, {
          type: attachmentClass
        });
      } else {
        options = name;
        options || (options = {});
        this._attachmentFields();
        return this._attachmentProcessing(options);
      }
    },
    attachments: function() {
      return this.metadata().attachments;
    },
    _attachmentFields: function() {
      this.field('name', {
        type: 'String'
      });
      this.field('size', {
        type: 'Integer'
      });
      this.field('width', {
        type: 'Integer'
      });
      this.field('height', {
        type: 'Integer'
      });
      return this.field('contentType', {
        type: 'String'
      });
    },
    _attachmentProcessing: function(options) {
      this.include(Tower.AttachmentProcessingMixin);
      if (options.styles) {
        return this.styles(options.styles);
      }
    }
  }
};

require('./attachment/processing');

module.exports = Tower.ModelAttachment;
