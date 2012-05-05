
Tower.Model.Timestamp = {
  ClassMethods: {
    timestamps: function() {
      this.include(Tower.Model.Timestamp.CreatedAt);
      this.include(Tower.Model.Timestamp.UpdatedAt);
      this.field('createdAt', {
        type: 'Date'
      });
      this.field('updatedAt', {
        type: 'Date'
      });
      this.before('create', 'setCreatedAt');
      return this.before('save', 'setUpdatedAt');
    }
  },
  CreatedAt: {
    setCreatedAt: function() {
      return this.set('createdAt', new Date);
    }
  },
  UpdatedAt: {
    setUpdatedAt: function() {
      return this.set('updatedAt', new Date);
    }
  }
};

module.exports = Tower.Model.Timestamp;
