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
    cursor  = Tower.Model.Cursor.create(model: App.BindableCursorTest, content: [])
    
  test 'addObserver', (done) ->
    record = new App.BindableCursorTest
    
    cursor.addObserver "length", (_, key, value) ->
      assert.ok value, "addObserver length called"
      done()
    
    cursor.addObject(record)
    
    assert.equal cursor.indexOf(record), 0
    
  test 'pushMatching (blank records)', (done) ->
    records = [
      new App.BindableCursorTest
      new App.BindableCursorTest
    ]
    
    cursor.addObserver "length", (_, key, value) ->
      assert.ok value, "addObserver length called"
      assert.equal cursor.content.length, 2
      done()
      
    cursor.pushMatching(records)
    
  test 'pushMatching (select 1 of 2)', (done) ->
    records = [
      new App.BindableCursorTest
      new App.BindableCursorTest(string: 'a string')
    ]
    
    cursor.where(string: /string/)

    cursor.addObserver "length", (_, key, value) ->
      assert.ok value, "addObserver length called"
      assert.equal cursor.content.length, 1
      done()

    cursor.pushMatching(records)