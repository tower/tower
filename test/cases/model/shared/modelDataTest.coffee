record  = null
data    = null

class App.DataTest extends Tower.Model
  @field 'title'
  @field 'tags', type: 'Array'
  @field 'likes', type: 'Integer', default: 0
  
  @hasMany 'dataItemTests'
  
class App.DataItemTest extends Tower.Model
  @field 'title'
  
  @belongsTo 'dataTest'

describe 'Tower.ModelData', ->
  describe 'data', ->
    beforeEach ->
      record  = App.DataTest.build()
      
    test 'get path', ->
      record.set('something', 'random')
      assert.equal record.get('something'), 'random'
      
    test 'dynamicFields: false', ->
      assert.equal record.get('dynamicFields'), true
      record.set('dynamicFields', false)
      assert.equal record.get('dynamicFields'), false
      record.set('something', 'random')
      assert.equal record.get('something'), undefined
      
    test 'unsavedData', ->
      record.set('something', 'random')
      assert.deepEqual record.get('changes'), something: [undefined, 'random']
      
    test 'setting changed attribute back to undefined (isNew: false)', ->
      record.set('isNew', false)
      record.set('something', 'random')
      record.set('something', undefined)
      assert.deepEqual record.get('changes'), {}
    
    # This is not actually what you want. 
    #test 'setting association', ->
    #  items = [new App.DataItemTest]
    #  record.set('dataItemTests', items)
    #  assert.deepEqual record.get('dataItemTests'), items
    
    # @todo need to update associations to new api
    #test 'removing association', ->
    #  items = [new App.DataItemTest]
    #  record.set('dataItemTests', items)
    #  record.set('dataItemTests', undefined)
    #  
    #  assert.deepEqual record.get('changes'), {}
    #  #assert.deepEqual record.get('dataItemTests'), []
    #  
    #test 'getting association in changes hash', ->
    #  items = [new App.DataItemTest]
    #  record.set('dataItemTests', items)
    #  assert.deepEqual record.get('changes'), dataItemTests: items
    #  
    #  #record.push('dataItemTests', new App.DataItemTest)
    #  #assert.equal record.get('changes').dataItemTests.length, 2

    describe 'attribute modifiers', ->
      test 'set', ->
        record.set 'title', 'A Title'
        assert.equal 'A Title', record.get('title')
        assert.equal 'A Title', record.get('attributes').title
        assert.equal undefined, record.get('changedAttributes').title
        
        record.set 'title', undefined
        assert.equal undefined, record.get('title')
        assert.equal undefined, record.get('attributes').title
        assert.equal undefined, record.get('changedAttributes').title
###          
      test 'push', ->
        assert.deepEqual ["ruby"], data.push("tags", "ruby")
        data.push(tags: "javascript")
        assert.deepEqual ["ruby", "javascript"], data.get('tags')
        assert.deepEqual ["ruby", "javascript", "javascript"], data.push('tags', 'javascript')
        
        data.set $push: tags: 'node'
        assert.deepEqual ["ruby", "javascript", "javascript", 'node'], data.get('tags')

      test 'push undesirable', ->
        assert.deepEqual [["ruby"]], data.push("tags", ["ruby"])
        
      test 'pushEach', ->
        assert.deepEqual ["ruby"], data.pushEach("tags", ["ruby"])
        data.pushEach(tags: ["javascript"])
        assert.deepEqual ["ruby", "javascript"], data.get('tags')
        assert.deepEqual ["ruby", "javascript", "javascript"], data.pushEach('tags', 'javascript')
        
        data.set $pushEach: tags: ['node']
        assert.deepEqual ["ruby", "javascript", "javascript", 'node'], data.get('tags')
        
      test 'pushEach undesirable', ->
        assert.deepEqual [["ruby"]], data.pushEach("tags", [["ruby"]])
        
      test 'pull', ->
        data.pushEach("tags", ["ruby", "javascript", "node"])
        
        data.pull('tags', 'javascript')
        
        assert.deepEqual ['ruby', 'node'], data.get('tags')
        
        data.pull(tags: 'ruby')
        
        assert.deepEqual ['node'], data.get('tags')
        
      test 'pullEach', ->
        data.pushEach("tags", ["ruby", "javascript", "node"])
        
        data.pullEach('tags', 'javascript')
        
        assert.deepEqual ['ruby', 'node'], data.get('tags')
        
        data.pullEach(tags: ['ruby', 'node'])
        
        assert.deepEqual [], data.get('tags')
        
      test 'add', ->
        assert.deepEqual ["ruby"], data.add("tags", "ruby")
        data.add(tags: "javascript")
        assert.deepEqual ["ruby", "javascript"], data.get('tags')
        assert.deepEqual ["ruby", "javascript"], data.add('tags', 'javascript')
        
        data.set $add: tags: 'node'
        assert.deepEqual ["ruby", "javascript", 'node'], data.get('tags')
        
      test 'addEach', ->
        assert.deepEqual ["ruby"], data.addEach("tags", "ruby")
        data.addEach(tags: ["javascript"])
        assert.deepEqual ["ruby", "javascript"], data.get('tags')
        assert.deepEqual ["ruby", "javascript"], data.addEach('tags', ['javascript', 'ruby'])
        
        data.set $addEach: tags: ['node', 'node']
        assert.deepEqual ["ruby", "javascript", 'node'], data.get('tags')
        
      test 'inc', ->
        assert.equal 1, data.inc('likes', 1)
        assert.equal 10, data.inc('likes', 9)
        data.inc(likes: 2)
        assert.equal 12, data.get('likes')
        
        data.set $inc: likes: 3
        assert.equal 15, data.get('likes')
        
      test 'dec', ->
        assert.equal -1, data.inc('likes', -1)
        assert.equal -10, data.inc('likes', -9)
        data.inc(likes: -2)
        assert.equal -12, data.get('likes')
        
        data.set $inc: likes: -3
        assert.equal -15, data.get('likes')
        
      test 'all together', ->
        data.set
          $addEach: tags: ['ruby', 'javascript']
          $inc:     likes: 3
          
        assert.deepEqual data.get('tags'), ['ruby', 'javascript']
        assert.equal data.get('likes'), 3
        
    describe 'associations', ->
      test 'push', ->
        data.push 'dataItemTests', new App.DataItemTest(title: "An item")
        
        assert.equal data.get('dataItemTests')[0].get('title'), 'An item'
        
      test 'add', ->
        data.add 'dataItemTests', new App.DataItemTest(title: "An item")
        data.add 'dataItemTests', new App.DataItemTest(title: "An item")
        
        assert.equal data.get('dataItemTests').length, 2
        
    describe 'state', ->
      beforeEach ->
        data.set
          $addEach: tags: ['ruby', 'javascript']
          $inc:     likes: 3
          
      test 'rollback', ->
        data.rollback()
        assert.deepEqual data.unsavedData, {}
    
  describe 'new, unpersisted record', ->
    beforeEach ->
      record = new App.DataTest
      
    test 'initialize', ->
      assert.ok record.get('data') instanceof Tower.ModelData
      
  describe 'persistent record', ->
    beforeEach (done) ->
      App.DataTest.create title: "Data", (error, r) =>
        record = record
        done()
        
    #test 'set', ->
    #  console.log record.get('data')
###
describe 'changes', ->
  beforeEach ->
    record  = App.DataTest.build()

  test 'changes', ->
    assert.deepEqual record.get('changes'), {}
    assert.deepEqual record.get('changedAttributes'), {}
    assert.deepEqual record.get('changed'), []
    
    record.set('title', 'title!')
    
    assert.deepEqual record.get('changedAttributes'), {title: undefined}
    assert.deepEqual record.get('changes'), {title: [ undefined, 'title!' ]}
    assert.deepEqual record.get('changed'), ['title']

  test 'changes from record', ->
    assert.deepEqual record.get('changes'), {}

    record.set('title', 'title!')
    
    assert.deepEqual record.get('changes'), {title: [ undefined, 'title!' ]}

  test 'data.resetAttribute', ->
    # hack fake initial value
    record.get('attributes').title = 'old title'
    record.get('changedAttributes').title = 'old title'

    record.set('title', 'title!')
    assert.equal record.get('title'), 'title!'
    record.resetAttribute('title')
    assert.equal record.get('title'), 'old title'
    assert.equal record.get('changedAttributes').title, undefined

  test 'data.previousChanges', ->
    assert.deepEqual record.get('previousChanges'), undefined
    record.set('title', 'title!')
    record.commit()
    assert.deepEqual record.get('previousChanges'), {title: [ undefined, 'title!' ]}

  test 'data.attributesForUpdate', ->
    record.set('title', 'title!')
    assert.deepEqual record.attributeKeysForUpdate(), ['title']
    assert.deepEqual record.attributesForUpdate(), {title: 'title!'}

  test '_updateChangedAttribute', ->
    now   = new Date
    now2  = new Date

    record._updateChangedAttribute('string', 'string!')
    record._updateChangedAttribute('array', [10])
    record._updateChangedAttribute('object', {a: 1})
    record._updateChangedAttribute('date', now)

    assert.deepEqual record.get('changedAttributes'), { string: undefined, array: undefined, object: undefined, date: undefined }

    record._updateChangedAttribute('string', undefined)
    record._updateChangedAttribute('array', undefined)
    record._updateChangedAttribute('object', undefined)
    record._updateChangedAttribute('date', undefined)

    assert.deepEqual record.get('changedAttributes'), { }

    _.extend(record.get('attributes'), string: 'string!', array: [10], object: {a: 1}, date: now)

    record._updateChangedAttribute('string', 'string!')
    record._updateChangedAttribute('array', [10])
    record._updateChangedAttribute('object', {a: 1})
    record._updateChangedAttribute('date', now2)

    # sets it back to how it was just after loading from the database
    assert.deepEqual record.get('changedAttributes'), { }
