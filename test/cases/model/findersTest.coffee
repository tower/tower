describe "Tower.ModelFinders", ->
  beforeEach (done) ->
    # @todo I have no idea why adding this makes it work 
    # (b/c it's also in test/server.coffee beforeEach hook)
    Tower.store.clean =>
      done()

  #test 'exists', ->
  #  App.Post.exists 1, (error, result) -> assert.equal result, true
  #  App.Post.exists "1", (error, result) -> assert.equal result, true
  #  App.Post.exists authorName: "David", (error, result) -> assert.equal result, true
  #  App.Post.exists authorName: "Mary", approved: true, (error, result) -> assert.equal result, true
  #  App.Post.exists 45, (error, result) -> assert.equal result, false
  #  App.Post.exists (error, result) -> assert.equal result, true
  #  App.Post.exists null, (error, result) -> assert.equal result, false
  
  describe 'basics', ->
    beforeEach (done) ->
      App.Post.insert [{rating: 8}, {rating: 10}], done
    
    test 'all', (done) ->
      App.Post.all (error, records) =>
        assert.equal records.length, 2
        done()
    
    test 'first', (done) ->
      App.Post.asc("rating").first (error, record) =>
        assert.equal record.get('rating'), 8
        done()
        
    test 'last', (done) ->
      App.Post.asc("rating").last (error, record) =>
        assert.equal record.get('rating'), 10
        done()
        
    test 'count', (done) ->
      App.Post.count (error, count) =>
        assert.equal count, 2
        done()

    test 'exists', (done) ->
      App.Post.exists (error, value) =>
        assert.equal value, true
        done()
  
  describe '$gt', ->
    describe 'integer > value (8, 10)', ->
      beforeEach (done) ->
        App.Post.insert [{rating: 8}, {rating: 10}], =>
          done()
        
      test 'where(rating: ">": 10)', (done) ->
        App.Post.where(rating: ">": 10).count (error, count) =>
          assert.equal count, 0
          done()
          
      test 'where(rating: ">": 8)', (done) ->
        App.Post.where(rating: ">": 8).count (error, count) =>
          assert.equal count, 1
          done()
          
      test 'where(rating: ">": 7)', (done) ->
        App.Post.where(rating: ">": 7).count (error, count) =>
          assert.equal count, 2
          done()

    describe 'date > value', ->
      beforeEach (done) ->
        App.Post.insert rating: 1, someDate: new Date, done
      
      test 'where(someDate: ">": Dec 25, 1995)', (done) ->
        App.Post.where(someDate: ">": _.toDate("Dec 25, 1995")).count (error, count) =>
          assert.equal count, 1
          done()
      
      test 'where(createdAt: ">": Dec 25, 1995)', (done) ->
        App.Post.where(createdAt: ">": _.toDate("Dec 25, 1995")).count (error, count) =>
          assert.equal count, 1
          done()
      
      test 'where(createdAt: ">": Dec 25, 2050)', (done) ->
        App.Post.where(createdAt: ">": _.toDate("Dec 25, 2050")).count (error, count) =>
          assert.equal count, 0
          done()

  describe '$gte', ->
    describe 'integer >= value (8, 10)', ->
      beforeEach (done) ->
        App.Post.insert [{rating: 8}, {rating: 10}], done
      
      test 'where(rating: ">=": 11)', (done) ->
        App.Post.where(rating: ">=": 11).count (error, count) =>
          assert.equal count, 0
          done()
      
      test 'where(rating: ">=": 10)', (done) ->
        App.Post.where(rating: ">=": 10).count (error, count) =>
          assert.equal count, 1
          done()
      
      test 'where(rating: ">=": 8)', (done) ->
        App.Post.where(rating: ">=": 8).count (error, count) =>
          assert.equal count, 2
          done()
      
      test 'where(rating: ">=": 7)', (done) ->
        App.Post.where(rating: ">=": 7).count (error, count) =>
          assert.equal count, 2
          done()
  
  describe '$lt', ->
    describe "integer < value", ->
      beforeEach (done) ->
        App.Post.insert [{rating: 8}, {rating: 10}], =>
          done()
        
      test 'where(rating: "<": 11)', (done) ->
        App.Post.where(rating: "<": 11).count (error, count) =>
          assert.equal count, 2
          done()
      
      test 'where(rating: "<": 10)', (done) ->
        App.Post.where(rating: "<": 10).count (error, count) =>
          assert.equal count, 1
          done()
          
      test 'where(rating: "<": 8)', (done) ->
        App.Post.where(rating: "<": 8).count (error, count) =>
          assert.equal count, 0
          done()
    
    describe 'date < value', ->
      beforeEach (done) ->
        App.Post.insert rating: 1, someDate: new Date, done
      
      test 'where(someDate: "<": Dec 25, 2050)', (done) ->
        App.Post.where(someDate: "<": _.toDate("Dec 25, 2050")).count (error, count) =>
          assert.equal count, 1
          done()
          
      test 'where(createdAt: "<": Dec 25, 2050)', (done) ->
        App.Post.where(createdAt: "<": _.toDate("Dec 25, 2050")).count (error, count) =>
          assert.equal count, 1
          done()
          
      test 'where(createdAt: "<": Dec 25, 1995)', (done) ->
        App.Post.where(createdAt: "<": _.toDate("Dec 25, 1995")).count (error, count) =>
          assert.equal count, 0
          done()
          
  describe '$lte', ->
    describe 'integer <= value', ->
      beforeEach (done) ->
        attributes = []
        attributes.push rating: 8
        attributes.push rating: 10
        App.Post.insert(attributes, done)
      
      test 'where(rating: "<=": 11)', (done) ->
        App.Post.where(rating: "<=": 11).count (error, count) =>
          assert.equal count, 2
          done()
          
      test 'where(rating: "<=": 10)', (done) ->
        App.Post.where(rating: "<=": 10).count (error, count) =>
          assert.equal count, 2
          done()
          
      test 'where(rating: "<=": 8)', (done) ->
        App.Post.where(rating: "<=": 8).count (error, count) =>
          assert.equal count, 1
          done()
      
      test 'where(rating: "<=": 7)', (done) ->
        App.Post.where(rating: "<=": 7).count (error, count) =>
          assert.equal count, 0
          done()
    
    test 'date <= value', ->
      beforeEach (done) ->
        App.Post.insert(rating: 1, someDate: new Date, done)
        
      test 'where(someDate: "<=": Dec 25, 2050)', (done) ->
        App.Post.where(someDate: "<=": _.toDate("Dec 25, 2050")).count (error, count) =>
          assert.equal count, 1
          done()
          
      test 'where(createdAt: "<=": Dec 25, 2050)', (done) ->
        App.Post.where(createdAt: "<=": _.toDate("Dec 25, 2050")).count (error, count) =>
          assert.equal count, 1
          done()
          
      test 'where(createdAt: "<=": Dec 25, 1995)', (done) ->
        App.Post.where(createdAt: "<=": _.toDate("Dec 25, 1995")).count (error, count) =>
          assert.equal count, 0
          done()

  describe '$match', ->
  
  describe '$notMatch', ->
  
  describe '$in', ->
    describe 'string in array', ->
      beforeEach (done) ->
        attributes = []
        attributes.push rating: 8, tags: ["ruby", "javascript"]
        attributes.push rating: 9, tags: ["nodejs", "javascript"]
        App.Post.insert(attributes, done)
      
      test 'where(tags: "$in": ["javascript"])', (done) ->
        App.Post.where(tags: "$in": ["javascript"]).count (error, count) =>
          assert.equal count, 2
          done()
          
      test 'where(tags: "$in": ["asp"])', (done) ->
        App.Post.where(tags: "$in": ["asp"]).count (error, count) =>
          assert.equal count, 0
          done()
          
      test 'where(tags: "$in": ["nodejs"])', (done) ->
        App.Post.where(tags: "$in": ["nodejs"]).count (error, count) =>
          assert.equal count, 1
          done()
  
  describe '$any', ->
    describe 'string in array', ->
      beforeEach (done) ->
        attributes = []
        attributes.push rating: 8, tags: ["ruby", "javascript"], slug: 'ruby-javascript'
        attributes.push rating: 9, tags: ["nodejs", "javascript"], slug: 'nodejs-javascript'
        App.Post.insert(attributes, done)
      
      test 'anyIn(tags: ["ruby-javascript", "c++"]', (done) ->
        App.Post.anyIn(slug: ["ruby-javascript", "c++"]).count (err, count) =>
          assert.equal count, 1
          done()

      test 'anyIn(tags: ["javascript"])', (done) ->
        App.Post.anyIn(tags: ["javascript"]).count (error, count) =>
          assert.equal count, 2
          done()
        
      test 'anyIn(tags: ["asp"])', (done) ->
        App.Post.anyIn(tags: ["asp"]).count (error, count) =>
          assert.equal count, 0
          done()
        
      test 'anyIn(tags: ["nodejs"])', (done) ->
        App.Post.anyIn(tags: ["nodejs"]).count (error, count) =>
          assert.equal count, 1
          done()
        
      test 'anyIn(tags: ["nodejs", "ruby"])', (done) ->
        App.Post.anyIn(tags: ["nodejs", "ruby"]).count (error, count) =>
          assert.equal count, 2
          done()
        
      test 'anyIn(tags: ["nodejs", "asp"])', (done) ->
        App.Post.anyIn(tags: ["nodejs", "asp"]).count (error, count) =>
          assert.equal count, 1
          done()
  
  describe '$nin', ->
    beforeEach (done) ->
      attributes = []
      attributes.push rating: 8, tags: ["ruby", "javascript"]
      attributes.push rating: 9, tags: ["nodejs", "javascript"]
      App.Post.insert(attributes, done)
    
    test 'notIn(tags: ["javascript"])', (done) ->
      App.Post.notIn(tags: ["javascript"]).count (error, count) =>
        assert.equal count, 0
        done()
    
    test 'notIn(tags: ["asp"])', (done) ->
      App.Post.notIn(tags: ["asp"]).count (error, count) =>
        assert.equal count, 2
        done()
        
    test 'notIn(tags: ["nodejs"])', (done) ->
      App.Post.notIn(tags: ["nodejs"]).count (error, count) =>
        assert.equal count, 1
        done()
  
  describe '$all', ->
    beforeEach (done) ->
      attributes = []
      attributes.push rating: 8, tags: ["ruby", "javascript"]
      attributes.push rating: 9, tags: ["nodejs", "javascript"]
      App.Post.insert(attributes, done)
      
    describe 'string in array', ->
      test 'allIn(tags: ["javascript"])', (done) ->
        App.Post.allIn(tags: ["javascript"]).count (error, count) =>
          assert.equal count, 2
          done()
      
      test 'allIn(tags: ["asp"])', (done) ->
        App.Post.allIn(tags: ["asp"]).count (error, count) =>
          assert.equal count, 0
          done()
      
      test 'allIn(tags: ["nodejs"])', (done) ->
        App.Post.allIn(tags: ["nodejs"]).count (error, count) =>
          assert.equal count, 1
          done()
          
      test 'allIn(tags: ["nodejs", "javascript"])', (done) ->
        App.Post.allIn(tags: ["nodejs", "javascript"]).count (error, count) =>
          assert.equal count, 1
          done()
          
      test 'allIn(tags: ["nodejs", "ruby"])', (done) ->
        App.Post.allIn(tags: ["nodejs", "ruby"]).count (error, count) =>
          assert.equal count, 0
          done()

  describe '$null', ->

  describe '$notNull', ->

  describe '$eq', ->
    describe 'string', ->
      beforeEach (done) ->
        attributes = []
        attributes.push title: "Ruby", rating: 8
        attributes.push title: "JavaScript", rating: 10
        App.Post.insert(attributes, done)
        
      test 'where(title: $eq: "Ruby")', (done) ->
        App.Post.where(title: $eq: "Ruby").count (error, count) =>
          assert.equal count, 1
          done()
          
      test 'where(title: /R/)', (done) ->
        App.Post.where(title: /R/).count (error, count) =>
          assert.equal count, 1
          done()
          
      test 'where(title: /[Rr]/)', (done) ->
        App.Post.where(title: /[Rr]/).count (error, count) =>
          assert.equal count, 2
          done()

  describe '$neq', ->

  describe 'pagination', ->
    beforeEach (done) ->
      Tower.ModelCursor::defaultLimit = 5
      
      callbacks = []
      i = 0
      while i < 18
        i++
        do (i) ->
          callbacks.push (next) =>
            title = (new Array(i + 1)).join("a")
            App.Post.insert title: title, rating: 8, (error, post) =>
              next()
      
      _.series callbacks, done
      
    afterEach ->
      Tower.ModelCursor::defaultLimit = 20
    
    test 'limit(1)', (done) ->
      App.Post.limit(1).all (error, posts) =>
        assert.equal posts.length, 1
        done()
        
    test 'limit(0) should not do anything', (done) ->
      App.Post.limit(0).all (error, posts) =>
        assert.equal posts.length, 18
        done()
    
    test 'page(2) middle of set', (done) ->
      App.Post.page(2).asc("title").all (error, posts) =>
        assert.equal posts.length, 5
        assert.equal posts[0].get('title').length, 6
        assert.equal posts[4].get('title').length, 10
        
        done()
    
    test 'page(4) end of set', (done) ->
      App.Post.page(4).asc("title").all (error, posts) =>
        assert.equal posts.length, 3
        done()
        
    test 'page(20) if page is greater than count, should return 0', (done) ->
      App.Post.page(20).all (error, posts) =>
        assert.equal posts.length, 0
        done()

    test 'desc', (done) ->
      App.Post.page(2).desc('title').all (error, posts) =>
        assert.equal posts[0].get('title').length, 13
        done()
    
    test 'asc', (done) ->
      App.Post.page(2).asc('title').all (error, posts) =>
        assert.equal posts[0].get('title').length, 6
        done()

    if Tower.store.className() == 'Memory'
      test 'returns array/cursor', ->
        posts = App.Post.all()#page(2).asc('title').all()
        assert.equal posts.length, 18
        assert.isTrue posts.isCursor, 'posts.isCursor'
        # assert iterate
        for post, index in posts
          assert.ok post instanceof Tower.Model

        assert.equal index, 18
