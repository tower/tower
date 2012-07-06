membership  = null
group       = null
user        = null

describeWith = (store) ->
  describe "Tower.Model.Relation.BelongsTo (Tower.Store.#{store.className()})", ->
    beforeEach (done) ->
      async.series [
        (callback) =>
          store.clean(callback)
        (callback) =>
          # maybe the store should be global..
          # there's a problem in relations with subclasses b/c type
          App.Page.store(store)
          App.Post.store(store)
          App.Child.store(store)
          App.Address.store(store)
          App.Parent.store(store)
          App.User.store(store)
          App.Membership.store(store)
          App.DependentMembership.store(store)
          App.Group.store(store)
          callback()
        (callback) =>
          App.User.insert firstName: "Lance", (error, record) =>
            user = record
            callback()
        (callback) =>
          App.Group.insert (error, record) =>
            group = record
            callback()
      ], done
      
    afterEach ->
      try App.Parent.insert.restore()
      try App.Group.insert.restore()
      try App.Membership.insert.restore()

    test 'create from hasMany', (done) ->
      App.User.create firstName: 'Lance', (error, user) ->
        user.get('articles').create rating: 8, (error, createdPost) =>
          App.Post.first (error, foundPost) =>
            assert.deepEqual createdPost.get('id').toString(), foundPost.get('id').toString()

            assert.ok !foundPost.get('user')

            App.User.count (error, count) =>
              assert.equal 2, count

              foundPost.fetch 'user', (error, foundUser) =>
                assert.deepEqual foundUser.get('articleIds')[0].toString(), foundPost.get('id').toString()
                assert.deepEqual foundUser.get('id').toString(), user.get('id').toString()
                assert.deepEqual foundPost.get('user').get('id').toString(), user.get('id').toString()
                done()
    
    # user.getAssociation('address').create
    # user.get('address')
    # user.createAssociation('address')
    # user.buildAssociation('address')
    test 'create from hasOne', (done) ->
      App.User.create firstName: 'Lance', (error, user) ->
        user.createAssocation 'address', city: 'San Francisco', (error, createdAddress) =>

          App.Address.first (error, foundAddress) =>
            assert.deepEqual createdAddress.get('id').toString(), foundAddress.get('id').toString()

            App.Address.count (error, count) =>
              assert.equal 1, count

              App.User.find user.get('id'), (error, user) =>
                assert.ok !user.get('address'), "there should not be an address loaded yet"

                user.fetch 'address', (error, foundAddress) =>
                  assert.deepEqual foundAddress.get('id').toString(), createdAddress.get('id').toString()
                  # now you can access it.
                  assert.deepEqual user.get('address').get('id').toString(), createdAddress.get('id').toString()

                  # need to handle reverse
                  # console.log foundAddress.get('user')
                  # and id portion:
                  # foundAddress.get('userId')
                  done()
    
    test 'belongsTo accepts model, not just modelId', (done) ->
      App.User.create firstName: 'Lance', (error, user) =>
        App.Group.create title: 'A Group', (error, group) =>
          App.Membership.create user: user, group: group, (error, membership) =>
            assert.equal membership.get('userId').toString(), user.get('id').toString()
            assert.equal membership.get('groupId').toString(), group.get('id').toString()

            assert.equal membership.get('user').get('id').toString(), user.get('id').toString()
            assert.equal membership.get('group').get('id').toString(), group.get('id').toString()
            done()

    
    test 'belongsTo with eager loading', (done) ->
      assert.deepEqual App.Membership.includes('user', 'group').compile().toParams().includes, ['user', 'group']

      App.User.create firstName: 'Lance', (error, user) =>
        App.Group.create title: 'A Group', (error, group) =>
          App.Membership.create user: user, group: group, (error, membership) =>

            # model.reload isn't setup yet.
            App.Membership.includes('user', 'group').find membership.get('id'), (error, membership) =>
              assert.equal membership.get('user').get('id').toString(), user.get('id').toString()
              assert.equal membership.get('group').get('id').toString(), group.get('id').toString()
              done()

    test 'hasMany with eager loading', (done) ->
      assert.deepEqual App.User.includes('memberships').compile().toParams().includes, ['memberships']
    
      App.User.create firstName: 'Lance', (error, user) =>
        App.Group.create title: 'A Group', (error, group) =>
          App.Membership.create user: user, group: group, (error, membership) =>
            # model.reload isn't setup yet.
            App.User.includes('memberships').find user.get('id'), (error, user) =>
              assert.ok user.get('memberships').all()._hasContent()

              assert.deepEqual user.get('memberships').all().toArray().getEach('id'), [membership.get('id')]

              user.get('memberships').reset()

              user.get('memberships').all =>
                assert.ok user.get('memberships').all()._hasContent()
                assert.deepEqual user.get('memberships').all().toArray().getEach('id'), [membership.get('id')]

                done()

    test 'hasMany + nested belongsTo with eager loading', (done) ->
      App.User.create firstName: 'Lance', (error, user) =>
        App.Group.create title: 'A Group', (error, group) =>
          App.Membership.create user: user, group: group, (error, membership) =>
    
            # model.reload isn't setup yet.
            App.User.includes(memberships: 'group').find user.get('id'), (error, user) =>
              assert.equal user.get('memberships').all().toArray().length, 1

              membership = user.get('memberships').all().toArray()[0]

              assert.ok membership.get('group').equals(group), 'membership.group == group'
              assert.ok membership.get('user').equals(user), 'membership.user == user'

              done()

    test 'hasOne with eager loading', (done) ->
      App.User.create firstName: 'Lance', (error, user) ->
        user.createAssocation 'address', city: 'San Francisco', (error, createdAddress) =>
          assert.equal user.get('id').toString(), createdAddress.get('userId').toString()
          App.User.includes('address').find user.get('id'), (error, user) =>
            assert.equal user.get('address').get('id').toString(), createdAddress.get('id').toString()
            done()

    afterEach ->
      App.Membership.default('scope', undefined)

    test 'eager loading in default scope', (done) ->
      App.Membership.default('scope', App.Membership.includes('user', 'group'))

      App.User.create firstName: 'Lance', (error, user) =>
        App.Group.create title: 'A Group', (error, group) =>
          App.Membership.create user: user, group: group, (error, membership) =>
            App.Membership.find membership.get('id'), (error, membership) =>
              assert.ok membership.get('user').equals(user), 'membership.user == user'
              assert.ok membership.get('group').equals(group), 'membership.group == group'

              done()


    # You can't do this easily with MongoDB:
    # "find all memberships where user firstName equals 'Lance'",
    # because it requires joining two collections. Either use embedded docs,
    # or (todo) checkout DBref: http://stackoverflow.com/questions/6502541/mongodb-query-multiple-collections-at-once
    # Maybe you can hack this in there using mongodb's streaming api,
    # then do two queries back and forth in chunks: get 1000 memberships, get users matching, then redo if haven't met limit.
    #test 'querying through belongsTo', (done) ->
    #  App.User.create firstName: 'Lance', (error, user) =>
    #    App.Group.create title: 'A Group', (error, group) =>
    #      App.Membership.create user: user, group: group, (error, membership) =>
    #
    #        console.log App.Membership.where('user.firstName': 'Lance').toParams()
    #        App.Membership.where('user.firstName': 'Lance').all (error, memberships) =>
    #          console.log memberships
    #          done()

    ###
    describe 'belongsTo', ->
      user = null
      post = null

      beforeEach (done) ->
        App.User.create firstName: 'Lance', (error, record) =>
          user = record
          user.get('posts').create rating: 8, (error, record) =>
            post = record
            done()

      test 'fetch', (done) ->
        done()
    ###
   
describeWith(Tower.Store.Memory)
describeWith(Tower.Store.Mongodb) unless Tower.isClient