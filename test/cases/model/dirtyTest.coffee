model = null

describe 'Tower.Model.Dirty', ->
  return # @todo rolling back for the moment
  testBlock = ->
    test '#changes', ->
      assert.isObject model.get('changes')
      
      model.set('likeCountWithDefault', 10)
      
      assert.deepEqual model.get('data').changedAttributes.likeCountWithDefault, 0
      assert.deepEqual model.get('data').attributes.likeCountWithDefault, 10
      
    test '#attributeWas', ->
      assert.equal model.attributeWas("likeCountWithDefault"), undefined
      
      model.set('likeCountWithDefault', 10)
      
      assert.equal model.attributeWas("likeCountWithDefault"), 0

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

    test 'changedAttributes', ->
      assert.ok model.get('changedAttributes')

    ###
    test 'record.get("attributes") should include attributes with defaults', ->
      attributes = model.get('attributes')
      delete attributes.id
      assert.deepEqual attributes,
        likeCountWithoutDefault: undefined,
        likeCountWithDefault: 0,
        tags: [],
        title: undefined,#'ABC',
        nestedModels: [],
        favorite: false,
        likeCount: 0,
        custom: undefined,
        a1: undefined,
        a2: undefined,
        a3: undefined,
        a4: undefined,
        a5: undefined,
        a6: undefined,
        o1: undefined,
        o2: undefined
    ###
  
  describe 'new model', ->
    beforeEach ->
      model = App.BaseModel.build()
    
    testBlock()

    ###
    test 'attributeKeysForCreate should only return keys for attributes with defaults', ->
      assert.deepEqual model.attributeKeysForCreate(), [ 
        'likeCountWithDefault',
        'tags',
        'nestedModels',
        'favorite',
        'likeCount' 
      ]

    test 'dirtyAttributes on new record should only be ones with defaults', ->
      assert.deepEqual model.get('dirtyAttributes'),
        likeCountWithDefault: 0,
        tags: [],
        nestedModels: [],
        favorite: false,
        likeCount: 0
    ###

  describe 'persistent model', ->
    beforeEach (done) ->
      App.BaseModel.create (error, r) =>
        model = r
        done()
    
    testBlock()

    test 'when you save a record that it saves default attributes'
###    
    test 'default attributes', ->
      assert.deepEqual App.BaseModel._defaultAttributes(), 
        id: undefined,
        likeCountWithoutDefault: undefined,
        likeCountWithDefault: 0,
        tags: [],
        title: undefined,
        nestedModels: [],
        favorite: false,
        likeCount: 0,
        custom: undefined,
        a1: undefined,
        a2: undefined,
        a3: undefined,
        a4: undefined,
        a5: undefined,
        a6: undefined,
        o1: undefined,
        o2: undefined
###