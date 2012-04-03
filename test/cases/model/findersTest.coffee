require '../../config'

moment = require('moment')

describeWith = (store) ->
  describe "Tower.Model.Finders (Tower.Store.#{store.name})", ->
    beforeEach (done) ->
      App.Post.store(new store(name: "posts", type: "App.Post"))
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
      describe 'integer > value (8, 10)', ->
        beforeEach (done) ->
          App.Post.create [{rating: 8}, {rating: 10}], =>
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

      describe 'date > value (' + moment().format('MMM D, YYYY') + ')', ->
        beforeEach (done) ->
          App.Post.create rating: 1, someDate: moment()._d, done
        
        test 'where(someDate: ">": Dec 25, 1995)', (done) ->
          App.Post.where(someDate: ">": moment("Dec 25, 1995")._d).count (error, count) =>
            assert.equal count, 1
            done()
        
        test 'where(createdAt: ">": Dec 25, 1995)', (done) ->
          App.Post.where(createdAt: ">": moment("Dec 25, 1995")._d).count (error, count) =>
            assert.equal count, 1
            done()
        
        test 'where(createdAt: ">": Dec 25, 2050)', (done) ->
          App.Post.where(createdAt: ">": moment("Dec 25, 2050")._d).count (error, count) =>
            assert.equal count, 0
            done()

    describe '$gte', ->
      describe 'integer >= value (8, 10)', ->
        beforeEach (done) ->
          App.Post.create [{rating: 8}, {rating: 10}], done
        
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
          App.Post.create [{rating: 8}, {rating: 10}], =>
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
      
      describe 'date < value (' + moment().format('MMM D, YYYY') + ')', ->
        beforeEach (done) ->
          App.Post.create rating: 1, someDate: moment()._d, done
        
        test 'where(someDate: "<": Dec 25, 2050)', (done) ->
          App.Post.where(someDate: "<": moment("Dec 25, 2050")._d).count (error, count) =>
            assert.equal count, 1
            done()
            
        test 'where(createdAt: "<": Dec 25, 2050)', (done) ->
          App.Post.where(createdAt: "<": moment("Dec 25, 2050")._d).count (error, count) =>
            assert.equal count, 1
            done()
            
        test 'where(createdAt: "<": Dec 25, 1995)', (done) ->
          App.Post.where(createdAt: "<": moment("Dec 25, 1995")._d).count (error, count) =>
            assert.equal count, 0
            done()
            
    describe '$lte', ->
      describe 'integer <= value', ->
        beforeEach (done) ->
          attributes = []
          attributes.push rating: 8
          attributes.push rating: 10
          App.Post.create(attributes, done)
        
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
          App.Post.create(rating: 1, someDate: moment()._d, done)
          
        test 'where(someDate: "<=": Dec 25, 2050)', (done) ->
          App.Post.where(someDate: "<=": moment("Dec 25, 2050")._d).count (error, count) =>
            assert.equal count, 1
            done()
            
        test 'where(createdAt: "<=": Dec 25, 2050)', (done) ->
          App.Post.where(createdAt: "<=": moment("Dec 25, 2050")._d).count (error, count) =>
            assert.equal count, 1
            done()
            
        test 'where(createdAt: "<=": Dec 25, 1995)', (done) ->
          App.Post.where(createdAt: "<=": moment("Dec 25, 1995")._d).count (error, count) =>
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
          App.Post.create(attributes, done)
        
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
          attributes.push rating: 8, tags: ["ruby", "javascript"]
          attributes.push rating: 9, tags: ["nodejs", "javascript"]
          App.Post.create(attributes, done)
        
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
        App.Post.create(attributes, done)
      
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
        App.Post.create(attributes, done)
        
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
          App.Post.create(attributes, done)
          
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

describeWith(Tower.Store.Memory)
describeWith(Tower.Store.MongoDB)