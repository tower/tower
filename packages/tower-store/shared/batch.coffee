# @todo
# This is what's sent to the server from the client in a batch/bulk update.
# /posts/batch
# perhaps even one global batch method that routes it to sub controllers:
# /batch
# [{method: "PUT", to: "/posts", id: "10", data: {"title": "A Post"}}]
class Tower.Store.Batch extends Tower.Class
  # By default the store will persist the data.
  #
  # If you set this to false, then you have full control
  # over when the data is finally committed to the database.
  autocommit: Tower.isServer

  # If bulk is true, and there are multiple records preparing, it
  # will try and group them into optimal batch database operations.
  bulk:       false

  init: ->
    @_super arguments...

    Ember.set @, 'buckets',
      clean:    Ember.Map.create()
      created:  Ember.Map.create()
      updated:  Ember.Map.create()
      deleted:  Ember.Map.create()

  removeCleanRecords: ->
    clean = @getBucket("clean")

    clean.forEach (type, records) =>
      records.forEach (record) =>
        @remove(record)

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
    oldTransaction = record.get('transaction')

    oldTransaction.removeFromBucket('clean', record) if oldTransaction

    @addToBucket 'clean', record

    record.set('transaction', @)

  # @private
  addToBucket: (kind, record) ->
    bucket    = Ember.get(Ember.get(@, 'buckets'), kind)
    type      = @getType(record)
    records   = bucket.get(type)

    unless records
      records = Ember.OrderedSet.create()
      bucket.set(type, records)

    records.add(record)

  # @private
  removeFromBucket: (kind, record) ->
    bucket    = @getBucket(kind)
    type      = @getType(record)
    records   = bucket.get(type)

    records.remove(record) if records

  getBucket: (kind) ->
    Ember.get(Ember.get(@, 'buckets'), kind)

  getType: (recordOrCursor) ->
    if recordOrCursor instanceof Tower.Model.Cursor
      recordOrCursor.getType()
    else
      recordOrCursor.constructor

  recordBecameClean: (kind, record) ->
    @removeFromBucket kind, record

    defaultTransaction = Ember.getPath(@, 'store.defaultTransaction')

    defaultTransaction.adopt(record) if defaultTransaction

  recordBecameDirty: (kind, record) ->
    @removeFromBucket 'clean', record
    @addToBucket kind, record

  commit: (callback) ->
    iterate = (bucketType, fn, binding) =>
      dirty = @getBucket(bucketType)

      dirty.forEach (type, records) ->
        return if records.isEmpty()
        array = []
        records.forEach (record) ->
          record.send("willCommit")
          array.push(record)

        fn.call(binding, type, array)

    commitDetails =
      updated:
        eachType: (fn, binding) ->
          iterate("updated", fn, binding)

      created:
        eachType: (fn, binding) ->
          iterate("created", fn, binding)

      deleted:
        eachType: (fn, binding) ->
          iterate("deleted", fn, binding)

    @removeCleanRecords()

    store   = Ember.get(@, "store")

    store.commit(commitDetails, callback)

module.exports = Tower.Store.Batch
