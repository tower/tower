class App.BindableCursorTest extends Tower.Model
  @field "string", type: "String"
  @field "integer", type: "Integer"
  @field "float", type: "Float"
  @field "date", type: "Date"
  @field "object", type: "Object", default: {}
  @field "arrayString", type: ["String"], default: []
  @field "arrayObject", type: ["Object"], default: []

describe 'Tower.ModelCursor (bindable)', ->
  cursor = null
  
  beforeEach (done) ->
    App.BindableCursorTest.store(Tower.StoreMemory).constructor.clean =>
      cursor  = Tower.ModelCursor.make()# Tower.ModelCursor.create(content: Ember.A([]))
      cursor.make(model: App.BindableCursorTest)

      done()

  afterEach ->
    Tower.cursors = {}
    
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
      assert.equal cursor.length, 2
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
      assert.equal cursor.length, 1
      done()

    cursor.pushMatching(records)

  test 'list model fields it\'s watching', ->
    cursor.where(string: /string/)
    assert.deepEqual cursor.getPath('observableFields').sort(), ['string']

    cursor.desc('createdAt').propertyDidChange('observableFields')
    assert.deepEqual cursor.getPath('observableFields').sort(), ['createdAt', 'string']

    cursor.where(string: '!=': 'strings', '=~': /string/).propertyDidChange('observableFields')
    assert.deepEqual cursor.getPath('observableFields').sort(), ['createdAt', 'string']

  test 'Tower.cursors updates when cursor.observable() is called', ->
    assert.equal _.keys(Tower.cursors).length, 0
    cursor.where(string: /string/)
    cursor.observable()
    assert.equal _.keys(Tower.cursors).length, 2, '_.keys(Tower.cursors).length'
    assert.equal _.keys(Tower.cursors['BindableCursorTest']).length, 1, "Tower.cursors['BindableCursorTest'].length"
    assert.equal Tower.getCursor('BindableCursorTest.string'), cursor, "Tower.getCursor('BindableCursorTest.string')"

  test 'cursor observers when just record attributes are set', (done) ->
    cursor.where(string: /a s/ig).observable()

    cursor.refresh (error, records) =>
      assert.equal records.length, 0, '1'

      App.BindableCursorTest.create {string: 'a string'}, (error, record) =>
        cursor.refresh =>
          assert.equal cursor.length, 1, '2'

          # Commented out this functionality in attribute.coffee b/c not complete
          #record.set('string', 'new string')
          #
          #Ember.run.sync()
          #
          #assert.equal cursor.length, 0, '3'

          done()

  # It should probably keep track internally of the cursors that "should" be updated either way,
  # so you don't have to manually do it.
  test 'Tower.autoNotifyCursors = false', (done) ->
    Tower.autoNotifyCursors = false

    cursor.where(string: /a s/ig).observable()

    App.BindableCursorTest.create {string: 'a string'}, (error, record) =>
      cursor.refresh =>
        assert.equal cursor.length, 1

        record.set('string', 'new string')

        assert.equal cursor.length, 1

        Tower.notifyCursorFromPath(record.constructor.className() + '.' + 'string')

        assert.equal cursor.length, 0

        Tower.autoNotifyCursors = true

        done()

  #test 'cursor observers when records are created', (done) ->
  #  cursor.where(string: /a.* s/ig).observable()
  #
  #  cursor.refresh (error, records) =>
  #    assert.equal records.length, 0
  #
  #    App.BindableCursorTest.create {string: 'a string'}, =>
  #      cursor.refresh (error, records) =>
  #        assert.equal records.length, 1
  #
  #        App.BindableCursorTest.create {string: 'another string'}, =>
  #          cursor.refresh (error, records) =>
  #            assert.equal records.length, 2
  #            done()

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