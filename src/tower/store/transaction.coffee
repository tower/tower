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
    
    Ember.set @, "buckets",
      clean:    Ember.Map.create()
      created:  Ember.Map.create()
      updated:  Ember.Map.create()
      deleted:  Ember.Map.create()
      
  recordBecameDirty: ->
    
  recordBecameClean: ->