require '../../config'

scope     = null
criteria  = null
user      = null

describeWith = (store) ->
  describe "Tower.Model.Scope (Tower.Store.#{store.constructor.name})", ->
    beforeEach (done) ->
      App.User.store(store)
      scope = App.User.scoped()
      user = App.User.create(id: 1, firstName: "Lance")
      App.User.create(id: 2, firstName: "Dane")
      
      done()
    
    afterEach ->
      scope = null
    
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
  
    test 'named scopes', (done) ->
      App.User.create id: 3, firstName: "Baldwin", =>
        App.User.byBaldwin.first (error, user) =>
          assert.equal user.get("firstName"), "Baldwin"
          
          done()
          
    describe '#find', ->
      test '`1, 2, 3`', (done) ->
        sinon.spy scope.store(), "find"
        scope.find 1, 2, 3
        
        assert.equal scope.store.find.args[0], {id: $in: [1, 2, 3]}
        
        done()
      
      test '`[1, 2, 3]`', (done) ->
        sinon.spy scope.store(), "find"
        scope.find [1, 2, 3]
      
        assert.equal scope.store.find, {id: $in: [1, 2, 3]}
        
        done()
      
      test '`[1, 2, 3], callback`', (done) ->
        callback = ->
        
        sinon.spy scope.store(), "find"
        
        scope.find [1, 2, 3], callback
        
        assert.equal scope.store.find, {id: $in: [1, 2, 3]}
        
        done()
      
      #test 'where(id: $in: [1, 2, 3]).find(1) should only pass id: $in: [1]', ->
      #  spyOn scope.store, "find"
      #  scope.where(id: $in: [1, 2, 3]).find(1)
      #  
      #  assert.equal scope.store.find).toHaveBeenCalledWith {id: $in: [1]}, {  }, null
      
    describe '#update', ->
      beforeEach ->
        sinon.spy scope.store(), "update"
          
      test '`1, 2, 3`', (done) ->
        scope.update 1, 2, 3, {firstName: "Lance"}, instantiate: false
        
        assert.equal scope.store.update, { firstName : 'Lance' }, { id : { $in : [ 1, 2, 3 ] } }
      
      test '`[1, 2, 3]`', (done) ->
        scope.update 1, 2, 3, {firstName: "Lance"}, instantiate: false

        assert.equal scope.store.update).toHaveBeenCalledWith { firstName : 'Lance' }, { id : { $in : [ 1, 2, 3 ] } }, {  }, null 
      
    describe '#destroy', ->
      beforeEach ->
        spyOn scope.store, "destroy"
      
      test '`1, 2, 3`', (done) ->
        scope.destroy 1, 2, 3, instantiate: false
      
        assert.equal scope.store.destroy, { id : { $in : [ 1, 2, 3 ] } }
        
        done()
      
      test '`[1, 2, 3]`', (done) ->
        scope.destroy 1, 2, 3, instantiate: false
      
        assert.equal scope.store.destroy,  { id : { $in : [ 1, 2, 3 ] } }
        
        done()
      
      test 'query + ids', (done) ->
        scope.where(firstName: "John").destroy 1, 2, 3, instantiate: false
        
        assert.equal scope.store.destroy,  { firstName: "John", id : { $in : [ 1, 2, 3 ] } }
        
        done()
      
    describe '#create', ->
      test 'build(firstName: "Lance!")', (done) ->
        spyOn scope, "build"
        
        scope.create(firstName: "Lance!")
        
        assert.equal scope.build, { firstName: "Lance!" }
        
        done()
      
      test 'create(firstName: "Lantial")', ->
        spyOn scope.store, "create"
      
        scope.create(firstName: "Lantial")
        
        args = scope.store.create.argsForCall[0]
      
        assert.equal args[0].attributes, { id: undefined, firstName : 'Lantial', createdAt : new Date, updatedAt : new Date, likes : 0, tags : [  ], postIds : [  ] }
        assert.equal args[1], { instantiate: false }
      
      test 'create(firstName: "Lantial")', (done) ->
        scope.create(firstName: "Lantial")
        
        assert.equal App.User.count(), 3
        
        done()
      
    test '#clone', (done) ->
      clone = scope.where(firstName: "Lance")
      clone2 = clone.where(email: "example@gmail.com")
    
      assert.equal clone.criteria.conditions()).toNotEqual scope.criteria.query
      assert.equal clone2.criteria.conditions(), firstName: "Lance", email: "example@gmail.com"
      assert.equal clone.criteria.conditions(), firstName: "Lance"
      assert.equal scope.criteria.conditions(), {}
      
      done()

describeWith(new Tower.Store.Memory(firstName: "users", type: "App.User"))
describeWith(new Tower.Store.MongoDB(firstName: "users", type: "App.User"))
