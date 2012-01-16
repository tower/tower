require '../../config'

class BaseModel extends Tower.Model
  @field "id", type: "Id"
  @field "likeCountWithoutDefault", type: "Integer"
  @field "likeCountWithDefault", type: "Integer", default: 0
  
describe 'Tower.Model.Fields', ->
  describe 'class', ->
    test 'type: "Id"', ->
      field = BaseModel.fields().id
      
      expect(field.owner).toEqual BaseModel
      expect(field.type).toEqual "Id"
      
    test 'type: "Integer" without default', ->
      field = BaseModel.fields().likeCountWithoutDefault
      expect(field.type).toEqual "Integer"
      expect(field.default).toEqual undefined
      
    test 'type: "Integer", default: 0', ->
      field = BaseModel.fields().likeCountWithDefault
      expect(field.type).toEqual "Integer"
      expect(field._default).toEqual 0
      
  describe 'instance', ->
    model = null
    
    beforeEach ->
      model = new BaseModel
    
    test '#attributes', ->
      expect(typeof(model.attributes)).toEqual "object"
      
    test '#get', ->
      expect(model.get('likeCountWithDefault')).toEqual 0
      
    test '#set', ->
      expect(model.get('likeCountWithDefault')).toEqual 0
      
      model.set('likeCountWithDefault', 10)
      
      expect(model.get('likeCountWithDefault')).toEqual 10
      
    test '#changes', ->
      expect(model.changes).toEqual {}
      
      model.set('likeCountWithDefault', 10)
      
      expect(model.changes).toEqual {likeCountWithDefault: [0, 10]}
      
    test '#attributeWas', ->
      expect(model.attributeWas("likeCountWithDefault")).toEqual undefined
      
      model.set('likeCountWithDefault', 10)
      
      expect(model.attributeWas("likeCountWithDefault")).toEqual 0

    test '#attributeChanged', ->
      expect(model.attributeChanged("likeCountWithDefault")).toEqual false
      
      model.set('likeCountWithDefault', 10)
      
      expect(model.attributeChanged("likeCountWithDefault")).toEqual true
      
    test '#has', ->
      expect(model.has('likeCountWithDefault')).toEqual true
      expect(model.has('somethingIDontHave')).toEqual false