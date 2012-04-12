model = null

describe 'Tower.Model.Dirty', ->
  beforeEach ->
    model = new App.BaseModel
    
  test '#changes', ->
    assert.isObject model.changes
    
    model.set('likeCountWithDefault', 10)
    
    assert.deepEqual model.changes,
      before:
        likeCountWithDefault: 0
      after:
        $set:
          likeCountWithDefault: 10
      likeCountWithDefault: [0, 10]
    
  test '#attributeWas', ->
    assert.equal model.attributeWas("likeCountWithDefault"), undefined
    
    model.set('likeCountWithDefault', 10)
    
    assert.equal model.attributeWas("likeCountWithDefault"), 0

  test '#attributeChanged', ->
    assert.equal model.attributeChanged("likeCountWithDefault"), false
    
    model.set('likeCountWithDefault', 10)
    
    assert.equal model.attributeChanged("likeCountWithDefault"), true
  
  test '$set', ->
    model.set
      title: "A Title!"
      $push:
        tags: "javascript"
      $inc:
        likeCount: 2
    
    assert.equal model.get("title"), "A Title!"
    assert.equal model.get("likeCount"), 2
    assert.deepEqual model.get("tags"), ["javascript"]
    
    assert.deepEqual model.changes,
      before: 
        title:     null
        tags:      []
        likeCount: 0
      after: 
        $set:
          title: 'A Title!'
        $push:
          tags: ["javascript"]
        $inc:
          likeCount: 2
      title: [undefined, 'A Title!']    
    
    model.set
      $set:
        title: "Another Title!"
      $push:
        tags: "javascript"
      $inc:
        likeCount: 2
    
    assert.equal model.get("title"), "Another Title!"
    assert.equal model.get("likeCount"), 4
    assert.deepEqual model.get("tags"), ["javascript", "javascript"]
    
    assert.deepEqual model.changes,
      before: 
        title:     null
        tags:      []
        likeCount: 0
      after: 
        $set:
          title: 'Another Title!'
        $push:
          tags: ["javascript", "javascript"]
        $inc:
          likeCount: 4
      title: ['A Title!', 'Another Title!']
          
  #describe 'operations', ->
  #  test 'operation', ->
  #    assert.deepEqual model.operations, []
  #    model.set tags: ["ruby"]
  #    model.set tags: ["javascript"]
  #    model.push tags: "ruby"
  #    model.inc likeCount: 2
  #    
  #    assert.equal model.operationIndex, 4
  #    
  #    assert.deepEqual model.operations, [
  #      {$set: tags: ["ruby"]}, 
  #      {$set: tags: ["javascript"]}, 
  #      {$push: tags: "ruby"}, 
  #      {$inc: {likeCount: 2}, $before: {likeCount: 0}, $after: {likeCount: 2}}
  #    ]
  #    
  #    assert.equal model.get("likeCount"), 2      
  #    model.undo()
  #    assert.equal model.get("likeCount"), 0      
  #    model.redo()
  #    assert.equal model.get("likeCount"), 2      
  #    model.undo()
  #    assert.equal model.get("likeCount"), 0      
  #    model.inc likeCount: 5
  #    assert.equal model.get("likeCount"), 5
  #    
  #    assert.deepEqual model.operations, [
  #      {$set: tags: ["ruby"]}, 
  #      {$set: tags: ["javascript"]}, 
  #      {$push: tags: "ruby"}, 
  #      {$inc: {likeCount: 5}, $before: {likeCount: 0}, $after: {likeCount: 5}}
  #    ]
      
      