Tower.Model.Transactions =
  ClassMethods:
    transaction: (block) ->
      transaction = new Tower.Store.Transaction
      block.call @, transaction if block
      transaction
  
  InstanceMethods:    
    transaction: Ember.computed(->
      new Tower.Store.Transaction
    ).cacheable()

    use: (transaction) ->
      transaction.adopt(@)
      @
      
    save: ->
      @get('transaction').adopt(@)
      
      @_super arguments...
  
module.exports = Tower.Model.Transactions
