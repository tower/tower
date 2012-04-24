describeWith = (store) ->
  describe "Tower.Model.StateMachine (Tower.Store.#{store.className()})", ->
    record        = null
    stateMachine  = null
    
    beforeEach (done) ->
      store.clean =>
        App.User.store(store)
        
        record        = new App.User(firstName: "James")
        stateMachine  = record.get('stateMachine')
        
        done()
      
    test 'new, currentState', ->
      assert.ok stateMachine instanceof Tower.Model.StateMachine, "record.get('stateMachine') instanceof Tower.Model.StateMachine"
      
      assert.equal stateMachine.get('currentState').get('name'), 'empty'
      
    describe '#goToState', ->  
      test 'empty', ->
        assert.equal record.get('isDirty'), false
        assert.equal stateMachine.getPath('currentState.isLoaded'), false
        assert.equal stateMachine.getPath('currentState.isDirty'), false
        assert.equal stateMachine.getPath('currentState.isSaving'), false
        assert.equal stateMachine.getPath('currentState.isDeleted'), false
        assert.equal stateMachine.getPath('currentState.isError'), false
        assert.equal stateMachine.getPath('currentState.isNew'), false
        assert.equal stateMachine.getPath('currentState.isValid'), true
        assert.equal stateMachine.getPath('currentState.isPending'), false
        
      test 'loading', ->
        stateMachine.goToState('loading')
        assert.equal stateMachine.getPath('currentState.path'), 'rootState.loading'
        assert.equal stateMachine.getPath('currentState.isLoaded'), false
        assert.equal stateMachine.getPath('currentState.isDirty'), false
        assert.equal stateMachine.getPath('currentState.isSaving'), false
        assert.equal stateMachine.getPath('currentState.isDeleted'), false
        assert.equal stateMachine.getPath('currentState.isError'), false
        assert.equal stateMachine.getPath('currentState.isNew'), false
        assert.equal stateMachine.getPath('currentState.isValid'), true
        assert.equal stateMachine.getPath('currentState.isPending'), false
        stateMachine.goToState('loaded')
        
      test 'loaded', ->  
        stateMachine.goToState('loaded')
        assert.equal stateMachine.getPath('currentState.path'), 'rootState.loaded.saved'
        assert.equal stateMachine.getPath('currentState.isLoaded'), true
        assert.equal stateMachine.getPath('currentState.isDirty'), false
        assert.equal stateMachine.getPath('currentState.isSaving'), false
        assert.equal stateMachine.getPath('currentState.isDeleted'), false
        assert.equal stateMachine.getPath('currentState.isError'), false
        assert.equal stateMachine.getPath('currentState.isNew'), false
        assert.equal stateMachine.getPath('currentState.isValid'), true
        assert.equal stateMachine.getPath('currentState.isPending'), false
        stateMachine.goToState('deleted')
        
      test 'deleted', ->
        stateMachine.goToState('deleted')
        assert.equal stateMachine.getPath('currentState.path'), 'rootState.deleted.start'
        assert.equal stateMachine.getPath('currentState.isLoaded'), true, 'isLoaded'
        assert.equal stateMachine.getPath('currentState.isDirty'), true, 'isDirty'
        assert.equal stateMachine.getPath('currentState.isSaving'), false, 'isSaving'
        assert.equal stateMachine.getPath('currentState.isDeleted'), true, 'isDeleted'
        assert.equal stateMachine.getPath('currentState.isError'), false, 'isError'
        assert.equal stateMachine.getPath('currentState.isNew'), false, 'isNew'
        assert.equal stateMachine.getPath('currentState.isValid'), true, 'isValid'
        assert.equal stateMachine.getPath('currentState.isPending'), false, 'isPending'
      
    describe 'empty state', ->
      test '#loadingData', (done) ->
        stateMachine.send('loadingData')
        assert.equal stateMachine.getPath('currentState.path'), 'rootState.loading'
        done()
        
      test '#didChangeData', (done) ->
        stateMachine.send('didChangeData')
        assert.equal stateMachine.getPath('currentState.path'), 'rootState.loaded.updated.uncommitted'
        done()
        
    describe 'loaded state', ->
      beforeEach ->
        stateMachine.goToState('loaded')
        
      test 'enter', ->
        assert.equal stateMachine.getPath('currentState.path'), 'rootState.loaded.saved'
        assert.equal stateMachine.getPath('currentState.isLoaded'), true
        
      test '#setProperty', ->
        stateMachine.send 'setProperty', key: 'a key', value: 'a value'
        assert.equal stateMachine.getPath('currentState.path'), 'rootState.loaded.updated.uncommitted'
        assert.equal stateMachine.getPath('currentState.dirtyType'), 'updated'
        
        assert.equal record.get('isDirty'), true
        assert.equal record.get('isLoaded'), true
        
      describe '#willCommit', ->
        beforeEach ->
          stateMachine.send 'setProperty', key: 'a key', value: 'a value'
          stateMachine.send 'willCommit'
          
        test 'committing', ->
          assert.equal stateMachine.getPath('currentState.path'), 'rootState.loaded.updated.committing'
          
        test '#becameInvalid', ->
          assert.equal record.get('isValid'), true
          stateMachine.send 'becameInvalid', some: "error!"
          assert.equal stateMachine.getPath('currentState.path'), 'rootState.loaded.updated.invalid'
          assert.equal record.get('isValid'), false
          
        test 'committing then #willCommit', ->
          stateMachine.send 'willCommit'
          
          # trying it this way first, to handle node's async callbacks.
          assert.equal stateMachine.getPath('currentState.path'), 'rootState.loaded.updated.committing.before'
          
          stateMachine.send 'didBeforeCommit'
          
          assert.equal stateMachine.getPath('currentState.path'), 'rootState.loaded.updated.committing.inFlight'
          
          stateMachine.send 'didCommit'
          
          assert.equal stateMachine.getPath('currentState.path'), 'rootState.loaded.updated.committing.after'
          
          stateMachine.send 'didAfterCommit'
          
          assert.equal stateMachine.getPath('currentState.path'), 'rootState.loaded.saved'
        
        test 'saveWithState', (done) ->
          record.saveWithState =>
            console.log "DONE!"
            done()

describeWith(Tower.Store.Memory)