require '../../config'

class BaseModel extends Tower.Model
  @field "id", type: "Id"
  @field "likeCountWithoutDefault", type: "Integer"
  @field "likeCountWithDefault", type: "Integer", default: 0
  @field "tags", type: "Array", default: []
  @field "title"
  
describe 'Tower.Model.Fields', ->
  describe 'class', ->
    test 'type: "Id"', ->
      field = BaseModel.fields().id
      assert.equal field.owner, BaseModel
      assert.equal field.type, "Id"
      
    test 'type: "Integer" without default', ->
      field = BaseModel.fields().likeCountWithoutDefault
      assert.equal field.type, "Integer"
      assert.equal field.default, undefined
      
    test 'type: "Integer", default: 0', ->
      field = BaseModel.fields().likeCountWithDefault
      assert.equal field.type, "Integer"
      assert.equal field._default, 0
      
    test 'type: "Array", default: []', ->
      field = BaseModel.fields().tags
      assert.equal field.type, "Array"
      assert.isArray field._default
      
    test 'default type == "String"', ->
      field = BaseModel.fields().title
      assert.equal field.type, "String"
      assert.equal field._default, undefined
      
  describe 'instance', ->
    model = null
    
    beforeEach ->
      model = new BaseModel
    
    test '#attributes', ->
      assert.equal typeof(model.attributes), "object"
      
    test '#get', ->
      assert.equal model.get('likeCountWithDefault'), 0
      
    test '#set', ->
      assert.equal model.get('likeCountWithDefault'), 0
      
      model.set('likeCountWithDefault', 10)
      
      assert.equal model.get('likeCountWithDefault'), 10
      
    test '#changes', ->
      assert.isObject model.changes
      
      model.set('likeCountWithDefault', 10)
      
      assert.deepEqual model.changes, {likeCountWithDefault: [0, 10]}
      
    test '#attributeWas', ->
      assert.equal model.attributeWas("likeCountWithDefault"), undefined
      
      model.set('likeCountWithDefault', 10)
      
      assert.equal model.attributeWas("likeCountWithDefault"), 0

    test '#attributeChanged', ->
      assert.equal model.attributeChanged("likeCountWithDefault"), false
      
      model.set('likeCountWithDefault', 10)
      
      assert.equal model.attributeChanged("likeCountWithDefault"), true
      
    test '#has', ->
      assert.equal model.has('likeCountWithDefault'), true
      assert.equal model.has('somethingIDontHave'), false