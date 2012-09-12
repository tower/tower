# Places a record in a bucket by its `type`.
# Groups multiple atomic operations into one bulk operation.
class Tower.StoreTransaction extends Tower.Class
  @reopen
    init: ->
      # Ember.set @, 'records', Ember.Map.create()
      @records = []

    add: (record) ->
      @records.push(record)

    remove: (record) ->
      @records.splice(1, _.indexOf(@records, record))

    adopt: (record) ->
      transaction = record.get('transaction')
      unless transaction == @
        transaction.remove(record)
        @add(record)

    committed: ->
      records = @records

      for record in records
        record.committed()

    rollback: ->
      records = @records

      for record in records
        record.rollback()