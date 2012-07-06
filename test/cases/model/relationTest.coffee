membership  = null
group       = null
user        = null

describeWith = (store) ->
  describe "Tower.Model.Relation (Tower.Store.#{store.className()})", ->
    beforeEach (done) ->
      async.series [
        (callback) =>
          store.clean(callback)
        (callback) =>
          # maybe the store should be global..
          App.Child.store(store)
          App.Parent.store(store)
          App.User.store(store)
          App.Membership.store(store)
          App.DependentMembership.store(store)
          App.Group.store(store)
          callback()
        (callback) =>
          App.User.create firstName: "Lance", (error, record) =>
            user = record
            callback()
        (callback) =>
          App.Group.create (error, record) =>
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
        test 'compileForInsert', ->
          cursor = user.get('memberships').cursor
          cursor.compileForInsert()
          assert.deepEqual cursor.conditions(), { userId: user.get('id') }

        test 'compileForInsert with cache: true', ->
          cursor = user.get('cachedMemberships').cursor
          cursor.compileForInsert()

          assert.deepEqual cursor.conditions(), { userId: user.get('id') }

        test 'compileForInsert on polymorphic record', ->
          cursor = user.get('polymorphicMemberships').cursor
          cursor.compileForInsert()
          
          assert.deepEqual cursor.conditions(), { joinableId: user.get('id'), joinableType: "User" }
          
        test 'insert relationship model', (done) ->
          user.get('memberships').create groupId: group.get('id'), (error, membership) =>
            assert.equal membership.get('userId').toString(), user.get('id').toString()
            assert.equal membership.get('groupId').toString(), group.get('id').toString()
            done()

        #test 'insert through model automatically', (done) ->
        #  sinon.spy App.Group.store(), "insert"
        #  sinon.spy App.Membership.store(), "insert"
        #  
        #  user.get('groups').create (error, group) =>
        #    #console.log App.Membership.store().create
        #    done()
      
      describe '.update', ->
        beforeEach (done) ->
          App.Membership.create groupId: group.get('id'), =>
            user.get('memberships').create groupId: group.get('id'), done
        
        test 'compileForUpdate', ->
          cursor = user.get('memberships').cursor
          cursor.compileForUpdate()
          
          assert.deepEqual cursor.conditions(), { userId: user.get('id') }

        test 'update relationship model', (done) ->
          user.get('memberships').update kind: "guest", (error, memberships) =>
            assert.equal memberships.length, 1
            assert.equal memberships[0].get('kind'), 'guest'
            App.Membership.count (error, count) =>
              assert.equal count, 2

              done()
      
      describe '.destroy', ->
        beforeEach (done) ->
          App.Membership.create groupId: group.get('id'), =>
            user.get('memberships').create groupId: group.get('id'), done
            
        test 'compileForDestroy', ->
          cursor = user.get('memberships').cursor
          cursor.compileForDestroy()

          assert.deepEqual cursor.conditions(), { userId: user.get('id') }
          
        test 'destroy relationship model', (done) ->
          user.get('memberships').destroy (error, memberships) =>
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
        test 'compileForInsert', ->
          cursor = user.get('groups').cursor
          cursor.compileForInsert()

          assert.deepEqual cursor.conditions(), { }

        test 'throughRelation', ->
          cursor        = user.get('groups').cursor
          relation        = cursor.relation
          throughRelation = cursor.throughRelation
          
          assert.equal throughRelation.type, "App.Membership"
          assert.equal throughRelation.targetType, "App.Membership"
          assert.equal throughRelation.name, "memberships"
          assert.equal throughRelation.ownerType, "App.User"
          assert.equal throughRelation.foreignKey, "userId"
          
          inverseRelation = relation.inverseThrough(throughRelation)
          assert.equal inverseRelation.name, "group"
          assert.equal inverseRelation.type, "App.Group"
          assert.equal inverseRelation.foreignKey, "groupId"
          
        test 'insertThroughRelation', (done) ->
          cursor        = user.get('groups').cursor
          
          cursor.insertThroughRelation group, (error, record) =>
            assert.equal record.constructor.className(), "Membership"
            assert.equal record.get('groupId').toString(), group.get('id').toString()
            assert.equal record.get('userId').toString(), user.get('id').toString()
            done()

        test 'all together now, insert through model', (done) ->
          user.get('groups').create (error, group) =>
            assert.ok user.get('memberships').all() instanceof Array, 'user.memberships.all instanceof Array'
            assert.ok user.get('memberships').all().isCursor, 'user.memberships.all.isCursor'
            assert.ok user.get('memberships').all().isHasMany, 'user.memberships.all.isHasManyThrough'

            user.get('memberships').all (error, memberships) =>
              assert.equal memberships.length, 1
              record = memberships[0]
              assert.equal record.get('groupId').toString(), group.get('id').toString()
              assert.equal record.get('userId').toString(), user.get('id').toString()
              
              user.get('groups').all (error, groups) =>
                assert.equal groups.length, 1
              
                done()
  
        test 'insert 2 models and 2 through models as Arguments', (done) ->
          assert.isTrue user.get('groups').all().isHasManyThrough, 'user.groups.isHasManyThrough'

          user.get('groups').create {}, {}, (error, groups) =>
            assert.equal groups.length, 2
            
            App.Group.count (error, count) =>
              assert.equal count, 3
              
              user.get('memberships').count (error, count) =>
                assert.equal count, 2
              
                user.get('groups').count (error, count) =>
                  assert.equal count, 2
                
                  done()

      describe '.update', ->
        beforeEach (done) ->
          user.get('groups').create {name: "Starbucks"}, {}, done
        
        test 'update all groups', (done) ->
          user.get('groups').update name: "Peet's", =>
            user.get('groups').all (error, groups) =>
              assert.equal groups.length, 2
              for group in groups
                assert.equal group.get('name'), "Peet's"
              done()
              
        test 'update matching groups', (done) ->
          user.get('groups').where(name: "Starbucks").update name: "Peet's", =>
            user.get('groups').where(name: "Peet's").count (error, count) =>
              assert.equal count, 1
              user.get('memberships').count (error, count) =>
                assert.equal count, 2
                done()
      
      describe '.destroy', ->
        beforeEach (done) ->
          user.get('groups').create {name: "Starbucks"}, {}, done
        
        test 'destroy all groups', (done) ->
          user.get('groups').destroy =>
            user.get('groups').count (error, count) =>
              assert.equal count, 0
              done()
        
        #describe 'through relation has dependent: "destroy"', ->
        #  test 'destroy all through relations', (done) ->
        #    user.get('groups').destroy =>
        #      user.get('memberships').count (error, count) =>
        #        assert.equal count, 0
        #        done()

      describe '.find', ->
        beforeEach (done) ->
          App.Group.create =>
            App.Membership.create =>
              user.get('memberships').create groupId: group.get('id'), (error, record) =>
                membership = record
                done()
          
        test 'appendThroughConditions', (done) ->
          cursor        = user.get('groups').cursor
          
          assert.deepEqual cursor.conditions(), { }
          
          cursor.appendThroughConditions =>
            assert.deepEqual cursor.conditions(), { id: $in: [group.get('id')] }
            done()

      describe 'finders', ->
        beforeEach (done) ->
          App.Group.create =>
            App.Membership.create =>
              user.get('groups').create {name: "A"}, {name: "B"}, {name: "C"}, done
        
        describe 'relation (groups)', ->
          test 'all', (done) ->
            user.get('groups').all (error, records) =>
              assert.equal records.length, 3
              done()

          test 'first', (done) ->
            user.get('groups').desc("name").first (error, record) =>
              assert.equal record.get('name'), "C"
              done()

          test 'last', (done) ->
            user.get('groups').desc("name").last (error, record) =>
              assert.equal record.get('name'), "A"
              done()

          test 'count', (done) ->
            user.get('groups').count (error, count) =>
              assert.equal count, 3
              done()

          test 'exists', (done) ->
            user.get('groups').exists (error, value) =>
              assert.equal value, true
              done()
              
        describe 'through relation (memberships)', ->
          test 'all', (done) ->
            user.get('memberships').all (error, records) =>
              assert.equal records.length, 3
              done()

          test 'first', (done) ->
            user.get('memberships').first (error, record) =>
              assert.ok record
              done()

          test 'last', (done) ->
            user.get('memberships').last (error, record) =>
              assert.ok record
              done()

          test 'count', (done) ->
            user.get('memberships').count (error, count) =>
              assert.equal count, 3
              done()

          test 'exists', (done) ->
            user.get('memberships').exists (error, value) =>
              assert.equal value, true
              done()
    
    describe 'hasMany with idCache', ->
      parent      = null
      
      beforeEach (done) ->
        async.series [
          (next) => App.Parent.create (error, record) =>
            parent = record
            next()
        ], done
        
      describe 'Parent.idCacheTrue_idCacheFalse', ->
        cursor  = null
        relation  = null
        
        beforeEach ->
          relation = App.Parent.relations().idCacheTrue_idCacheFalse
          cursor = parent.get('idCacheTrue_idCacheFalse').cursor
          
        test 'relation', ->
          assert.equal relation.idCache, true
          assert.equal relation.idCacheKey, "idCacheTrue_idCacheFalse" + "Ids"
          
        test 'default for idCacheKey should be array', ->
          assert.ok _.isArray App.Parent.fields()[relation.idCacheKey]._default
          
        test 'compileForInsert', (done) ->
          cursor.compileForInsert()
          
          assert.deepEqual cursor.conditions(), { parentId: parent.get('id') }
          
          done()

        test 'updateOwnerRecord', ->
          assert.equal cursor.updateOwnerRecord(), true
          
        test 'ownerAttributes', (done) ->
          child = new App.Child(id: 20)
          
          assert.deepEqual cursor.ownerAttributes(child), { '$add': { idCacheTrue_idCacheFalseIds: child.get('id') } }
          
          done()
          
        describe 'persistence', ->
          child   = null
          child2  = null
          child3  = null
          
          beforeEach (done) ->
            async.series [
              (next) =>
                parent.get('idCacheTrue_idCacheFalse').create (error, record) =>
                  child = record
                  next()
              (next) =>
                parent.get('idCacheTrue_idCacheFalse').create (error, record) =>
                  child2 = record
                  next()
              (next) =>
                # insert one without a parent at all
                App.Child.create (error, record) =>
                  child3 = record
                  next()
              (next) =>
                App.Parent.find parent.get('id'), (error, record) =>
                  parent = record
                  next()
            ], done
        
          test 'insert', (done) ->
            assert.equal child.get('parentId').toString(), parent.get('id').toString()
            assert.deepEqual parent.get(relation.idCacheKey), [child.get('id'), child2.get('id')]
            done()
            
          test 'update(1)', (done) ->
            parent.get('idCacheTrue_idCacheFalse').update child.get('id'), value: "something", =>
              App.Child.find child.get('id'), (error, child) =>
                assert.equal child.get('value'), 'something'
                
                App.Child.find child2.get('id'), (error, child) =>
                  assert.equal child.get('value'), null
                  
                  done()

          test 'update()', (done) ->
            parent.get('idCacheTrue_idCacheFalse').update value: "something", =>
              App.Child.find child.get('id'), (error, child) =>
                assert.equal child.get('value'), 'something'

                App.Child.find child3.get('id'), (error, child) =>
                  assert.equal child.get('value'), null

                  done()
            
          test 'destroy(1)', (done) ->
            parent.get('idCacheTrue_idCacheFalse').destroy child.get('id'), =>
              App.Parent.find parent.get('id'), (error, parent) =>
                assert.deepEqual parent.get(relation.idCacheKey), [child2.get('id')]
                
                App.Child.all (error, records) =>
                  assert.equal records.length, 2
                  done()
                
          test 'destroy()', (done) ->
            parent.get('idCacheTrue_idCacheFalse').destroy =>
              App.Parent.find parent.get('id'), (error, parent) =>
                assert.deepEqual parent.get(relation.idCacheKey), []
                
                App.Child.all (error, records) =>
                  assert.equal records.length, 1
                  done()
                
          test 'all', (done) ->
            parent.get('idCacheTrue_idCacheFalse').all (error, records) =>
              assert.equal records.length, 2
              done()
              
          test 'add to set', (done) ->
            App.Child.create (error, newChild) =>
              parent.get('idCacheTrue_idCacheFalse').add newChild, =>
                App.Parent.find parent.get('id'), (error, parent) =>
                  assert.deepEqual _.toS(parent.get(relation.idCacheKey)), _.toS([child.get('id'), child2.get('id'), newChild.get('id')])
                  
                  App.Child.all (error, records) =>
                    assert.equal records.length, 4
                    done()
###                    
          #test 'remove from set', (done) ->
          #  parent.idCacheTrue_idCacheFalse().remove child, =>
          #    App.Parent.find parent.get('id'), (error, parent) =>
          #      assert.deepEqual _.toS(parent.get(relation.idCacheKey)), _.toS([child.get('id'), newChild.get('id')])
          #
          #      App.Child.all (error, records) =>
          #        assert.equal records.length, 3
          #        done()
          
          #describe 'inverseOf', ->
          #  test 'add to set', (done) ->
          #    App.Child.create (error, child) =>
          #      child.idCacheFalse_idCacheTrue
###
describeWith(Tower.Store.Memory)
describeWith(Tower.Store.Mongodb) unless Tower.client