describeWith = (store) ->
  describe "Tower.Model.Cursor states (Tower.Store.#{store.className()})", ->
    beforeEach (done) ->
      App.User.store(store)
      done()

    describe "exists", ->
      test 'default', ->
        cursor = App.User.scoped().cursor

        assert.equal true, cursor.isEmpty

      test 'if no records are present', (done) ->
        App.User.exists (error, exists) ->
          assert.equal false, exists
          # thinking about putting the cursor as `this`
          assert.equal true, @isEmpty
          assert.equal 'Cursor', @constructor.className()
          done()

      test 'if records are present', (done) ->
        App.User.create firstName: 'Lance', =>
          App.User.exists (error, exists) ->
            assert.equal true, exists
            assert.equal false, @isEmpty
            done()

    describe "count", ->
      test 'default', ->
        cursor = App.User.scoped().cursor

        assert.equal 0, cursor.totalCount

      test 'if no records are present', (done) ->
        App.User.count (error, count) ->
          assert.equal 0, count
          # thinking about putting the cursor as `this`
          assert.equal 0, @totalCount
          done()

      test 'if records are present', (done) ->
        App.User.create firstName: 'Lance', =>
          App.User.count (error, count) ->
            assert.equal 1, count
            assert.equal 1, @totalCount
            done()

    describe "pagination", ->
      test 'default', ->
        cursor = App.User.scoped().cursor

        assert.equal 0, cursor.totalPageCount
        assert.equal 0, cursor.currentPage
        assert.equal false, cursor.hasFirstPage
        assert.equal false, cursor.hasPreviousPage
        assert.equal false, cursor.hasNextPage
        assert.equal false, cursor.hasLastPage

      test 'hasFirstPage', (done) ->
        App.User.create firstName: 'Lance', =>
          App.User.page(1).all (error, users) ->
            done()

      test 'hasPreviousPage'
      test 'hasNextPage'
      test 'hasLastPage'
      test 'currentPage'
  
describeWith(Tower.Store.Memory)

if Tower.isServer
  describeWith(Tower.Store.Mongodb)
