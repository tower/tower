var _;

_ = Tower._;

Tower.ModelSoftDelete = {
  ClassMethods: {
    included: function() {
      this.field('deletedAt', {
        type: 'Date'
      });
      this.defaultScope(this.where({
        deleted_at: null
      }));
      return this.scope('deleted', this.ne({
        deleted_at: null
      }));
    }
  },
  hardDestroy: function() {},
  destroy: function(callback) {
    var _this = this;
    return this.updateAttribute('deletedAt', _.now(), function() {
      _this.set('isDestroyed', true);
      return callback.apply(null, arguments);
    });
  },
  restore: function(callback) {
    return this.updateAttribute('deletedAt', null, callback);
  }
};

module.exports = Tower.ModelSoftDelete;
