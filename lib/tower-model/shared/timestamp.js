var _;

_ = Tower._;

Tower.ModelTimestamp = {
  ClassMethods: {
    timestamps: function() {
      this.field('createdAt', {
        type: 'Date'
      });
      this.field('updatedAt', {
        type: 'Date'
      });
      this.before('create', 'setCreatedAt');
      this.before('save', 'setUpdatedAt');
      return this.include({
        setCreatedAt: function() {
          return this.set('createdAt', new Date);
        },
        setUpdatedAt: function() {
          return this.set('updatedAt', new Date);
        }
      });
    }
  }
};

module.exports = Tower.ModelTimestamp;
