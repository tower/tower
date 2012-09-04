describe "Tower.ModelRelationHasOne", ->
  user    = null
  address = null

  beforeEach (done) ->
    Tower.Factory.define 'user', ->
      firstName: 'John'

    Tower.Factory.define 'address', ->
      city:   'San Francisco'
      state:  'CA'

    done()

  afterEach ->
    Tower.Factory.clear() # only b/c haven't setup factory system for tower project yet.

  describe 'hasOne on unsaved parent', ->
    beforeEach ->
      user = Tower.Factory.build('user')

    # If it's embedded, it should be saved at the same time.
    # If it's referenced, it should be saved in an after callback.
    # That stuff is datastore specific, so it should happen in cursor callbacks to/from the store.
    #test 'set (when user is saved, address should also be saved)', (done) ->
    #  address = Tower.Factory.build('address')
    #  user.set('address', address)
    #  user.save =>
    #    App.User.count (error, count) =>
    #      assert.equal count, 1
    #
    #      App.Address.count (error, count) =>
    #        assert.equal count, 1
    #
    #        done()

    test 'build["associationName"]'
    test 'create["associationName"]'

  describe 'hasOne on saved parent', ->
    beforeEach (done) ->
      App.User.create firstName: 'John', (error, record) =>
        user = record

        done()
