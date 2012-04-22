class App.BindableTest extends Tower.Model
  @field 'string'
  @field 'integer', type: 'Integer'
  @field 'date', type: 'Date'

describe 'Tower.Model (bindable)', ->
  record  = null
  
  beforeEach ->
    record = new App.BindableTest
    
  test 'string', (done) ->
    record.addObserver 'string', (o, key, value) ->
      assert.equal 'abc', value
      assert.equal 'abc', record.get('string')
      assert.equal 'abc', record.get('data').unsavedData.string
      done()
      
    record.set 'string', 'abc'
    
  test 'integer', (done) ->
    record.addObserver 'integer', (o, key, value) ->
      assert.equal 10, value
      assert.equal 10, record.get('integer')
      assert.equal 10, record.get('data').unsavedData.integer
      done()

    record.set 'integer', 10
  
  test 'date', (done) ->
    now = new Date
    
    record.addObserver 'date', (o, key, value) ->
      assert.equal now.getTime(), value.getTime()
      assert.equal now.getTime(), record.get('date').getTime()
      assert.equal now.getTime(), record.get('data').unsavedData.date.getTime()
      done()

    record.set 'date', now