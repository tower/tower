require '../../config'

moment = require('moment')

describeWith = (store) ->
  describe "Tower.Model.Finders (Tower.Store.#{store.constructor.name})", ->
    beforeEach (done) ->
      App.Post.store(store)
      App.Post.destroy(done)
      
    afterEach (done) ->
      App.Post.destroy(done)
    
    #test 'exists', ->
    #  App.Post.exists 1, (error, result) -> assert.equal result, true
    #  App.Post.exists "1", (error, result) -> assert.equal result, true
    #  App.Post.exists authorName: "David", (error, result) -> assert.equal result, true
    #  App.Post.exists authorName: "Mary", approved: true, (error, result) -> assert.equal result, true
    #  App.Post.exists 45, (error, result) -> assert.equal result, false
    #  App.Post.exists (error, result) -> assert.equal result, true
    #  App.Post.exists null, (error, result) -> assert.equal result, false
    
    describe '$gt', ->
      test 'integer > value', (done) ->
        App.Post.create rating: 8, (error, post) =>
          App.Post.create rating: 10, (error, post) =>
            App.Post.count (error, count) =>
              assert.equal count, 2
              
              App.Post.where(rating: ">": 10).count (error, count) =>
                assert.equal count, 0
                
                App.Post.where(rating: ">": 8).count (error, count) =>
                  assert.equal count, 1
                  
                  App.Post.where(rating: ">": 7).count (error, count) =>
                    assert.equal count, 2
                    
                    done()
###      
      test 'date > value', ->
        App.Post.create(rating: 1, someDate: moment()._d)
      
        assert.equal App.Post.where(someDate: ">": moment("Dec 25, 1995")._d).count(), 1
        assert.equal App.Post.where(createdAt: ">": moment("Dec 25, 1995")._d).count(), 1
        assert.equal App.Post.where(createdAt: ">": moment("Dec 25, 2050")._d).count(), 0
  
    describe '$gte', ->
      test 'integer >= value', ->
        App.Post.create(rating: 8)
        App.Post.create(rating: 10)
      
        assert.equal App.Post.count(), 2
      
        assert.equal App.Post.where(rating: ">=": 11).count(), 0
        assert.equal App.Post.where(rating: ">=": 10).count(), 1
        assert.equal App.Post.where(rating: ">=": 8).count(), 2
        assert.equal App.Post.where(rating: ">=": 7).count(), 2
      
    describe '$lt', ->
      test 'integer < value', ->
        App.Post.create(rating: 8)
        App.Post.create(rating: 10)
      
        assert.equal App.Post.count(), 2
      
        assert.equal App.Post.where(rating: "<": 11).count(), 2
        assert.equal App.Post.where(rating: "<": 10).count(), 1
        assert.equal App.Post.where(rating: "<": 8).count(), 0
      
      test 'date < value', ->
        App.Post.create(rating: 1, someDate: moment()._d)
      
        assert.equal App.Post.where(someDate: "<": moment("Dec 25, 2050")._d).count(), 1
        assert.equal App.Post.where(createdAt: "<": moment("Dec 25, 2050")._d).count(), 1
        assert.equal App.Post.where(createdAt: "<": moment("Dec 25, 1995")._d).count(), 0
  
    describe '$lte', ->
      test 'integer <= value', ->
        App.Post.create(rating: 8)
        App.Post.create(rating: 10)
      
        assert.equal App.Post.count(), 2
      
        assert.equal App.Post.where(rating: "<=": 11).count(), 2
        assert.equal App.Post.where(rating: "<=": 10).count(), 2
        assert.equal App.Post.where(rating: "<=": 8).count(), 1
        assert.equal App.Post.where(rating: "<=": 7).count(), 0
      
      test 'date <= value', ->
        App.Post.create(rating: 1, someDate: moment()._d)
        assert.equal App.Post.where(someDate: "<=": moment("Dec 25, 2050")._d).count(), 1
        assert.equal App.Post.where(createdAt: "<=": moment("Dec 25, 2050")._d).count(), 1
        assert.equal App.Post.where(createdAt: "<=": moment("Dec 25, 1995")._d).count(), 0
  
    describe '$match', ->
  
    describe '$notMatch', ->
  
    describe '$in', ->
      test 'string in array', ->
        App.Post.create(rating: 8, tags: ["ruby", "javascript"])
        App.Post.create(rating: 9, tags: ["nodejs", "javascript"])
      
        assert.equal App.Post.count(), 2
      
        assert.equal App.Post.where(tags: "$in": ["javascript"]).count(), 2
        assert.equal App.Post.where(tags: "$in": ["asp"]).count(), 0
        assert.equal App.Post.where(tags: "$in": ["nodejs"]).count(), 1
  
    describe '$any', ->
      test 'string in array', ->
        App.Post.create(rating: 8, tags: ["ruby", "javascript"])
        App.Post.create(rating: 9, tags: ["nodejs", "javascript"])
      
        assert.equal App.Post.count(), 2
      
        assert.equal App.Post.where(tags: "$any": ["javascript"]).count(), 2
        assert.equal App.Post.where(tags: "$any": ["asp"]).count(), 0
        assert.equal App.Post.where(tags: "$any": ["nodejs"]).count(), 1
        assert.equal App.Post.where(tags: "$any": ["nodejs", "ruby"]).count(), 2
        assert.equal App.Post.where(tags: "$any": ["nodejs", "asp"]).count(), 1
      
        assert.equal App.Post.anyIn(tags: ["javascript"]).count(), 2
        assert.equal App.Post.anyIn(tags: ["asp"]).count(), 0
        assert.equal App.Post.anyIn(tags: ["nodejs"]).count(), 1
        assert.equal App.Post.anyIn(tags: ["nodejs", "ruby"]).count(), 2
        assert.equal App.Post.anyIn(tags: ["nodejs", "asp"]).count(), 1
  
    describe '$nin', ->
      test 'string not in array', ->
        App.Post.create(rating: 8, tags: ["ruby", "javascript"])
        App.Post.create(rating: 9, tags: ["nodejs", "javascript"])
      
        assert.equal App.Post.count(), 2
      
        assert.equal App.Post.where(tags: "$nin": ["javascript"]).count(), 0
        assert.equal App.Post.where(tags: "$nin": ["asp"]).count(), 2
        assert.equal App.Post.where(tags: "$nin": ["nodejs"]).count(), 1
      
        assert.equal App.Post.notIn(tags: ["javascript"]).count(), 0
        assert.equal App.Post.notIn(tags: ["asp"]).count(), 2
        assert.equal App.Post.notIn(tags: ["nodejs"]).count(), 1
  
    describe '$all', ->
      test 'string in array', ->
        App.Post.create(rating: 8, tags: ["ruby", "javascript"])
        App.Post.create(rating: 9, tags: ["nodejs", "javascript"])
      
        assert.equal App.Post.count(), 2
      
        assert.equal App.Post.where(tags: "$all": ["javascript"]).count(), 2
        assert.equal App.Post.where(tags: "$all": ["asp"]).count(), 0
        assert.equal App.Post.where(tags: "$all": ["nodejs"]).count(), 1
        assert.equal App.Post.where(tags: "$all": ["nodejs", "javascript"]).count(), 1
        assert.equal App.Post.where(tags: "$all": ["nodejs", "ruby"]).count(), 0
      
        assert.equal App.Post.allIn(tags: ["javascript"]).count(), 2
        assert.equal App.Post.allIn(tags: ["asp"]).count(), 0
        assert.equal App.Post.allIn(tags: ["nodejs"]).count(), 1
        assert.equal App.Post.allIn(tags: ["nodejs", "javascript"]).count(), 1
        assert.equal App.Post.allIn(tags: ["nodejs", "ruby"]).count(), 0
  
    describe '$null', ->
  
    describe '$notNull', ->
  
    describe '$eq', ->
      #RW.Wall.where({title: /A wall/}).count() doesn't work
  
    describe '$neq', ->
###
describeWith(new Tower.Store.Memory(name: "posts", type: "App.Post"))
describeWith(new Tower.Store.MongoDB(name: "posts", type: "App.Post"))