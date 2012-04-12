scope     = null
criteria  = null
user      = null

describeWith = (store) ->
  describe "Tower.Model.Scope (Tower.Store.#{store.name})", ->
    beforeEach (done) ->
      async.series [
        (callback) => store.clean(callback)
        (callback) =>
          App.User.store(store)
          App.Admin.store(store)
          callback()
        (callback) => 
          App.User.create id: 1, firstName: "Lance", callback
        (callback) =>
          App.User.create id: 2, firstName: "Dane", callback
      ], done
    
    test 'where(firstName: "Lance")', (done) ->
      App.User.where(firstName: "Lance").first (error, user) =>
        assert.equal user.get("firstName"), "Lance"
        
        done()

    test 'where(firstName: "=~": "c")', (done) ->
      App.User.where(firstName: "=~": "c").all (error, users) =>
        assert.equal users.length, 1
        assert.equal users[0].get("firstName"), "Lance"
        
        done()
    
    test 'where(firstName: "=~": "a").order("firstName")', (done) ->
      App.User.where(firstName: "=~": "a").order("firstName").all (error, users) =>
        assert.equal users.length, 2
        assert.equal users[0].get("firstName"), "Dane"
        
        done()

    test 'where(firstName: "=~": "a").order("firstName", "desc")', (done) ->
      App.User.where(firstName: "=~": "a").order("firstName", "desc").all (error, users) =>
        assert.equal users.length, 2
        assert.equal users[0].get("firstName"), "Lance"
        
        done()
    
    describe 'named scopes', ->
      beforeEach (done) ->
        async.series [
          (next) =>
            App.User.create firstName: "Baldwin", likes: 10, next
          (next) =>
            App.Admin.create firstName: "An Admin", likes: 20, next
          (next) =>
            App.Admin.create firstName: "An Admin without likes", likes: 0, next
        ], done
    
      test 'named scopes', (done) ->
        App.User.byBaldwin().all (error, users) =>
          assert.equal users.length, 1
          assert.equal users[0].get("firstName"), "Baldwin"
        
          done()
            
      test 'subclasses and named scopes', (done) ->
        App.Admin.subclassNamedScope().all (error, users) =>
          assert.equal users.length, 1
          assert.equal users[0].get("type"), "Admin"

          done()
          
describeWith(Tower.Store.Memory)
#describeWith(Tower.Store.MongoDB)
