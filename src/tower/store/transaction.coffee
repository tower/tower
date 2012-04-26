# Places a record in a bucket by its `type`.
# Groups multiple atomic operations into one bulk operation.
class Tower.Store.Transaction extends Tower.Class
  # By default the store will persist the data.
  # 
  # If you set this to false, then you have full control
  # over when the data is finally committed to the database.
  autocommit: true
  
  init: ->
    @_super arguments...
    
    Ember.set @, 'buckets',
      clean:    Ember.Map.create()
      created:  Ember.Map.create()
      updated:  Ember.Map.create()
      deleted:  Ember.Map.create()
      
  create: (record, callback) ->
    
    #@runCallbacks action, (block) =>
    #  complete  = @_callback(block, callback)

    #record.constructor.scoped(instantiate: false).create @, (error) =>
      #@persistent = true
      
  update: (record) ->
    #@constructor.scoped(instantiate: false).update @get('id'), updates, (error) =>
    #  throw error if error && !callback
    #
    #  unless error
    #    @persistent = true

  add: (record) ->
    # Tower.assert !Ember.get(record, 'isDirty'), 'store.transaction.dirty'

    #recordTransaction   = Ember.get(record, 'transaction')
    #defaultTransaction  = Ember.getPath(@, 'store.defaultTransaction')

    # Tower.assert recordTransaction != defaultTransaction, 'store.transaction.unique'

    @adopt record

  remove: (record) ->
    defaultTransaction = Ember.getPath(@, 'store.defaultTransaction')
    defaultTransaction.adopt(record)

  adopt: (record) ->
    oldTransaction = Ember.get(record, 'transaction')
    oldTransaction.removeFromBucket('clean', record) if oldTransaction

    @addToBucket 'clean', record

    Ember.set(record, 'transaction', @)

  recordBecameDirty: (kind, record) ->
    @removeFromBucket 'clean', record
    @addToBucket kind, record

  # @private
  addToBucket: (kind, record) ->
    bucket    = Ember.get(Ember.get(@, 'buckets'), kind)
    type      = record.constructor
    records   = bucket.get(type)
    
    unless records
      records = Ember.OrderedSet.create()
      bucket.set(type, records)
      
    records.add(record)

  # @private
  removeFromBucket: (kind, record) ->
    bucket    = Ember.get(Ember.get(@, 'buckets'), kind)
    type      = record.constructor
    records   = bucket.get(type)
    
    records.remove(record) if records

  recordBecameClean: (kind, record) ->
    @removeFromBucket kind, record

    defaultTransaction = Ember.getPath(@, 'store.defaultTransaction')
    
    defaultTransaction.adopt(record) if defaultTransaction