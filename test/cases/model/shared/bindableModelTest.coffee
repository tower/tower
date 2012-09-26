class App.BindableTest extends Tower.Model
  @field 'string'
  @field 'integer', type: 'Integer'
  @field 'date', type: 'Date'

describe 'Tower.Model (bindable)', ->
  record  = null
  
  beforeEach ->
    record = App.BindableTest.build()
    
  test 'string', (done) ->
    record.addObserver 'string', (sender, key, value, rev) ->
      assert.equal 'abc', record.get('string')
      done()
    
    Ember.run ->
      record.set 'string', 'abc'
    
  test 'integer', (done) ->
    record.addObserver 'integer', (sender, key) ->
      assert.equal 10, record.get('integer')
      done()

    record.set 'integer', 10
  
  test 'date', (done) ->
    now = new Date
    
    record.addObserver 'date', (sender, key) ->
      assert.equal now.getTime(), record.get('date').getTime()
      done()

    record.set 'date', now