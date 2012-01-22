require '../../config'

user      = null

describe 'Tower.Model.Persistence', ->
  beforeEach ->
    User.store(new Tower.Store.Memory(name: "users", type: "User"))

  describe 'create', ->
    beforeEach ->
    
    test 'create with no attributes (missing required attributes)', ->
      User.create (error, record) ->
        expect(record.errors).toEqual { "firstName": ["firstName can't be blank"] }
        
        expect(User.count()).toEqual 0
        
    test 'create with valid attributes', ->
      User.create firstName: "Lance", (error, record) ->
        expect(record.errors).toEqual {}

        expect(User.count()).toEqual 1
        
    #test 'create multiple with valid attributes', ->
    #  attributes = [{firstName: "Lance"}, {firstName: "Dane"}]
    #  User.create attributes, (error, records) ->
    #    expect(records.length).toEqual 2
    #    expect(User.count()).toEqual 2
  
  describe 'destroy', ->
    beforeEach ->
      user = User.create(id: 1, firstName: "Lance!!!")
      User.create(id: 2, firstName: "Dane")
      
    test 'destroy all', ->
      expect(User.count()).toEqual 2
      
      User.destroy()
      
      expect(User.count()).toEqual 0
      
    test 'destroy matching', ->
      expect(User.count()).toEqual 2
      
      User.where(firstName: "Dane").destroy()
      
      expect(User.count()).toEqual 1