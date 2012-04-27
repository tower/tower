describeWith = (store) ->
  describe "Tower.Store.Batch (Tower.Store.#{store.className()})", ->
    record        = null
    batch   = null
    
    beforeEach (done) ->
      store.clean =>
        App.User.store(store)
        
        record  = new App.User(firstName: "James")
        record.set('batch', new Tower.Store.Batch)
        batch   = record.get('batch')
        
        done()
        
    test 'record.withBatch', (done) ->
      record.withBatch (t) =>
        assert.ok t instanceof Tower.Store.Batch, 'batch instanceof Tower.Store.Batch'
        
        done()
        
    test '#buckets', (done) ->
      buckets = batch.buckets
      assert.ok buckets, 'buckets'
      assert.ok batch.getBucket('clean'), 'buckets.clean'
      assert.ok batch.getBucket('created'), 'buckets.created'
      assert.ok batch.getBucket('updated'), 'buckets.updated'
      assert.ok batch.getBucket('deleted'), 'buckets.deleted'
      done()
      
    test '#addToBucket', (done) ->
      assert.ok !batch.getBucket('clean').get(record.constructor)
      
      batch.addToBucket('clean', record)
      
      assert.ok batch.getBucket('clean').get(record.constructor)
      
      done()
      
    describe 'with record in clean bucket', ->
      beforeEach (done) ->
        batch.addToBucket('clean', record)
        
        done()
    
      test '#removeFromBucket', (done) ->
        assert.isFalse batch.getBucket('clean').get(record.constructor).isEmpty()
      
        batch.removeFromBucket('clean', record)
        
        assert.isTrue batch.getBucket('clean').get(record.constructor).isEmpty()
        
        done()
      
      test '#recordBecameDirty("updated")', (done) ->
        batch.recordBecameDirty("updated", record)
        
        assert.isTrue batch.getBucket('clean').get(record.constructor).isEmpty()
        assert.isFalse batch.getBucket('updated').get(record.constructor).isEmpty()
        
        done()
        
      test '#recordBecameClean("clean")', (done) ->
        batch.recordBecameClean('clean', record)
        
        assert.isTrue batch.getBucket('clean').get(record.constructor).isEmpty()
        
        done()
        
      test '#adopt', (done) ->
        adopter = new Tower.Store.Batch
        adopter.adopt(record)
        
        assert.isTrue batch.getBucket('clean').get(record.constructor).isEmpty(), 'batch lost record'
        assert.isFalse adopter.getBucket('clean').get(record.constructor).isEmpty(), 'adopted batch'
        
        done()
      
describeWith(Tower.Store.Memory)