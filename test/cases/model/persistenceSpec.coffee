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
        
    test 'create multiple with valid attributes', ->
      attributes = [{firstName: "Lance"}, {firstName: "Dane"}]
      User.create attributes, (error, records) ->
        expect(records.length).toEqual 2
        expect(User.count()).toEqual 2
    
  describe 'update', ->
    beforeEach ->
      user = User.create(id: 1, firstName: "Lance")
      User.create(id: 2, firstName: "Dane")
      
    test 'update string property', ->
      User.update firstName: "John", instantiate: false, (error) =>
        User.all (error, users) =>
          expect(users.length).toEqual 2
          for user in users
            expect(user.get("firstName")).toEqual "John"
      
    test 'update matching string property', ->
      User.where(firstName: "Lance").update firstName: "John", instantiate: false, (error) =>
        expect(User.where(firstName: "John").count()).toEqual 1
        
  describe '#update', ->
    beforeEach ->
      user = User.create(id: 1, firstName: "Lance")
      User.create(id: 2, firstName: "Dane")
      
    test 'update string property with updateAttributes', ->
      user.updateAttributes firstName: "John", (error) =>
        expect(user.get("firstName")).toEqual "John"
        expect(user.changes).toEqual {}
    
    test 'update string property with save', ->
      user.set "firstName", "John"
      user.save (error) =>
        expect(user.get("firstName")).toEqual "John"
        expect(user.changes).toEqual {}
  
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