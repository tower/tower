var _;

_ = Tower._;

Tower.UserStamps = {
  ClassMethods: {
    hasUserStamps: false,
    _hasUserStamper: function() {
      return this.hasUserStamps && false;
    },
    userstamps: function(options) {
      var createdBy, destroyedBy, metadata, type, updatedBy, userstamping;
      if (options == null) {
        options = {};
      }
      metadata = this.metadata();
      this.hasUserStamps = true;
      userstamping = metadata.userstamping || (metadata.userstamping = {});
      type = userstamping.type = options.type || 'User';
      createdBy = userstamping.createdBy = options.createdBy || 'createdBy';
      updatedBy = userstamping.updatedBy = options.updatedBy || 'updatedBy';
      destroyedBy = userstamping.destroyedBy = options.destroyedBy || 'destroyedBy';
      this.belongsTo(createdBy, {
        type: type
      });
      this.belongsTo(updatedBy, {
        type: type
      });
      this.before('create', 'setCreatedBy', {
        "if": '_hasUserStamper'
      });
      this.before('save', 'setUpdatedBy', {
        "if": '_hasUserStamper'
      });
      if (this.isParanoid) {
        this.belongsTo('destroyedBy', {
          type: type
        });
        return this.before('destroy', 'setDestroyedBy', {
          "if": '_hasUserStamper'
        });
      }
    }
  },
  _hasUserStamper: function() {
    return this.constructor._hasUserStamper();
  },
  setCreatedBy: function() {
    return this.set(this.constructor.metadata().createdBy, this.constructor.userStamper());
  },
  setUpdatedBy: function() {
    return this.set(this.constructor.metadata().updatedBy, this.constructor.userStamper());
  },
  setDestroyedBy: function() {
    return this.set(this.constructor.metadata().destroyedBy, this.constructor.userStamper());
  }
};
