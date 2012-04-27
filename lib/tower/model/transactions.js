
Tower.Model.Transactions = {
  ClassMethods: {
    transaction: function(block) {
      var transaction;
      transaction = new Tower.Store.Transaction;
      if (block) {
        block.call(this, transaction);
      }
      return transaction;
    }
  },
  InstanceMethods: {
    transaction: Ember.computed(function() {
      return new Tower.Store.Transaction;
    }).cacheable(),
    use: function(transaction) {
      transaction.adopt(this);
      return this;
    },
    save: function() {
      this.get('transaction').adopt(this);
      return this._super.apply(this, arguments);
    }
  }
};

module.exports = Tower.Model.Transactions;
