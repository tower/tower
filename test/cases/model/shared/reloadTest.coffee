describe 'Tower.Model#reload', ->
  user = null
  referenceUser = null

  beforeEach (done) ->
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

  test 'refresh', (done) ->
    referenceUser.updateAttributes firstName: 'Pete', =>
      user.refresh =>
        assert.equal user.get('firstName'), 'Pete'
        done()
