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
          App.Post.store(store)
          App.Child.store(store)
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

    test 'belongsTo', (done) ->
      App.User.insert firstName: 'Lance', (error, user) ->
        user
        App.Post.create rating: 8, (error, post) ->
          
        done()
   
describeWith(Tower.Store.Mongodb) unless Tower.client