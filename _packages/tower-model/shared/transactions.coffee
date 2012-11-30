_ = Tower._

# @mixin
Tower.ModelTransactions =
  ClassMethods:
    transaction: (block) ->
      transaction = new Tower.StoreTransaction
      block.call @, transaction if block
      transaction

  InstanceMethods:
    transaction: Ember.computed(->
      new Tower.StoreTransaction
    ).cacheable()

    save: ->
      @get('transaction').adopt(@)

      @_super arguments...

module.exports = Tower.ModelTransactions
