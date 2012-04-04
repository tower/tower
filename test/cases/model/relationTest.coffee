require '../../config'

membership  = null
group       = null
user        = null

describeWith = (store) ->
  describe 'Tower.Model.Relation', ->
    beforeEach (done) ->
      async.series [
        (callback) =>
          store.clean(callback)
        (callback) =>
          # maybe the store should be global...
          App.Child.store(store)
          App.Parent.store(store)
          App.User.store(store)
          App.Membership.store(store)
          App.DependentMembership.store(store)
          App.Group.store(store)
          callback()
        (callback) =>
          App.User.create firstName: "Lance", id: 10, (error, record) =>
            user = record
            callback()
        (callback) =>
          App.Group.create id: 10, (error, record) =>
            group = record
            callback()
      ], done
      
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
          user.groups().create (error, group) =>
            #assert.equal group.get('id'), 2
            user.memberships().all (error, memberships) =>
              assert.equal memberships.length, 1
              record = memberships[0]
              assert.equal record.get('groupId').toString(), group.get('id').toString()
              assert.equal record.get('userId').toString(), user.get('id').toString()
              
              user.groups().all (error, groups) =>
                assert.equal groups.length, 1
              
                done()
  
        test 'create 2 models and 2 through models as Arguments', (done) ->
          user.groups().create {}, {}, (error, groups) =>
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
          App.Group.create =>
            App.Membership.create =>
              user.groups().create {name: "A"}, {name: "B"}, {name: "C"}, done
        
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


describeWith(Tower.Store.Memory)
describeWith(Tower.Store.MongoDB)