require '../../config'

membership  = null
group       = null
user        = null

__destroyAll = (done) ->
  async.series [
    (callback) => App.Child.destroy(callback)
    (callback) => App.Parent.destroy(callback)
    (callback) => App.DependentMembership.destroy(callback)
    (callback) => App.Membership.destroy(callback)
    (callback) => App.Group.destroy(callback)
    (callback) => App.User.destroy(callback)
    (callback) => App.User.create firstName: "Lance", id: 10, (error, record) =>
      user = record
      callback()
    (callback) => App.Group.create id: 10, (error, record) =>
      group = record
      callback()
  ], done

describeWith = (store) ->
  describe 'Tower.Model.Relation', ->
    beforeEach (done) ->
      App.Child.store(new store(name: "child", type: "App.Child"))
      App.Parent.store(new store(name: "parents", type: "App.Parent"))
      App.User.store(store)
      App.Membership.store(store)
      App.DependentMembership.store(store)
      App.Group.store(store)
      __destroyAll(done)
      
    afterEach ->
      try App.Parent.create.restore()
      try App.Group.create.restore()
      try App.Membership.create.restore()
    
    describe 'inverseOf', ->
      test 'noInverse_noInverse', ->
        assert.notEqual "noInverse_noInverse", try App.Parent.relation("noInverse_noInverse").inverse().name
        
      test 'parent: noInverse_withInverse, child: withInverse_noInverse', ->
        assert.equal "withInverse_noInverse", App.Parent.relation("noInverse_withInverse").inverse().name
        
      test 'withInverse_withInverse', ->
        assert.equal "withInverse_withInverse", App.Parent.relation("withInverse_withInverse").inverse().name
        
      test 'parent: withInverse_noInverse, child: noInverse_withInverse', ->
        assert.equal "noInverse_withInverse", App.Parent.relation("withInverse_noInverse").inverse().name

    describe 'HasMany', ->
      beforeEach (done) ->
        __destroyAll(done)
        
      describe '.create', ->
        test 'compileForCreate', ->
          criteria = user.memberships().criteria
          criteria.compileForCreate()
          
          assert.deepEqual criteria.conditions(), { userId: 10 }
          
        test 'compileForCreate with cache: true', ->
          criteria = user.cachedMemberships().criteria
          criteria.compileForCreate()

          assert.deepEqual criteria.conditions(), { userId: 10 }
          
        test 'compileForCreate on polymorphic record', ->
          criteria = user.polymorphicMemberships().criteria
          criteria.compileForCreate()
          
          assert.deepEqual criteria.conditions(), { joinableId: 10, joinableType: "User" }
          
        test 'create relationship model', (done) ->
          user.memberships().create groupId: group.get('id'), (error, membership) =>
            assert.equal membership.get('userId').toString(), user.get('id').toString()
            assert.equal membership.get('groupId').toString(), group.get('id').toString()
            done()
            
        #test 'create through model automatically', (done) ->
        #  sinon.spy App.Group.store(), "create"
        #  sinon.spy App.Membership.store(), "create"
        #  
        #  user.groups().create (error, group) =>
        #    #console.log App.Membership.store().create
        #    done()
      
      describe '.update', ->
        beforeEach (done) ->
          App.Membership.create groupId: group.get('id'), =>
            user.memberships().create groupId: group.get('id'), done
        
        test 'compileForUpdate', ->
          criteria = user.memberships().criteria
          criteria.compileForUpdate()
          
          assert.deepEqual criteria.conditions(), { userId: 10 }
          
        test 'update relationship model', (done) ->
          user.memberships().update kind: "guest", (error, memberships) =>
            assert.equal memberships.length, 1
            assert.equal memberships[0].get('kind'), 'guest'
            App.Membership.count (error, count) =>
              assert.equal count, 2
              done()
      
      describe '.destroy', ->
        beforeEach (done) ->
          App.Membership.create groupId: group.get('id'), =>
            user.memberships().create groupId: group.get('id'), done
            
        test 'compileForDestroy', ->
          criteria = user.memberships().criteria
          criteria.compileForDestroy()

          assert.deepEqual criteria.conditions(), { userId: 10 }
          
        test 'destroy relationship model', (done) ->
          user.memberships().destroy (error, memberships) =>
            assert.equal memberships.length, 1
            App.Membership.count (error, count) =>
              # since there were 2, but only one belonged to user
              assert.equal count, 1
              done()
              
        #test 'destroy relationship model if parent is destroyed (dependent: true)', (done) ->
        #  App.User.create firstName: "Lance", (error, user) =>
        #    user.dependentMemberships().create =>
        #      user.destroy =>
        #        App.DependentMembership.count (error, count) =>
        #          assert.equal count, 0
        #          done()

    describe 'HasMany(through: true)', ->
      beforeEach (done) ->
        __destroyAll(done)

      describe '.create', ->
        # don't want it to have any data b/c all that data is stored on the relationship model.
        test 'compileForCreate', ->
          criteria = user.groups().criteria
          criteria.compileForCreate()
          
          assert.deepEqual criteria.conditions(), { }
          
        test 'throughRelation', ->
          criteria        = user.groups().criteria
          relation        = criteria.relation
          throughRelation = criteria.throughRelation
          
          assert.equal throughRelation.type, "Membership"
          assert.equal throughRelation.targetType, "Membership"
          assert.equal throughRelation.name, "memberships"
          assert.equal throughRelation.ownerType, "App.User"
          assert.equal throughRelation.foreignKey, "userId"
          
          inverseRelation = relation.inverseThrough(throughRelation)
          
          assert.equal inverseRelation.name, "group"
          assert.equal inverseRelation.type, "Group"
          assert.equal inverseRelation.foreignKey, "groupId"
          
        test 'createThroughRelation', (done) ->
          criteria        = user.groups().criteria
          
          criteria.createThroughRelation group, (error, record) =>
            assert.equal record.constructor.name, "Membership"
            assert.equal record.get('groupId').toString(), group.get('id').toString()
            assert.equal record.get('userId').toString(), user.get('id').toString()
            done()

        test 'all together now, create through model', (done) ->
          user.groups().create id: 2, (error, group) =>
            assert.equal group.get('id'), 2
            user.memberships().all (error, memberships) =>
              assert.equal memberships.length, 1
              record = memberships[0]
              assert.equal record.get('groupId').toString(), group.get('id').toString()
              assert.equal record.get('userId').toString(), user.get('id').toString()
              
              user.groups().all (error, groups) =>
                assert.equal groups.length, 1
              
                done()
  
        test 'create 2 models and 2 through models as Arguments', (done) ->
          user.groups().create {id: 2}, {id: 3}, (error, groups) =>
            assert.equal groups.length, 2
            
            App.Group.count (error, count) =>
              assert.equal count, 3
              
              user.memberships().count (error, count) =>
                assert.equal count, 2
              
                user.groups().count (error, count) =>
                  assert.equal count, 2
                
                  done()

      describe '.update', ->
        beforeEach (done) ->
          user.groups().create {name: "Starbucks", id: 2}, {id: 3}, done
        
        test 'update all groups', (done) ->
          user.groups().update name: "Peet's", =>
            user.groups().all (error, groups) =>
              assert.equal groups.length, 2
              for group in groups
                assert.equal group.get('name'), "Peet's"
              done()
              
        test 'update matching groups', (done) ->
          user.groups().where(name: "Starbucks").update name: "Peet's", =>
            user.groups().where(name: "Peet's").count (error, count) =>
              assert.equal count, 1
              user.memberships().count (error, count) =>
                assert.equal count, 2
                done()
      
      describe '.destroy', ->
        beforeEach (done) ->
          user.groups().create {name: "Starbucks", id: 2}, {id: 3}, done
        
        test 'destroy all groups', (done) ->
          user.groups().destroy =>
            user.groups().count (error, count) =>
              assert.equal count, 0
              done()
        
        #describe 'through relation has dependent: "destroy"', ->
        #  test 'destroy all through relations', (done) ->
        #    user.groups().destroy =>
        #      user.memberships().count (error, count) =>
        #        assert.equal count, 0
        #        done()
      
      describe '.find', ->
        beforeEach (done) ->
          App.Group.create id: 100, =>
            App.Membership.create id: 200, =>
              user.memberships().create id: 10, groupId: group.get('id'), done
          
        test 'appendThroughConditions', (done) ->
          criteria        = user.groups().criteria
          
          assert.deepEqual criteria.conditions(), { }
          
          criteria.appendThroughConditions =>
            assert.deepEqual criteria.conditions(), { id: $in: [10] }
            done()

      describe 'finders', ->
        beforeEach (done) ->
          App.Group.create id: 100, =>
            App.Membership.create id: 200, =>
              user.groups().create {id: 20, name: "A"}, {id: 30, name: "B"}, {id: 40, name: "C"}, done
        
        describe 'relation (groups)', ->
          test 'all', (done) ->
            user.groups().all (error, records) =>
              assert.equal records.length, 3
              done()

          test 'first', (done) ->
            user.groups().desc("name").first (error, record) =>
              assert.equal record.get('name'), "C"
              done()

          test 'last', (done) ->
            user.groups().desc("name").last (error, record) =>
              assert.equal record.get('name'), "A"
              done()

          test 'count', (done) ->
            user.groups().count (error, count) =>
              assert.equal count, 3
              done()

          test 'exists', (done) ->
            user.groups().exists (error, value) =>
              assert.equal value, true
              done()
              
        describe 'through relation (memberships)', ->
          test 'all', (done) ->
            user.memberships().all (error, records) =>
              assert.equal records.length, 3
              done()

          test 'first', (done) ->
            user.memberships().first (error, record) =>
              assert.ok record
              done()

          test 'last', (done) ->
            user.memberships().last (error, record) =>
              assert.ok record
              done()

          test 'count', (done) ->
            user.memberships().count (error, count) =>
              assert.equal count, 3
              done()

          test 'exists', (done) ->
            user.memberships().exists (error, value) =>
              assert.equal value, true
              done()

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
describeWith(Tower.Store.MongoDB)