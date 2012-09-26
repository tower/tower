var _;

_ = Tower._;

Tower.ModelTransactions = {
  ClassMethods: {
    transaction: function(block) {
      var transaction;
      transaction = new Tower.StoreTransaction;
      if (block) {
        block.call(this, transaction);
      }
      return transaction;
    }
  },
  InstanceMethods: {
    transaction: Ember.computed(function() {
      return new Tower.StoreTransaction;
    }).cacheable(),
    save: function() {
      this.get('transaction').adopt(this);
      return this._super.apply(this, arguments);
    }
  }
};

module.exports = Tower.ModelTransactions;
