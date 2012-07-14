describe 'Tower.Model.Relation (association cursor)', ->
  record      = null
  cursor      = null
  association = null
  key         = null

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

  beforeEach (done) ->
    App.AssociationCursorTest.store().constructor.clean(done)

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
            # assert.isUndefined child1.get('associationCursorTestId')
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
