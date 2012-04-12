require '../../config'

user      = null

describeWith = (store) ->
  describe "Tower.Model.Indexing (Tower.Store.#{store.name})", ->
    beforeEach (done) ->
      store.clean =>
        App.Project.store(store)
        done()
        
    test '.index()', (done) ->
      indexes = App.Project.indexes()
      
      assert.ok indexes.hasOwnProperty('titleIndexedWithMethod')
      
      done()
      
    test 'index: true', (done) ->
      indexes = App.Project.indexes()
      
      assert.ok indexes.hasOwnProperty('titleIndexedWithOption')
      
      done()
        
#describeWith(Tower.Store.MongoDB)
describeWith(Tower.Store.Memory)
