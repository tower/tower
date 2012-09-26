describe 'Tower.StoreTransportAjax', ->
  describe 'params', ->
    test 'conditions', ->
      criteria  = App.User.where(firstName: '=~': 'L').compile()

      params    = criteria.toParams()

      expected  =
        conditions:
          firstName: '=~': 'L'

      assert.deepEqual expected, params

    test 'conditions, pagination and sort', ->
      criteria  = App.User.where(firstName: {'=~': 'L'}, lastName: {'=~': 'l'}).page(2).limit(2).asc('lastName').compile()

      params    = criteria.toParams()

      expected  =
        conditions:
          firstName: '=~': 'L'
          lastName: '=~': 'l'
        limit: 2
        page: 2
        sort: [
          ['lastName', 'asc']
        ]

      assert.deepEqual expected, params

  describe 'create', ->
    test 'success', (done) ->
      user = App.User.build(firstName: 'Lance')

      Tower.StoreTransportAjax.create [user], (error, updatedUser) =>
        assert.isTrue !!updatedUser
        done()

    #test 'failure', (done) ->
    #  user = App.User.build()
#
    #  Tower.StoreTransportAjax.create user, (error, updatedUser) =>
    #    assert.ok !error
    #    done()
#
    #test 'error (before it even makes a request)', (done) ->
    #  user = {}
#
    #  Tower.StoreTransportAjax.create user, (error, updatedUser) =>
    #    assert.ok !error
    #   done()

  describe 'update', ->
    user = null

    # need to create some records on the server first...
    beforeEach (done) ->
      user = App.User.build(firstName: 'Lance')

      Tower.StoreTransportAjax.create [user], (error, updatedUser) =>
        user = updatedUser

        done()

    test 'success', (done) ->
      user.set('firstName', 'John')

      Tower.StoreTransportAjax.update [user], (error, updatedUser) =>
        assert.isTrue !!updatedUser
        done()

    test 'failure'
    test 'error'

  describe 'destroy', ->
    user = null

    # need to create some records on the server first...
    beforeEach (done) ->
      user = App.User.build(firstName: 'Lance')

      Tower.StoreTransportAjax.create [user], (error, updatedUser) =>
        user = updatedUser

        done()

    test 'success', (done) ->
      Tower.StoreTransportAjax.destroy [user], (error, destroyedUser) =>
        assert.isTrue !!destroyedUser
        done()

    test 'failure'
    test 'error'

  describe 'find', ->
    test 'conditions', (done) ->
      criteria  = App.User.where(firstName: 'L').compile()
      
      Tower.StoreTransportAjax.find criteria, (error, data) =>
        assert.isTrue !!data
        done()
