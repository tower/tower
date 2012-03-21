require '../../config'

describeWith = (store) ->
  describe 'Tower.Model.Relation', ->
    beforeEach (done) ->
      App.Child.store(new store(name: "child", type: "App.Child"))
      App.Parent.store(new store(name: "parents", type: "App.Parent"))
      async.parallel [
        (callback) => App.Child.destroy(callback)
        (callback) => App.Parent.destroy(callback)
      ], done
      
    afterEach ->
      try App.Parent.create.restore()
    
    describe 'inverseOf', ->
      test 'noInverse_noInverse', ->
        assert.notEqual "noInverse_noInverse", App.Parent.relation("noInverse_noInverse").inverse().name
        
      test 'parent: noInverse_withInverse, child: withInverse_noInverse', ->
        assert.equal "withInverse_noInverse", App.Parent.relation("noInverse_withInverse").inverse().name
        
      test 'withInverse_withInverse', ->
        assert.equal "withInverse_withInverse", App.Parent.relation("withInverse_withInverse").inverse().name
        
      test 'parent: withInverse_noInverse, child: noInverse_withInverse', ->
        assert.equal "noInverse_withInverse", App.Parent.relation("withInverse_noInverse").inverse().name
    
    describe 'HasAndBelongsToMany', ->
      test 'defaults to blank array', (done) ->
        sinon.spy App.Parent, "create"
        
        App.Parent.create id: 1, (error, parent) =>
          assert.deepEqual {id: 1}, App.Parent.create.getCall(0).args[0]
          
          parent.child().all (error, children) =>
            assert.deepEqual children, []
          
            done()
      
      test 'create from parent', (done) ->
        App.Parent.create id: 1, (error, parent) =>
          parent.child().create id: 10, (error, child) =>
            assert.deepEqual child.parentIds, [1]
            # same, update models that are still in memory in a normalized way!
            App.Parent.find 1, (error, parent) =>
              assert.deepEqual parent.childIds, [10]
            
              parent.child().create id: 9, (error, child) =>
                App.Parent.find 1, (error, parent) =>
                  assert.deepEqual parent.get("childIds"), [10, 9]
                
                  done()
      
      test 'create from child', (done) ->    
        parent  = App.Parent.create(id: 1)
        parent.child().create(id: 10)
        child   = parent.child().create(id: 9)
        
        child.parents().create(id: 20)
        # need to update the record in memory as well for mongodb!
        App.Child.find 9, (error, child) =>
          assert.deepEqual child.parentIds, [1, 20]
          
          assert.equal child.get("parentCount"), 2
          assert.deepEqual child.parents().toQuery().conditions, { childIds: { $in: [9] } }
          
          child.parents().count (error, count) =>
            assert.equal count, 2
            
            App.Parent.first (error, parent) =>
              assert.deepEqual parent.child().toQuery().conditions, { parentIds: { $in: [1] } }
              
              parent.child().count (error, count) =>
                assert.equal count, 2
          
                done()

describeWith(Tower.Store.Memory)
describeWith(Tower.Store.MongoDB)