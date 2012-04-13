describe 'Tower.Factory', ->
  beforeEach ->
    Tower.Factory.clear()
    
  describe '.define', ->
    test 'metadata', ->
      Tower.Factory.define "user", ->
      
      expected =
        name:            'user'
        className:       'App.User'
        parentClassName: undefined
      
      userFactory = Tower.Factory.definitions["user"]
    
      for key, value of expected
        assert.equal value, userFactory[key]
      
      assert.ok userFactory.hasOwnProperty("callback")
  
    test '#toClass', ->
      userFactory = Tower.Factory.define "user", ->
      
      assert.equal userFactory.toClass().name, "User"
  
    test 'throw error if cant figure out class', ->
      userFactory = Tower.Factory.define "guest", ->
      
      assert.throws -> userFactory.toClass().name
      
    test 'with className', ->
      userFactory = Tower.Factory.define "guest", className: "User", ->

      assert.doesNotThrow -> userFactory.toClass().name
      assert.equal userFactory.toClass().name, "User"
      
  describe '.create', ->
    test 'create (factory has no attributes)', ->
      Tower.Factory.define "user", ->
      
      user = Tower.Factory.create "user"
      
      assert.equal user.constructor.name, "User"
      
    test 'create (factory has attributes)', ->
      Tower.Factory.define "user", ->
        firstName: "Isaac"
      
      user = Tower.Factory.create "user"

      assert.equal user.get('firstName'), "Isaac"
      
    test 'create (factory has async attributes)', (done) ->
      Tower.Factory.define "user", (callback) ->
        respond = ->
          callback null, firstName: "Isaac"
        
        setTimeout respond, 10

      Tower.Factory.create "user", (error, user) =>
        assert.equal user.get('firstName'), "Isaac"
        done()