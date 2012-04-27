describeWith = (store) ->
  describe "Tower.Store.Transaction (Tower.Store.#{store.className()})", ->
    record        = null
    transaction   = null
    
    beforeEach (done) ->
      store.clean =>
        App.User.store(store)
        
        record        = new App.User(firstName: "James")
        transaction   = record.get('transaction')#new Tower.Store.Transaction
        
        done()
        
    test 'record.withTransaction', (done) ->
      record.withTransaction (t) =>
        assert.ok t instanceof Tower.Store.Transaction, 'transaction instanceof Tower.Store.Transaction'
        
        done()
        
    test '#buckets', (done) ->
      buckets = transaction.buckets
      assert.ok buckets, 'buckets'
      assert.ok transaction.getBucket('clean'), 'buckets.clean'
      assert.ok transaction.getBucket('created'), 'buckets.created'
      assert.ok transaction.getBucket('updated'), 'buckets.updated'
      assert.ok transaction.getBucket('deleted'), 'buckets.deleted'
      done()
      
    test '#addToBucket', (done) ->
      assert.ok !transaction.getBucket('clean').get(record.constructor)
      
      transaction.addToBucket('clean', record)
      
      assert.ok transaction.getBucket('clean').get(record.constructor)
      
      done()
      
    describe 'with record in clean bucket', ->
      beforeEach (done) ->
        transaction.addToBucket('clean', record)
        
        done()
    
      test '#removeFromBucket', (done) ->
        assert.isFalse transaction.getBucket('clean').get(record.constructor).isEmpty()
      
        transaction.removeFromBucket('clean', record)
        
        assert.isTrue transaction.getBucket('clean').get(record.constructor).isEmpty()
        
        done()
      
      test '#recordBecameDirty("updated")', (done) ->
        transaction.recordBecameDirty("updated", record)
        
        assert.isTrue transaction.getBucket('clean').get(record.constructor).isEmpty()
        assert.isFalse transaction.getBucket('updated').get(record.constructor).isEmpty()
        
        done()
        
      test '#recordBecameClean("clean")', (done) ->
        transaction.recordBecameClean('clean', record)
        
        assert.isTrue transaction.getBucket('clean').get(record.constructor).isEmpty()
        
        done()
        
      test '#adopt', (done) ->
        adopter = new Tower.Store.Transaction
        adopter.adopt(record)
        
        assert.isTrue transaction.getBucket('clean').get(record.constructor).isEmpty(), 'transaction lost record'
        assert.isFalse adopter.getBucket('clean').get(record.constructor).isEmpty(), 'adopted transaction'
        
        done()
      
describeWith(Tower.Store.Memory)