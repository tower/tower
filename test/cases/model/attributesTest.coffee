attr        = Tower.Model.Attribute
Serializer  = Tower.Store.Serializer

describeWith = (store) ->
  describe "Tower.Model.Fields (Tower.Store.#{store.className()})", ->
    beforeEach (done) ->
      store.clean =>
        App.BaseModel.store(store)
        App.User.store(store)
        done()
      
    describe 'class', ->
      test 'type: "Id"', ->
        field = App.BaseModel.fields().id
        assert.equal field.type, "Id"

      test 'type: "Integer" without default', ->
        field = App.BaseModel.fields().likeCountWithoutDefault
        assert.equal field.type, "Integer"
        assert.equal field.default, undefined
      
      test 'type: "Integer", default: 0', ->
        field = App.BaseModel.fields().likeCountWithDefault
        assert.equal field.type, "Integer"
        assert.equal field._default, 0
      
      test 'type: "Array", default: []', ->
        field = App.BaseModel.fields().tags
        assert.equal field.type, "Array"
        assert.isArray field._default
      
      test 'default type == "String"', ->
        field = App.BaseModel.fields().title
        assert.equal field.type, "String"
        assert.equal field._default, undefined
      
      test 'type: ["NestedModel"]', ->
        field = App.BaseModel.fields().nestedModels
        assert.equal field.type, "Array"
        assert.equal field.encodingType, "Array"
        assert.equal field.itemType, "NestedModel"
      
      test 'array of field names without options', ->
        {a1, a2, a3} = App.BaseModel.fields()
        assert.equal a1.type, "String"
        assert.equal a3.type, "String"
    
      test 'array of field names with options', ->
        {a4, a5, a6} = App.BaseModel.fields()
        assert.equal a4.type, "Integer"
        assert.equal a6.type, "Integer"
      
      test 'object of field names', ->
        {o1, o2} = App.BaseModel.fields()
        assert.equal o1.type, "String"
        assert.equal o2.type, "Integer"
      
    describe 'serialization', ->
      test 'string "A string" == "A string"', ->
        assert.equal Serializer.String.to("A string"), "A string"
        assert.equal Serializer.String.from("A string"), "A string"

      test 'string null, undefined == null', ->
        assert.equal Serializer.String.to(undefined), null
        assert.equal Serializer.String.from(undefined), null
        assert.equal Serializer.String.to(null), null
        assert.equal Serializer.String.from(null), null
      
      #test 'date', ->
      #  assert.equal Serializer.Date.to("Jan 10, 2010").getTime(), new Date("Sun, 10 Jan 2010 08:00:00 GMT").getTime()
      #  assert.equal Serializer.Date.from(new Date("Sun, 10 Jan 2010 08:00:00 GMT")).getTime(), new Date("Sun, 10 Jan 2010 08:00:00 GMT").getTime()
      
      test 'boolean == true', ->
        assert.equal Serializer.Boolean.to(true), true
        assert.equal Serializer.Boolean.from(true), true
      
        assert.equal Serializer.Boolean.to(1), true
        assert.equal Serializer.Boolean.from(1), true
      
        assert.equal Serializer.Boolean.to("true"), true
        assert.equal Serializer.Boolean.from("true"), true
      
      test 'boolean == false', ->
        assert.equal Serializer.Boolean.to(false), false
        assert.equal Serializer.Boolean.from(false), false
      
        assert.equal Serializer.Boolean.to(null), false
        assert.equal Serializer.Boolean.from(null), false
      
        assert.equal Serializer.Boolean.to(undefined), false
        assert.equal Serializer.Boolean.from(undefined), false
      
        assert.equal Serializer.Boolean.to(0), false
        assert.equal Serializer.Boolean.from(0), false
      
        assert.equal Serializer.Boolean.to("false"), false
        assert.equal Serializer.Boolean.from("false"), false
      
      test 'number', ->
        assert.equal Serializer.Number.to(1), 1
        assert.equal Serializer.Number.to(1.1), 1.1
      
        assert.equal Serializer.Number.from(1), 1
        assert.equal Serializer.Number.from(1.1), 1.1
    
      test 'integer', ->
        assert.equal Serializer.Integer.to(1), 1
        assert.equal Serializer.Integer.to(1.1), 1

        assert.equal Serializer.Integer.from(1), 1
        assert.equal Serializer.Integer.from(1.1), 1
    
      test 'float', ->
        assert.equal Serializer.Float.to(1), 1.0
        assert.equal Serializer.Float.to(1.1), 1.1

        assert.equal Serializer.Float.from(1), 1.0
        assert.equal Serializer.Float.from(1.1), 1.1
      
      test 'array', ->
        assert.equal Serializer.Array.to(undefined), null
        assert.equal Serializer.Array.to(null), null
      
        assert.deepEqual Serializer.Array.from(1), [1]
        assert.deepEqual Serializer.Array.from([1]), [1]

        assert.deepEqual Serializer.Array.from("hey"), ["hey"]
        assert.deepEqual Serializer.Array.from(["hey"]), ["hey"]
      
    describe 'instance', ->
      model = null
    
      beforeEach ->
        model = App.BaseModel.new()
    
      test '#data', ->
        assert.equal typeof(model.get('data')), "object"

      test '#get', ->
        assert.equal model.get('likeCountWithDefault'), 0
      
      test '#set', ->
        assert.equal model.get('likeCountWithDefault'), 0
      
        model.set('likeCountWithDefault', 10)
      
        assert.equal model.get('likeCountWithDefault'), 10
               
      test 'encode boolean', ->
        assert.equal model.get("favorite"), false
        model.set("favorite", "true")
        assert.equal model.get("favorite"), true
        model.set("favorite", "false")
        assert.equal model.get("favorite"), false

      #test 'custom encoding', ->
      #  model.set("custom", ["ruby", "javascript"])
      #  assert.deepEqual model.get('data'), ["ruby", "javascript"]
      #  assert.equal model.get("custom"), "ruby-javascript"
      #
      #  model.attributes.custom.push "mongodb"
      #
      #  assert.equal model.get("custom"), "ruby-javascript-mongodb"
  ###                       
      describe 'operations', ->
        test '$push', ->
          model.set("tags", ["ruby"])
          assert.deepEqual model.get("tags"), ["ruby"]
          model.push tags: "javascript"
          assert.deepEqual model.get("tags"), ["ruby", "javascript"]
          model.push tags: ["mongodb"]
          assert.deepEqual model.get("tags"), ["ruby", "javascript", ["mongodb"]]

        test '$pushAll', ->
          assert.deepEqual model.get("tags"), []
          model.pushAll tags: ["ruby"]
          assert.deepEqual model.get("tags"), ["ruby"]
          model.pushAll tags: ["javascript", "mongodb", "ruby"]
          assert.deepEqual model.get("tags"), ["ruby", "javascript", "mongodb", "ruby"]
        
        test '$pullAll', ->  
          model.set tags: ["ruby", "javascript", "mongodb"]
          model.pullAll tags: ["ruby", "javascript"]
          assert.deepEqual model.get("tags"), ["mongodb"]
        
        test '$inc', ->
          assert.equal model.get("likeCount"), 0
          model.inc likeCount: 1
          assert.equal model.get("likeCount"), 1
          model.inc likeCount: 1
          assert.equal model.get("likeCount"), 2
          model.inc likeCount: -1
          assert.equal model.get("likeCount"), 1
          
    describe 'persistence', ->
      user = null
      
      beforeEach ->
        user = new App.User(firstName: "Lance")
        
      test 'boolean', (done) ->
        assert.equal user.get('admin'), false
        
        user.save =>
          App.User.find user.get('id'), (error, user) =>
            assert.equal user.get('admin'), false
            user.set "admin", true
            assert.equal user.get('admin'), true
            
            user.save =>
              App.User.find user.get('id'), (error, user) =>
                assert.equal user.get('admin'), true
                
                done()
      
      test 'integer', (done) ->
        assert.equal user.get('likes'), 0
        
        user.save =>
          App.User.find user.get('id'), (error, user) =>
            assert.equal user.get('likes'), 0
            user.set "likes", 5.12
            assert.equal user.get('likes'), 5

            user.save =>
              App.User.find user.get('id'), (error, user) =>
                assert.equal user.get('likes'), 5

                done()
                
      test 'float', (done) ->
        assert.equal user.get('rating'), 2.5

        user.save =>
          App.User.find user.get('id'), (error, user) =>
            assert.equal user.get('rating'), 2.5
            user.set "rating", 3.4
            assert.equal user.get('rating'), 3.4

            user.save =>
              App.User.find user.get('id'), (error, user) =>
                assert.equal user.get('rating'), 3.4

                done()
  ###              
  describe 'accessors', ->
    user = null
    
    beforeEach ->
      user = App.User.new(firstName: 'Lance')
      
    test 'string', ->
      assert.equal user.firstName, 'Lance'

  #describe 'attributesForCreate'
  #describe 'attributesForUpdate'

  describe 'other', ->
    beforeEach (done) ->
      store.clean =>
        App.User.store(store)
        done()

    user = null
    beforeEach ->
      user = App.User.build(firstName: 'Lance')

    test 'unsavedData is gone after saving and finding', (done) ->
      assert.deepEqual user.get('data').changed(), ['firstName']
      assert.deepEqual user.get('data').attributesForCreate(), {firstName: 'Lance'}

      user.save =>
        assert.deepEqual user.get('data').changedAttributes, {}

        App.User.find user.get('id'), (error, user) =>
          assert.deepEqual user.get('data').changedAttributes, {}

          user.set('firstName', 'Dane')
          user.set('lastName', 'Pollard')
          assert.deepEqual user.get('data').changed(), ['firstName', 'lastName']
          assert.deepEqual user.get('data').attributesForUpdate(), {firstName: 'Dane', lastName: 'Pollard'}

          user.save =>
            assert.equal user.get('firstName'), 'Dane'
            assert.equal user.get('lastName'), 'Pollard'
            assert.deepEqual user.get('data').changedAttributes, {}
            done()
    ###
    test 'Object attribute type', (done) ->
      meta = {a: 'b', nesting: {one: 'two'}}

      user.set('meta', meta)

      assert.deepEqual user.get('data').changedAttributes.meta, meta

      user.save =>
        assert.deepEqual user.get('data').changedAttributes, {}

        App.User.find user.get('id'), (error, user) =>
          assert.deepEqual user.get('data').changedAttributes, {}

          assert.deepEqual user.get('meta'), meta

          done()
    ###

    # need to solve this soon. do we?
    ###
    test 'nested properties', (done) ->
      meta = {a: 'b', nesting: {one: 'two'}}
      user.set('meta', meta)
    
      user.save =>
        App.User.find user.get('id'), (error, user) =>
          # should it be like this?
          # user.set('meta.nesting.one', 'ten')
          # or this:
          # user.set('meta', {'nesting.one': 'ten'})
          # or just plain:
          user.set('meta', {'nesting': 'one': 'ten'})
    
          assert.deepEqual user.get('data').unsavedData.meta, {nesting: one: 'ten'}

          user.save =>
            assert.deepEqual user.get('data').savedData.meta, {a: 'b', nesting: {one: 'ten'}}

            App.User.find user.get('id'), (error, user) =>
              assert.deepEqual user.get('data').savedData.meta, {a: 'b', nesting: {one: 'ten'}}
              done()
    ###
      
    test 'cliend id', (done) ->
      id = 'a client id'
      user.set('_cid', id)
      assert.equal user.get('_cid'), id
      assert.equal user.get('id'), id

      user.save =>
        # should still have client id, but now a new server id
        assert.equal user.get('_cid').toString(), id.toString()
        assert.notEqual user.get('id').toString(), id

        assert.equal user.toJSON()._cid, id
        assert.equal user.toJSON().id.toString(), user.get('id').toString()

        # need to test this out more
        cloned = App.User.build(user.toJSON())
        
        assert.equal cloned.get('id').toString(), user.get('id').toString()
        assert.equal cloned.get('_cid').toString(), user.get('_cid').toString()
        assert.notEqual cloned.get('id').toString(), cloned.get('_cid').toString()

        done()

    if store.className() == 'Memory'
      test 'that client id is replaced', (done) ->
        id    = 'random client id'
        user.set('_cid', id)
        db = App.User.store()

        Tower.isClient = true
        user.save =>
          # you should still be able to get it by client id
          assert.ok db.records.get(id)
          # only have one key
          assert.equal db.records.keys.list.length, 1
          # now pretend we've saved from server
          newId = _.uuid()
          user.set('id', newId)
          App.User.load(user)
          # now you shouldn't
          assert.equal db.records.keys.list.length, 1
          assert.isUndefined db.records.get(id)
          assert.ok db.records.get(newId)
          Tower.isClient = false
          done()

describeWith(Tower.Store.Memory)
describeWith(Tower.Store.Mongodb) unless Tower.isClient
