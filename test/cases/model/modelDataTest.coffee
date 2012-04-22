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
        record  = new App.DataTest(data: null)
        data    = new Tower.Model.Data(record)
        
      test '#record', ->
        assert.deepEqual record, data.record
        
      test '#savedData', ->
        assert.deepEqual {}, data.savedData
        
      test '#unsavedData', ->
        assert.deepEqual {}, data.unsavedData
        
      test '#relations', ->
        assert.deepEqual {}, data.relations
        
      test '#attachments', ->
        assert.deepEqual {}, data.attachments
        
      describe 'attribute modifiers', ->
        test 'set', ->
          data.set 'title', 'A Title'
          assert.equal 'A Title', data.get('title')
          assert.equal 'A Title', data.unsavedData.title
          assert.equal undefined, data.savedData.title
          
          data.set 'title', undefined
          assert.equal undefined, data.get('title')
          assert.equal undefined, data.unsavedData.title
          assert.equal undefined, data.savedData.title
          
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
    
describeWith(Tower.Store.Memory)

if Tower.client
  describeWith(Tower.Store.Ajax)
else
  describeWith(Tower.Store.MongoDB)
