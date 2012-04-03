require '../../config'

attr = Tower.Model.Attribute
  
describe 'Tower.Model.Fields', ->
  describe 'class', ->
    test 'type: "Id"', ->
      field = App.BaseModel.fields().id
      assert.equal field.owner, App.BaseModel
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
      
  describe 'serialization', ->
    test 'string "A string" == "A string"', ->
      assert.equal attr.string.to("A string"), "A string"
      assert.equal attr.string.from("A string"), "A string"
      
    test 'string null, undefined == null', ->
      assert.equal attr.string.to(undefined), null
      assert.equal attr.string.from(undefined), null
      assert.equal attr.string.to(null), null
      assert.equal attr.string.from(null), null
      
    #test 'date', ->
    #  assert.equal attr.date.to("Jan 10, 2010").getTime(), new Date("Sun, 10 Jan 2010 08:00:00 GMT").getTime()
    #  assert.equal attr.date.from(new Date("Sun, 10 Jan 2010 08:00:00 GMT")).getTime(), new Date("Sun, 10 Jan 2010 08:00:00 GMT").getTime()
      
    test 'boolean == true', ->
      assert.equal attr.boolean.to(true), true
      assert.equal attr.boolean.from(true), true
      
      assert.equal attr.boolean.to(1), true
      assert.equal attr.boolean.from(1), true
      
      assert.equal attr.boolean.to("true"), true
      assert.equal attr.boolean.from("true"), true
      
    test 'boolean == false', ->
      assert.equal attr.boolean.to(false), false
      assert.equal attr.boolean.from(false), false
      
      assert.equal attr.boolean.to(null), false
      assert.equal attr.boolean.from(null), false
      
      assert.equal attr.boolean.to(undefined), false
      assert.equal attr.boolean.from(undefined), false
      
      assert.equal attr.boolean.to(0), false
      assert.equal attr.boolean.from(0), false
      
      assert.equal attr.boolean.to("false"), false
      assert.equal attr.boolean.from("false"), false
      
    test 'number', ->
      assert.equal attr.number.to(1), 1
      assert.equal attr.number.to(1.1), 1.1
      
      assert.equal attr.number.from(1), 1
      assert.equal attr.number.from(1.1), 1.1
    
    test 'integer', ->
      assert.equal attr.integer.to(1), 1
      assert.equal attr.integer.to(1.1), 1

      assert.equal attr.integer.from(1), 1
      assert.equal attr.integer.from(1.1), 1
    
    test 'float', ->
      assert.equal attr.float.to(1), 1.0
      assert.equal attr.float.to(1.1), 1.1

      assert.equal attr.float.from(1), 1.0
      assert.equal attr.float.from(1.1), 1.1
      
    test 'array', ->
      assert.equal attr.array.to(undefined), null
      assert.equal attr.array.to(null), null
      
      assert.deepEqual attr.array.from(1), [1]
      assert.deepEqual attr.array.from([1]), [1]

      assert.deepEqual attr.array.from("hey"), ["hey"]
      assert.deepEqual attr.array.from(["hey"]), ["hey"]
      
  describe 'instance', ->
    model = null
    
    beforeEach ->
      model = new App.BaseModel
    
    test '#attributes', ->
      assert.equal typeof(model.attributes), "object"
      
    test '#get', ->
      assert.equal model.get('likeCountWithDefault'), 0
      
    test '#set', ->
      assert.equal model.get('likeCountWithDefault'), 0
      
      model.set('likeCountWithDefault', 10)
      
      assert.equal model.get('likeCountWithDefault'), 10
      
    test '#has', ->
      assert.equal model.has('likeCountWithDefault'), true
      assert.equal model.has('somethingIDontHave'), false
      
    test 'encode boolean', ->
      assert.equal model.get("favorite"), false
      model.set("favorite", "true")
      assert.equal model.get("favorite"), true
      
    test 'custom encoding', ->
      model.set("custom", ["ruby", "javascript"])
      assert.deepEqual model.attributes.custom, ["ruby", "javascript"]
      assert.equal model.get("custom"), "ruby-javascript"
      
      model.attributes.custom.push "mongodb"
      
      assert.equal model.get("custom"), "ruby-javascript-mongodb"
      
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

