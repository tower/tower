require '../../config'

membership  = null
group       = null
user        = null

describeWith = (store) ->
  describe 'Tower.Model.Relation', ->
    beforeEach (done) ->
      App.Child.store(new store(name: "child", type: "App.Child"))
      App.Parent.store(new store(name: "parents", type: "App.Parent"))
      App.User.store(store)
      App.Membership.store(store)
      App.Group.store(store)
      async.parallel [
        (callback) => App.Child.destroy(callback)
        (callback) => App.Parent.destroy(callback)
      ], done
      
    afterEach ->
      try App.Parent.create.restore()
    
    #describe 'inverseOf', ->
    #  test 'noInverse_noInverse', ->
    #    assert.notEqual "noInverse_noInverse", try App.Parent.relation("noInverse_noInverse").inverse().name
    #    
    #  test 'parent: noInverse_withInverse, child: withInverse_noInverse', ->
    #    assert.equal "withInverse_noInverse", App.Parent.relation("noInverse_withInverse").inverse().name
    #    
    #  test 'withInverse_withInverse', ->
    #    assert.equal "withInverse_withInverse", App.Parent.relation("withInverse_withInverse").inverse().name
    #    
    #  test 'parent: withInverse_noInverse, child: noInverse_withInverse', ->
    #    assert.equal "noInverse_withInverse", App.Parent.relation("withInverse_noInverse").inverse().name
    #    
    describe 'HasMany', ->
      beforeEach (done) ->
        App.Membership.destroy =>
          App.User.destroy =>
            App.Group.destroy =>
              App.User.create firstName: "Lance", id: 10, (error, record) =>
                user = record
                App.Group.create id: 10, (error, record) =>
                  group = record
                  done()
            
      describe '.create', ->
        #test 'create relationship model', (done) ->
        #  user.memberships().create groupId: group.get('id'), (error, membership) =>
        #    assert.equal membership.get('userId').toString(), user.get('id').toString()
        #    assert.equal membership.get('groupId').toString(), group.get('id').toString()
        #    done()
            
        test 'create through model automatically', (done) ->
          user.groups().create (error, group) =>
            console.log group
            done()
      
      describe '.update', ->
      
      describe '.destroy', ->
      
    #describe 'HasMany(through: true)', ->
    #  describe '.create', ->
    #  
    #  describe '.update', ->
    #  
    #  describe '.destroy', ->
    #
    #describe 'HasAndBelongs', ->
    #  test 'defaults to blank array', (done) ->
    #    sinon.spy App.Parent, "create"
    #    
    #    App.Parent.create id: 1, (error, parent) =>
    #      assert.deepEqual {id: 1}, App.Parent.create.getCall(0).args[0]
    #      
    #      parent.child().all (error, children) =>
    #        assert.deepEqual children, []
    #      
    #        done()
    #
    #  test 'create from parent', (done) ->
    #    App.Parent.create id: 1, (error, parent) =>
    #      parent.child().create id: 10, (error, child) =>
    #        # this used to be b/c cache: true
    #        # assert.deepEqual child.parentIds, [1]
    #        assert.equal child.get('parentId'), 1
    #        # same, update models that are still in memory in a normalized way!
    #        App.Parent.find 1, (error, parent) =>
    #          assert.deepEqual parent.childIds, [10]
    #          assert.equal parent.get('id'), 1
    #          
    #          parent.child().create id: 9, (error, child) =>
    #            App.Parent.find 1, (error, parent) =>
    #              assert.deepEqual parent.get("childIds"), [10, 9]
    #              
    #              done()
    #
      #test 'create from child', (done) ->    
      #  App.Parent.create id: 1, (error, parent) =>
      #    parent.child().create id: 10, =>
      #      parent.child().create id: 9, (error, child) =>
      #        child.parents().create id: 20, =>
      #          # need to update the record in memory as well for mongodb!
      #          App.Child.find 9, (error, child) =>
      #            # assert.deepEqual child.parentIds, [1, 20]
      #          
      #            # assert.equal child.get("parentCount"), 2
      #            # assert.deepEqual child.parents().toQuery().conditions, { childIds: { $in: [9] } }
      #            
      #            child.parents().count (error, count) =>
      #              assert.equal count, 2
      #      
      #              App.Parent.first (error, parent) =>
      #                parent.child().count (error, count) =>
      #                  assert.equal count, 2
      #    
      #                  done()

describeWith(Tower.Store.Memory)
#describeWith(Tower.Store.MongoDB)