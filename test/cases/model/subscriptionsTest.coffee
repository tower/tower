
describeWith = (store) ->
  describe "Tower.Model.Subscription (Tower.Store.#{store.className()})", ->
    beforeEach (done) ->
      store.clean =>
        App.User.store(store)
        done()
        
    describe 'chained scope subscription', ->
      beforeEach (done) ->
        App.User.create firstName: 'Lance', done
        
      test 'App.myArray', (done) ->
        App.subscribe 'myArray', -> App.User.all()
        assert.ok App.myArray instanceof Tower.Model.Cursor, 'App.myArray instanceof Tower.Model.Cursor'
        done()

describeWith(Tower.Store.Memory)
unless Tower.client
  describeWith(Tower.Store.MongoDB)