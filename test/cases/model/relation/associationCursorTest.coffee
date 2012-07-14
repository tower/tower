# It seems there can be distinct optimizations for client/server association persistence.
# For the server, the "context" need to be scoped to the current request, you have to save the models in callbacks.
# One workaround may be to do things like App.User.env(@).where..., where `env` is the controller, so you're
# creating a cursor mapped to the current request. This way you can create an identity-map/cache of records on a per-request basis.
# Otherwise, you have to do what rails does and have the AutosaveAssociations callbacks.
# On the client, however, it may be better to do something like what ember-data is doing with a global transaction.
# When any of the models change, they are added to a global bucket, then at some point they are all synced.
# There would be some complications with hasMany through records b/c of ids using that approach, but
# it would mean that whenever you call `record.save()`, it doesn't have to go through all those callbacks; it
# would only have to do what happens in the `set` method for associations, such as `_setHasManyAssociation`, which
# just nullifies/sets ids on the associated models - and then the global transaction would sync them all in a simple way, 
# just calling save/destroy on each. For now though, we can do this in phases:
# 1. get it working on client/server the way rails does it with autosave associations.
# 2. try out a global transaction on the client and see if that simplifies things.
#   If so, remove the autosave stuff on the client and build something custom.
# 3. try the `env` thing in the controller, so you're creating an identity map in the controllers
#   on a per-request basis. This will pave the way for creating "database transactions" (or getting
#   as close as possible to them with mongodb). We may find this may work like the client-side global transaction.
class App.AssociationCursorTest extends Tower.Model
  @hasMany 'associationCursorPosts'
  @hasOne 'associationCursorAddress'
  @belongsTo 'associationCursorUser'

class App.AssociationCursorPost extends Tower.Model
  @field 'title'

  @belongsTo 'associationCursorTest'

  @validates 'title', presence: true

class App.AssociationCursorUser extends Tower.Model
  @field 'username'

  @hasMany 'associationCursorTests'

  @validates 'username', presence: true

class App.AssociationCursorAddress extends Tower.Model
  @field 'city'
  @field 'state'

  @belongsTo 'associationCursorTest'

  @validates 'city', 'state', presence: true

describeWith = (store) ->
  describe "Tower.Model.Relation (association cursor, Tower.Store.#{store.className()})", ->
    record      = null
    cursor      = null
    association = null
    key         = null

    beforeEach (done) ->
      store.clean =>
        App.AssociationCursorTest.store(store)
        App.AssociationCursorAddress.store(store)
        App.AssociationCursorUser.store(store)
        App.AssociationCursorPost.store(store)
        done()

    describe 'new owner', ->
      describe 'hasMany', ->
        beforeEach ->      
          record = App.AssociationCursorTest.build()
          cursor = record.getAssociationCursor('associationCursorPosts')
          association = record.constructor.relations()['associationCursorPosts']

        test 'getAssociation', ->
          assert.isTrue record.getAssociation('associationCursorPosts') instanceof Tower.Model.Scope, "record.getAssociation('associationCursorPosts') instanceof Tower.Model.Scope"
          assert.isTrue record.getAssociation('associationCursorPosts').cursor.isHasMany, 'cursor.isHasMany'
          assert.isTrue record.getAssociationCursor('associationCursorPosts').isHasMany, 'getAssociationCursor("associationCursorPosts").isHasMany'

        test 'setHasManyAssociation', ->
          assert.equal cursor.length, 0
          # pass single item
          record._setHasManyAssociation('associationCursorPosts', App.AssociationCursorPost.build(), association)
          assert.equal cursor.length, 1
          # pass single item in array
          record._setHasManyAssociation('associationCursorPosts', [App.AssociationCursorPost.build()], association)
          assert.equal cursor.length, 1
          # pass multiple items in array
          record._setHasManyAssociation('associationCursorPosts', [App.AssociationCursorPost.build(), App.AssociationCursorPost.build()], association)
          assert.equal cursor.length, 2

        test '_associatedRecordsToValidateOrSave(cursor, isNew: true, autosave: false)', ->
          assert.equal record._associatedRecordsToValidateOrSave(cursor, true).length, 0
          record._setHasManyAssociation('associationCursorPosts', App.AssociationCursorPost.build(), association)
          assert.equal record._associatedRecordsToValidateOrSave(cursor, true).length, 1

        test '_associatedRecordsToValidateOrSave(cursor, isNew: false, autosave: true) should return records where record._changedForAutosave() is true', ->
          newRecord = App.AssociationCursorPost.build()
          existingRecord = App.AssociationCursorPost.build()
          existingRecord.setProperties(isNew: false, isDirty: false, id: 10)
          
          record._setHasManyAssociation('associationCursorPosts', [newRecord, existingRecord], association)

          assert.equal record._associatedRecordsToValidateOrSave(cursor, false, true).length, 1

        test '_associatedRecordsToValidateOrSave(cursor, isNew: false, autosave: false) should return new records', ->
          newRecord = App.AssociationCursorPost.build()
          existingRecord = App.AssociationCursorPost.build()
          existingRecord.setProperties(isNew: false)
          
          record._setHasManyAssociation('associationCursorPosts', [newRecord, existingRecord], association)
          
          assert.equal record._associatedRecordsToValidateOrSave(cursor, false, false).length, 1

        test '_validateCollectionAssociation', ->
          record._setHasManyAssociation('associationCursorPosts', App.AssociationCursorPost.build(), association)
          assert.isFalse record._validateCollectionAssociation(association), 'record._validateCollectionAssociation(association)'

          # @todo what should the error message be?
          assert.deepEqual record.get('errors'), {associationCursorPosts: ['Invalid']}

          record.set('errors', {}) # don't know how to clear the errors in this case yet

          record._setHasManyAssociation('associationCursorPosts', App.AssociationCursorPost.build(title: 'A Title!'), association)
          assert.isTrue record._validateCollectionAssociation(association), 'record._validateCollectionAssociation(association)'

        test 'set', ->
          record.set('associationCursorPosts', App.AssociationCursorPost.build(title: 'A Title!'))
          assert.isTrue record._validateCollectionAssociation(association), 'record._validateCollectionAssociation(association)'

        
        test '_saveCollectionAssociation', (done) ->
          record.save =>
            child = App.AssociationCursorPost.build(title: 'A Title!')
            record.set('associationCursorPosts', child)

            record._saveCollectionAssociation association, =>
              assert.equal child.get('associationCursorTest').get('id').toString(), record.get('id').toString()
              done()
        
        test 'save', (done) ->
          child = App.AssociationCursorPost.build(title: 'A Title!')
          record.set('associationCursorPosts', child)

          record.save =>
            assert.ok record.get('id')
            assert.equal child.get('associationCursorTestId').toString(), record.get('id').toString()
            done()

        test 'replace', (done) ->
          child1 = App.AssociationCursorPost.build(title: 'First Title!')

          record.updateAttributes associationCursorPosts: [child1], =>
            firstId = child1.get('associationCursorTestId').toString()
            assert.ok firstId
            child2 = App.AssociationCursorPost.build(title: 'Second Title!')

            record.updateAttributes associationCursorPosts: [child2], =>
              secondId = child2.get('associationCursorTestId')
              assert.ok secondId
              assert.equal firstId.toString(), secondId.toString()
              # @todo
              assert.isUndefined child1.get('associationCursorTestId')
              assert.equal child2.get('associationCursorTestId').toString(), record.get('id').toString()

              record.get('associationCursorPosts').all (error, count) =>
                assert.equal count.length, 1
                done()

        test 'nullify', (done) ->
          child1 = App.AssociationCursorPost.build(title: 'First Title!')

          record.updateAttributes associationCursorPosts: [child1], =>
            record.updateAttributes associationCursorPosts: [], =>
              assert.isUndefined child1.get('associationCursorTestId')
              
              record.get('associationCursorPosts').all (error, count) =>
                assert.equal count.length, 0
                done()

    describe 'belongsTo', ->
      beforeEach ->      
        record = App.AssociationCursorTest.build()
        cursor = record.getAssociationCursor('associationCursorUser')
        association = record.constructor.relations()['associationCursorUser']

      afterEach ->
        #association.autosave = undefined
      
      test 'getAssociation', ->
        assert.isTrue record.getAssociation('associationCursorUser') instanceof Tower.Model.Scope, "record.getAssociation('associationCursorUser') instanceof Tower.Model.Scope"
        assert.isTrue record.getAssociation('associationCursorUser').cursor.isBelongsTo, 'cursor.isBelongsTo'
        assert.isTrue record.getAssociationCursor('associationCursorUser').isBelongsTo, 'getAssociationCursor("associationCursorUser").isBelongsTo'
      
      test 'setBelongsToAssociation', ->
        assert.equal cursor.length, 0
        # pass single item
        record._setBelongsToAssociation('associationCursorUser', App.AssociationCursorUser.build(), association)
        assert.equal cursor.length, 1

      test '_validateSingleAssociation', ->
        record._setBelongsToAssociation('associationCursorUser', App.AssociationCursorUser.build(), association)
        assert.isFalse record._validateSingleAssociation(association), 'record._validateSingleAssociation(association)'

        assert.deepEqual record.get('errors'), {associationCursorUser: ['Invalid']}

        record.set('errors', {}) # don't know how to clear the errors in this case yet

        record._setBelongsToAssociation('associationCursorUser', App.AssociationCursorUser.build(username: 'fred'), association)
        assert.isTrue record._validateSingleAssociation(association), 'record._validateSingleAssociation(association)'

      test 'set', ->
        record.set('associationCursorUser', App.AssociationCursorUser.build(username: 'fred'))
        assert.isTrue record._validateSingleAssociation(association), 'record._validateSingleAssociation(association)'

      test '_saveBelongsToAssociation', (done) ->
        record.set('associationCursorUser', App.AssociationCursorUser.build(username: 'fred'))

        record._saveBelongsToAssociation association, =>
          assert.ok record.get('associationCursorUser').get('id')
          done()

      test 'save', (done) ->
        record.set('associationCursorUser', App.AssociationCursorUser.build(username: 'john'))

        record.save =>
          assert.ok record.get('id')
          assert.equal record.get('associationCursorUser').get('id').toString(), record.get('associationCursorUserId').toString()
          done()

      test 'replace', (done) ->
        record.updateAttributes associationCursorUser: App.AssociationCursorUser.build(username: 'john'), =>
          firstId     = record.get('associationCursorUserId')
          assert.ok firstId
          record.updateAttributes associationCursorUser: App.AssociationCursorUser.build(username: 'john'), =>
            secondId  = record.get('associationCursorUserId')
            assert.ok secondId
            assert.notEqual firstId.toString(), secondId.toString()
            done()

      test 'nullify', (done) ->
        record.updateAttributes associationCursorUser: App.AssociationCursorUser.build(username: 'john'), =>
          record.updateAttributes associationCursorUser: null, =>
            assert.isUndefined record.get('associationCursorUserId')
            done()

    describe 'hasOne', ->
      beforeEach ->      
        record      = App.AssociationCursorTest.build()
        key         = 'associationCursorAddress'
        cursor      = record.getAssociationCursor(key)
        association = record.constructor.relations()[key]
      
      test 'getAssociation', ->
        assert.isTrue record.getAssociation(key) instanceof Tower.Model.Scope, "record.getAssociation(key) instanceof Tower.Model.Scope"
        assert.isTrue record.getAssociation(key).cursor.isHasOne, 'cursor.isHasOne'
        assert.isTrue record.getAssociationCursor(key).isHasOne, 'getAssociationCursor("associationCursorUser").isHasOne'
      
      test 'setHasOneAssociation', ->
        assert.equal cursor.length, 0
        # pass single item
        record._setHasOneAssociation(key, App.AssociationCursorAddress.build(), association)
        assert.equal cursor.length, 1

      test '_validateSingleAssociation', ->
        record._setHasOneAssociation(key, App.AssociationCursorAddress.build(), association)
        assert.isFalse record._validateSingleAssociation(association), 'record._validateSingleAssociation(association)'

        assert.deepEqual record.get('errors'), {associationCursorAddress: ['Invalid']}

        record.set('errors', {}) # don't know how to clear the errors in this case yet

        record._setHasOneAssociation(key, App.AssociationCursorAddress.build(city: 'San Francisco', state: 'CA'), association)
        assert.isTrue record._validateSingleAssociation(association), 'record._validateSingleAssociation(association)'
      
      test 'set', ->
        record.set(key, App.AssociationCursorAddress.build(city: 'San Francisco', state: 'CA'))
        assert.isTrue record._validateSingleAssociation(association), 'record._validateSingleAssociation(association)'

      test '_saveHasOneAssociation', (done) ->
        record.save =>
          child = App.AssociationCursorAddress.build(city: 'San Francisco', state: 'CA')
          record.set(key, child)

          record._saveHasOneAssociation association, =>
            assert.equal child.get('associationCursorTestId').toString(), record.get('id').toString()
            done()
      
      test 'save', (done) ->
        child = App.AssociationCursorAddress.build(city: 'San Francisco', state: 'CA')
        record.set(key, child)

        record.save =>
          assert.ok record.get('id')
          assert.equal child.get('associationCursorTestId').toString(), record.get('id').toString()
          done()

      test 'setting multiple times when parent is persistent', (done) ->
        record.save =>
          App.AssociationCursorAddress.create city: 'San Francisco', state: 'CA', (error, child1) =>
            child2 = App.AssociationCursorAddress.build(city: 'San Francisco', state: 'CA')
            record.set(key, child1)
            record.set(key, child2)

            assert.isUndefined record.getAssociationCursor(key)._markedForDestruction

            done()

      test 'setting multiple times when parent is persistent and relationship already existed', (done) ->
        child1 = App.AssociationCursorAddress.build city: 'San Francisco', state: 'CA'
        record.updateAttributes associationCursorAddress: child1, =>
          child2 = App.AssociationCursorAddress.build(city: 'San Francisco', state: 'CA')
          record.set(key, child1)
          record.set(key, child2)

          assert.equal record.getAssociationCursor(key)._markedForDestruction, child1

          done()

describeWith(Tower.Store.Memory)
describeWith(Tower.Store.Mongodb) unless Tower.client