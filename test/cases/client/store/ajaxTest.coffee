if Tower.isClient
  describeWith = (store) ->
    describe "Tower.Store.Transport.Ajax (#{store.className()})", ->
      beforeEach ->
        App.User.store(store)

      describe 'params', ->
        test 'conditions', ->
          criteria  = App.User.where(firstName: '=~': 'L').compile()

          params    = criteria.toJSON()

          expected  =
            conditions:
              firstName: '=~': 'L'

          assert.deepEqual expected, params

        test 'conditions, pagination and sort', ->
          criteria  = App.User.where(firstName: {'=~': 'L'}, lastName: {'=~': 'l'}).page(2).limit(2).asc('lastName').compile()

          params    = criteria.toJSON()

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

          Tower.Store.Transport.Ajax.create user, (error, updatedUser) =>
            assert.ok !error
            done()

        test 'failure', (done) ->
          user = App.User.build()

          Tower.Store.Transport.Ajax.create user, (error, updatedUser) =>
            assert.ok !error
            done()

        test 'error (before it even makes a request)', (done) ->
          user = {}

          Tower.Store.Transport.Ajax.create user, (error, updatedUser) =>
            assert.ok !error
            done()

      describe 'update', ->
        test 'success'
        test 'failure'
        test 'error'

      describe 'destroy', ->
        test 'success'
        test 'failure'
        test 'error'

      describe 'find', ->
        test 'conditions', (done) ->
          criteria  = App.User.where(firstName: '=~': 'L').compile()
          
          Tower.Store.Transport.Ajax.find criteria, (error, data) =>
            console.log error
            console.log data
            done()

  describeWith(Tower.Store.Memory)