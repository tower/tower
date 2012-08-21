describe 'Tower.ModelAutosaveAssociation', ->
  class App.AutosaveAssociationTest extends Tower.Model
    @hasMany 'posts', autosave: true
    @hasOne 'address', autosave: true
    @belongsTo 'user', autosave: true

  record = null

  test 'callbacks', ->
    callbacks = App.AutosaveAssociationTest.callbacks()
    methods   = (array) ->
      _.map array, (i) -> i.method

    # save
    assert.deepEqual methods(callbacks.save.before), ['_beforeSaveCollectionAssociation', '_autosaveAssociatedRecordsForUser']
    assert.deepEqual methods(callbacks.save.after), []
    # create
    assert.deepEqual methods(callbacks.create.before), []
    assert.deepEqual methods(callbacks.create.after), ['_autosaveAssociatedRecordsForPosts', '_autosaveAssociatedRecordsForAddress']
    # update
    assert.deepEqual methods(callbacks.update.before), []
    assert.deepEqual methods(callbacks.update.after), ['_autosaveAssociatedRecordsForPosts', '_autosaveAssociatedRecordsForAddress']

  describe 'new record', ->
    beforeEach ->
      record = App.AutosaveAssociationTest.build()

    test '_beforeSaveCollectionAssociation, which sets `newRecordBeforeSave`', ->
      assert.ok !record.get('newRecordBeforeSave')
      record._beforeSaveCollectionAssociation()
      assert.isTrue record.get('newRecordBeforeSave')

    test '_associationIsValid', ->
      association = record.constructor.relations()['posts'] # @todo update api to getAssociation
      post        = App.Post.build(title: 'A Title!', rating: 8)

      assert.isTrue record._associationIsValid(association, post)

      # needs to have a rating
      post.set('rating', undefined)
      assert.isFalse record._associationIsValid(association, post)

      assert.deepEqual post.get('errors').rating, [
        'rating must be a minimum of 0',
        'rating must be a maximum of 10'
      ]

      assert.deepEqual record.get('errors')['posts.rating'], [
        'rating must be a minimum of 0',
        'rating must be a maximum of 10'
      ]

    test '_associationIsValid if record isDeleted or isMarkedForDestruction', ->
      association = record.constructor.relations()['posts']
      post        = App.Post.build(title: 'A Title!', rating: 8)

      post.set('isDeleted', true)

      assert.isTrue record._associationIsValid(association, post)

      post.set('isDeleted', false)
      post.set('isMarkedForDestruction', true)

      assert.isTrue record._associationIsValid(association, post)

    # isNew || isDirty || isMarkedForDestruction || _nestedRecordsChangedForAutosave
    test '_changedForAutosave', ->
      reset = -> record.setProperties(isNew: false, isDirty: false, isMarkedForDestruction: false)

      reset()
      
      assert.isFalse record._changedForAutosave()
      record.set('isNew', true)
      assert.isTrue record._changedForAutosave(), 'record._changedForAutosave if isNew'
      reset()

      record.set('isDirty', true)
      assert.isTrue record._changedForAutosave(), 'record._changedForAutosave if isDirty'
      reset()

      record.set('isMarkedForDestruction', true)
      assert.isTrue record._changedForAutosave(), 'record._changedForAutosave if isMarkedForDestruction'
      reset()

    test '_saveBelongsToAssociation', (done) ->
      user = App.User.build(firstName: 'Lance')
      record.set('user', user)
      association = record.constructor.relations()['user']

      assert.isUndefined record.get(association.foreignKey)

      record._saveBelongsToAssociation association, =>
        assert.equal record.get(association.foreignKey).toString(), user.get('id').toString()
        done()

    test '_saveHasOneAssociation', (done) ->
      address = App.Address.build(city: 'San Francisco', state: 'CA')
      record.set('address', address)
      
      # pretend like it's saved
      record.set('id', _.uuid())
      record.set('isNew', false)

      association = record.constructor.relations()['address']

      assert.isUndefined address.get(association.foreignKey)

      record._saveHasOneAssociation association, =>
        assert.equal address.get(association.foreignKey).toString(), record.get('id').toString()
        done()

    # test '_validateCollectionAssociation', (done) ->
