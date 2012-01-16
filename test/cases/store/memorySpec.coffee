require '../../config'

require '../storeSpec'

describe 'Tower.Store.Memory', ->
  beforeEach ->
    User.store new Tower.Store.Memory(name: "users", type: "User")
    
  test 'create', ->
    User.create firstName: "Lance", (error, user) ->
      expect(user instanceof User).toBeTruthy()
      expect(user.get("firstName")).toEqual "Lance"
      
  describe 'finders', ->
    beforeEach ->
      User.create firstName: "Lance", lastName: "Pollard", id: 1
      User.create firstName: "Dane", lastName: "Pollard", id: 2
      User.create firstName: "John", lastName: "Smith", id: 3
      
    test 'all', ->
      User.all (error, users) ->
        expect(users.length).toEqual 3
        
    test 'count', ->
      User.count (error, count) ->
        expect(count).toEqual 3
        
    #test 'find(1)', ->
    #  User.find 1, (error, user) ->
    #    expect(user instanceof User).toBeTruthy()
    
    test 'find(1, 2)', ->
      User.find 1, 2, (error, users) ->
        for user in users
          expect(user instanceof User).toBeTruthy()
          
    test 'find([1, 2])', ->
      User.find [1, 2], (error, users) ->
        for user in users
          expect(user instanceof User).toBeTruthy()
          
    test 'where(firstName: "Lance").find(1, 2)', ->
      User.where(firstName: "Lance").find 1, 2, (error, users) ->
        expect(users.length).toEqual 1
        for user in users
          expect(user instanceof User).toBeTruthy()
          
    test 'where(firstName: /L/)', ->
      User.where(firstName: /L/).all (error, records) ->
        for record in records
          expect(record.firstName).toMatch /L/
    
    test 'where(firstName: "=~": "L")', ->
      User.where(firstName: "=~": "L").all (error, records) ->
        for record in records
          expect(record.firstName).toMatch /L/
      
    test 'where(firstName: "$match": "L")', ->
      User.where(firstName: "$match": "L").all (error, records) ->
        for record in records
          expect(record.firstName).toMatch /L/
          
    test 'where(firstName: "!~": "L")'
    test 'where(firstName: "!=": "Lance")'
    test 'where(firstName: "!=": null)'
    test 'where(firstName: "==": null)'
    test 'where(firstName: null)'
    test 'where(createdAt: ">=": _(2).days().ago())'
    test 'where(createdAt: ">=": _(2).days().ago(), "<=": _(1).day().ago())'
    test 'where(tags: $in: ["ruby", "javascript"])'
    test 'where(tags: $nin: ["java", "asp"])'
    test 'where(tags: $all: ["jquery", "node"])'
    test 'where(likeCount: 10)'
    test 'where(likeCount: ">=": 10)'
    test 'asc("firstName")'
    test 'desc("firstName")'
    test 'order(["firstName", "desc"])'
    test 'limit(10)'
    test 'paginate(perPage: 20, page: 2)'
    test 'page(2)'
    
    describe 'destroy', ->
      test 'where(name: "John").destroy()', ->
        User.where(name: "John").destroy (error) ->
        
    describe 'update', ->
      test 'where(name: "John").update(name: "Tom")', ->
        User.where(name: "John").update name: "Tom", (error) ->