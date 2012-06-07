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

      describe 'find', ->
        test 'conditions', (done) ->
          criteria  = App.User.where(firstName: '=~': 'L').compile()
          
          Tower.Store.Transport.Ajax.find criteria, (error, data) =>
            console.log error
            console.log data
            done()

  describeWith(Tower.Store.Memory)