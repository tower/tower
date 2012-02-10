require '../../config'

moment = require('moment')

describe 'Tower.Model.Finders', ->
  beforeEach ->
    Post.store(new Tower.Store.Memory(name: "posts", type: "Post"))
  
  #test 'exists', ->
  #  Post.exists 1, (error, result) -> expect(result).toEqual true
  #  Post.exists "1", (error, result) -> expect(result).toEqual true
  #  Post.exists authorName: "David", (error, result) -> expect(result).toEqual true
  #  Post.exists authorName: "Mary", approved: true, (error, result) -> expect(result).toEqual true
  #  Post.exists 45, (error, result) -> expect(result).toEqual false
  #  Post.exists (error, result) -> expect(result).toEqual true
  #  Post.exists null, (error, result) -> expect(result).toEqual false

  describe '$gt', ->
    test 'integer > value', ->
      Post.create(rating: 8)
      Post.create(rating: 10)
      
      expect(Post.count()).toEqual 2
      
      expect(Post.where(rating: ">": 10).count()).toEqual 0
      expect(Post.where(rating: ">": 8).count()).toEqual 1
      expect(Post.where(rating: ">": 7).count()).toEqual 2
      
    test 'date > value', ->
      Post.create(rating: 1, someDate: moment()._d)
      
      expect(Post.where(someDate: ">": moment("Dec 25, 1995")._d).count()).toEqual 1
      expect(Post.where(createdAt: ">": moment("Dec 25, 1995")._d).count()).toEqual 1
      expect(Post.where(createdAt: ">": moment("Dec 25, 2050")._d).count()).toEqual 0
  
  describe '$gte', ->
    test 'integer >= value', ->
      Post.create(rating: 8)
      Post.create(rating: 10)
      
      expect(Post.count()).toEqual 2
      
      expect(Post.where(rating: ">=": 11).count()).toEqual 0
      expect(Post.where(rating: ">=": 10).count()).toEqual 1
      expect(Post.where(rating: ">=": 8).count()).toEqual 2
      expect(Post.where(rating: ">=": 7).count()).toEqual 2
      
  describe '$lt', ->
    test 'integer < value', ->
      Post.create(rating: 8)
      Post.create(rating: 10)
      
      expect(Post.count()).toEqual 2
      
      expect(Post.where(rating: "<": 11).count()).toEqual 2
      expect(Post.where(rating: "<": 10).count()).toEqual 1
      expect(Post.where(rating: "<": 8).count()).toEqual 0
      
    test 'date < value', ->
      Post.create(rating: 1, someDate: moment()._d)
      
      expect(Post.where(someDate: "<": moment("Dec 25, 2050")._d).count()).toEqual 1
      expect(Post.where(createdAt: "<": moment("Dec 25, 2050")._d).count()).toEqual 1
      expect(Post.where(createdAt: "<": moment("Dec 25, 1995")._d).count()).toEqual 0
  
  describe '$lte', ->
    test 'integer <= value', ->
      Post.create(rating: 8)
      Post.create(rating: 10)
      
      expect(Post.count()).toEqual 2
      
      expect(Post.where(rating: "<=": 11).count()).toEqual 2
      expect(Post.where(rating: "<=": 10).count()).toEqual 2
      expect(Post.where(rating: "<=": 8).count()).toEqual 1
      expect(Post.where(rating: "<=": 7).count()).toEqual 0
      
    test 'date <= value', ->
      Post.create(rating: 1, someDate: moment()._d)
      expect(Post.where(someDate: "<=": moment("Dec 25, 2050")._d).count()).toEqual 1
      expect(Post.where(createdAt: "<=": moment("Dec 25, 2050")._d).count()).toEqual 1
      expect(Post.where(createdAt: "<=": moment("Dec 25, 1995")._d).count()).toEqual 0
  
  describe '$match', ->
  
  describe '$notMatch', ->
  
  describe '$in', ->
    test 'string in array', ->
      Post.create(rating: 8, tags: ["ruby", "javascript"])
      Post.create(rating: 9, tags: ["nodejs", "javascript"])
      
      expect(Post.count()).toEqual 2
      
      expect(Post.where(tags: "$in": ["javascript"]).count()).toEqual 2
      expect(Post.where(tags: "$in": ["asp"]).count()).toEqual 0
      expect(Post.where(tags: "$in": ["nodejs"]).count()).toEqual 1
  
  describe '$any', ->
    test 'string in array', ->
      Post.create(rating: 8, tags: ["ruby", "javascript"])
      Post.create(rating: 9, tags: ["nodejs", "javascript"])
      
      expect(Post.count()).toEqual 2
      
      expect(Post.where(tags: "$any": ["javascript"]).count()).toEqual 2
      expect(Post.where(tags: "$any": ["asp"]).count()).toEqual 0
      expect(Post.where(tags: "$any": ["nodejs"]).count()).toEqual 1
      expect(Post.where(tags: "$any": ["nodejs", "ruby"]).count()).toEqual 2
      expect(Post.where(tags: "$any": ["nodejs", "asp"]).count()).toEqual 1
      
      expect(Post.anyIn(tags: ["javascript"]).count()).toEqual 2
      expect(Post.anyIn(tags: ["asp"]).count()).toEqual 0
      expect(Post.anyIn(tags: ["nodejs"]).count()).toEqual 1
      expect(Post.anyIn(tags: ["nodejs", "ruby"]).count()).toEqual 2
      expect(Post.anyIn(tags: ["nodejs", "asp"]).count()).toEqual 1
  
  describe '$nin', ->
    test 'string not in array', ->
      Post.create(rating: 8, tags: ["ruby", "javascript"])
      Post.create(rating: 9, tags: ["nodejs", "javascript"])
      
      expect(Post.count()).toEqual 2
      
      expect(Post.where(tags: "$nin": ["javascript"]).count()).toEqual 0
      expect(Post.where(tags: "$nin": ["asp"]).count()).toEqual 2
      expect(Post.where(tags: "$nin": ["nodejs"]).count()).toEqual 1
      
      expect(Post.notIn(tags: ["javascript"]).count()).toEqual 0
      expect(Post.notIn(tags: ["asp"]).count()).toEqual 2
      expect(Post.notIn(tags: ["nodejs"]).count()).toEqual 1
  
  describe '$all', ->
    test 'string in array', ->
      Post.create(rating: 8, tags: ["ruby", "javascript"])
      Post.create(rating: 9, tags: ["nodejs", "javascript"])
      
      expect(Post.count()).toEqual 2
      
      expect(Post.where(tags: "$all": ["javascript"]).count()).toEqual 2
      expect(Post.where(tags: "$all": ["asp"]).count()).toEqual 0
      expect(Post.where(tags: "$all": ["nodejs"]).count()).toEqual 1
      expect(Post.where(tags: "$all": ["nodejs", "javascript"]).count()).toEqual 1
      expect(Post.where(tags: "$all": ["nodejs", "ruby"]).count()).toEqual 0
      
      expect(Post.allIn(tags: ["javascript"]).count()).toEqual 2
      expect(Post.allIn(tags: ["asp"]).count()).toEqual 0
      expect(Post.allIn(tags: ["nodejs"]).count()).toEqual 1
      expect(Post.allIn(tags: ["nodejs", "javascript"]).count()).toEqual 1
      expect(Post.allIn(tags: ["nodejs", "ruby"]).count()).toEqual 0
  
  describe '$null', ->
  
  describe '$notNull', ->
  
  describe '$eq', ->
    #RW.Wall.where({title: /A wall/}).count() doesn't work
  
  describe '$neq', ->