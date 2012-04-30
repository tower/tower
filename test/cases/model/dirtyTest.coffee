model = null

describe 'Tower.Model.Dirty', ->
  beforeEach ->
    model = App.BaseModel.new()
    
  test '#changes', ->
    assert.isObject model.get('changes')
    
    model.set('likeCountWithDefault', 10)
    
    assert.deepEqual model.get('data').savedData.likeCountWithDefault, undefined
    assert.deepEqual model.get('data').unsavedData.likeCountWithDefault, 10
    
  test '#attributeWas', ->
    assert.equal model.attributeWas("likeCountWithDefault"), undefined
    
    model.set('likeCountWithDefault', 10)
    
    assert.equal model.attributeWas("likeCountWithDefault"), undefined

  test '#attributeChanged', ->
    assert.equal model.attributeChanged("likeCountWithDefault"), false
    
    model.set('likeCountWithDefault', 10)
    
    assert.equal model.attributeChanged("likeCountWithDefault"), true
  
  test '$set', ->
    model.setProperties
      title: "A Title!"
      $push:
        tags: "javascript"
      $inc:
        likeCount: 2
    
    assert.equal model.get("title"), "A Title!"
    assert.equal model.get("likeCount"), 2
    assert.deepEqual model.get("tags"), ["javascript"]