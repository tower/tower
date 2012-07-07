describeWith = (store) ->
  describe "Tower.Model#reload (Tower.Store.#{store.className()})", ->
    user = null
    referenceUser = null

    beforeEach (done) ->
      store.clean =>
        App.User.store(store)

        App.User.create firstName: 'John', (error, record) =>
          user = record

          App.User.find user.get('id'), (error, record) =>
            referenceUser = record

            done()

    test 'reload', (done) ->
      referenceUser.updateAttributes firstName: 'Pete', =>
        user.reload =>
          assert.equal user.get('firstName'), 'Pete'
          done()

describeWith(Tower.Store.Memory)
describeWith(Tower.Store.Mongodb) unless Tower.isClient
