record  = null
data    = null

class App.DataTest extends Tower.Model
  @field "title"
  @field "tags", type: "Array"
  @field "likes", type: "Integer", default: 0
  
  @hasMany "dataItemTests"
  
class App.DataItemTest extends Tower.Model
  @field "title"
  
  @belongsTo "dataTest"

describeWith = (store) ->
  describe "Tower.Model.Data (Tower.Store.#{store.className()})", ->
    describe 'data', ->
      beforeEach ->
        record  = App.DataTest.build()
        data    = record.get('data')#new Tower.Model.Data(record)
        
      test '#record', ->
        assert.deepEqual record, data.record
        
      test 'get path', ->
        data.set('something', 'random')
        assert.equal record.get('something'), 'random'
        
      #test 'get nested path', ->
      #  data.set('something': {})
      #  data.set('something.deeply': {})
      #  data.set('something.deeply.nested': 'random')
      #  assert.equal record.get('something.deeply.nested'), 'random'
        
      test 'dynamicFields: false', ->
        assert.equal record.get('dynamicFields'), true
        record.set('dynamicFields', false)
        assert.equal record.get('dynamicFields'), false
        record.set('something', 'random')
        assert.equal record.get('something'), undefined
        
      test 'unsavedData', ->
        record.set('something', 'random')
        assert.deepEqual record.get('changes'), something: 'random'
        
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
          data.set 'title', 'A Title'
          assert.equal 'A Title', data.get('title')
          assert.equal 'A Title', data.attributes.title
          assert.equal undefined, data.changedAttributes.title
          
          data.set 'title', undefined
          assert.equal undefined, data.get('title')
          assert.equal undefined, data.attributes.title
          assert.equal undefined, data.changedAttributes.title
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
        assert.ok record.get('data') instanceof Tower.Model.Data
        
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
      record  = App.DataTest.new()
      data    = record.get('data')#new Tower.Model.Data(record)

    test 'changes', ->
      assert.deepEqual data.changes(), {}
      assert.deepEqual data.changedAttributes, {}
      assert.deepEqual data.changed(), []
      
      data.set('title', 'title!')
      
      assert.deepEqual data.changedAttributes, {title: undefined}
      assert.deepEqual data.changes(), {title: [ undefined, 'title!' ]}
      assert.deepEqual data.changed(), ['title']

    test 'changes from record', ->
      assert.deepEqual record.get('changesHash'), {}

      data.set('title', 'title!')
      
      assert.deepEqual record.get('changesHash'), {title: [ undefined, 'title!' ]}

    test 'data.resetAttribute', ->
      # hack fake initial value
      data.changedAttributes.title = 'old title'
      data.set('title', 'title!')
      assert.equal data.get('title'), 'title!'
      data.resetAttribute('title')
      assert.equal data.get('title'), 'old title'
      assert.equal data.changedAttributes.title, undefined

    test 'data.isReadOnlyAttribute', ->
      assert.isFalse data.isReadOnlyAttribute('title')

    test 'data.previousChanges', ->
      assert.deepEqual data.previousChanges, undefined
      data.set('title', 'title!')
      data.commit()
      assert.deepEqual data.previousChanges, {title: [ undefined, 'title!' ]}

    test 'data.attributesForUpdate', ->
      data.set('title', 'title!')
      assert.deepEqual data.attributeKeysForUpdate(), ['title']
      assert.deepEqual data.attributesForUpdate(), {title: 'title!'}

    test '_updateChangedAttribute', ->
      now   = new Date
      now2  = new Date

      data._updateChangedAttribute('string', 'string!')
      data._updateChangedAttribute('array', [10])
      data._updateChangedAttribute('object', {a: 1})
      data._updateChangedAttribute('date', now)

      assert.deepEqual data.changedAttributes, { string: undefined, array: undefined, object: undefined, date: undefined }

      data._updateChangedAttribute('string', undefined)
      data._updateChangedAttribute('array', undefined)
      data._updateChangedAttribute('object', undefined)
      data._updateChangedAttribute('date', undefined)

      assert.deepEqual data.changedAttributes, { }

      data.attributes = string: 'string!', array: [10], object: {a: 1}, date: now

      data._updateChangedAttribute('string', 'string!')
      data._updateChangedAttribute('array', [10])
      data._updateChangedAttribute('object', {a: 1})
      data._updateChangedAttribute('date', now2)

      # sets it back to how it was just after loading from the database
      assert.deepEqual data.changedAttributes, { }


describeWith(Tower.Store.Memory)
###
if Tower.client
  describeWith(Tower.Store.Ajax)
else
  describeWith(Tower.Store.Mongodb)
###