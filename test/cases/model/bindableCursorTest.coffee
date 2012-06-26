class App.BindableCursorTest extends Tower.Model
  @field "string", type: "String"
  @field "integer", type: "Integer"
  @field "float", type: "Float"
  @field "date", type: "Date"
  @field "object", type: "Object", default: {}
  @field "arrayString", type: ["String"], default: []
  @field "arrayObject", type: ["Object"], default: []

describe 'Tower.Model.Cursor (bindable)', ->
  cursor = null
  
  beforeEach ->
    cursor  = Tower.Model.Cursor.create(content: Ember.A([]))
    cursor.make(model: App.BindableCursorTest)
    
  test 'addObserver', (done) ->
    record = App.BindableCursorTest.new()
    
    cursor.addObserver "length", (_, key, value) ->
      assert.ok value, "addObserver length called"
      done()
    
    cursor.addObjects([record])
    
    assert.equal cursor.indexOf(record), 0

  test 'pushMatching (blank records)', (done) ->
    records = [
      App.BindableCursorTest.build()
      App.BindableCursorTest.build()
    ]
    
    cursor.addObserver "length", (_, key, value) ->
      assert.ok value, "addObserver length called"
      assert.equal cursor.content.length, 2
      done()

    cursor.pushMatching(records)
    
  test 'pushMatching (select 1 of 2)', (done) ->
    records = [
      App.BindableCursorTest.build()
      App.BindableCursorTest.build(string: 'a string')
    ]
    
    cursor.where(string: /string/)

    cursor.addObserver "length", (_, key, value) ->
      assert.ok value, "addObserver length called"
      assert.equal cursor.content.length, 1
      done()

    cursor.pushMatching(records)

  ###
  test 'sort', (done) ->
    records = [
      App.BindableCursorTest.build(string: 'ZZZ')
      App.BindableCursorTest.build(string: 'BBB')
      App.BindableCursorTest.build(string: 'AAA')
    ]

    cursor.addObserver "content", (_, key, value) ->
      assert.deepEqual cursor.getEach('string'), ['AAA', 'BBB', 'ZZZ']
      done()

    cursor.pushMatching(records)
    cursor.commit()
  ###