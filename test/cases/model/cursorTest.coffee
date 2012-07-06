scope     = null
cursor    = null

class App.CursorTest extends Tower.Model
  @field "string", type: "String"
  @field "integer", type: "Integer"
  @field "float", type: "Float"
  @field "date", type: "Date"
  @field "object", type: "Object", default: {}
  @field "arrayString", type: ["String"], default: []
  @field "arrayObject", type: ["Object"], default: []

describe 'Tower.Model.Cursor', ->
  beforeEach ->
    cursor = Tower.Model.Cursor.make()
    cursor.make()
    
  afterEach ->
    cursor = null
  
  describe '#where', ->
    it '`$in: [1, 2, 3]`', ->
      cursor.where id: $in: [1, 2, 3]
      
      assert.deepEqual cursor.conditions(), id: { '$in': [1, 2, 3] }
      
    it '2 parts: `$in: [1, 2, 3], $in: [4, 5, 6]`', ->
      cursor.where id: $in: [1, 2, 3]
      cursor.where id: $in: [4, 5, 6]
      
      assert.deepEqual cursor.conditions(), id: { '$in': [1, 2, 3, 4, 5, 6] }
      
    it '2 different keys: `$in: [1, 2, 3], $nin: [4, 5, 6]`', ->
      cursor.where id: $in: [1, 2, 3]
      cursor.where id: $nin: [4, 5, 6]
      
      assert.deepEqual cursor.conditions(), id: { '$in': [1, 2, 3], '$nin': [4, 5, 6] }
      
    test 'before: `id: $in: [1, 2, 3]`, after: `id: 10`', ->
      cursor.where id: $in: [1, 2, 3]
      cursor.where id: 10
      
      assert.deepEqual cursor.conditions(), id: 10
      
    test 'before: `id: 10`, after: `id: $in: [1, 2, 3]`, ', ->  
      cursor.where id: 10
      cursor.where id: $in: [1, 2, 3]
      
      assert.deepEqual cursor.conditions(), id: { '$in': [1, 2, 3] }

  describe '#order', ->
    test 'sort by one property', ->
      cursor.order "firstName", "asc"
      
      assert.deepEqual cursor.conditions(), {}
      assert.deepEqual cursor.get('order'), [[ 'firstName', 'asc' ]]
  
    test 'sort by two properties', ->
      cursor.order "firstName", "asc"
      cursor.order "lastName", "desc"
      
      assert.deepEqual cursor.conditions(), {}
      assert.deepEqual cursor.get('order'), [[ 'firstName', 'asc' ], [ 'lastName', 'desc' ]]

    test 'sort default equals `asc`', ->
      cursor.order "firstName"
      
      assert.deepEqual cursor.conditions(), {}
      assert.deepEqual cursor.get('order'), [[ 'firstName', 'asc' ]]
      
  describe '#limit', ->
    it 'should limit', ->
      cursor.limit 20
      
      assert.deepEqual cursor.conditions(), {}
      assert.deepEqual cursor.get('limit'), 20
      
    it 'should override limit', ->
      cursor.limit 20
      cursor.limit 100

      assert.deepEqual cursor.conditions(), {}
      assert.deepEqual cursor.get('limit'), 100
      
  describe '#offset', ->
    it 'should offset', ->
      cursor.offset 20
      
      assert.deepEqual cursor.conditions(), {}
      assert.deepEqual cursor.get('offset'), 20
      
    it 'should override offset', ->
      cursor.offset 20
      cursor.offset 100

      assert.deepEqual cursor.conditions(), {}
      assert.deepEqual cursor.get('offset'), 100
      
  describe '#paginate', ->
    test 'page', ->
      cursor.page(20)
      assert.deepEqual cursor.conditions(), {}
      assert.deepEqual cursor.get('offset'), 380
      
  describe 'integrated queries', ->
    test 'query, sort, and pagination', ->
      cursor.where id: $in: [1, 2, 3]
      cursor.where id: $in: [4, 5, 6]
      cursor.where name: "!~": /[a-z]/
      cursor.where name: "=~": /[0-9]/
      cursor.order "name", "asc"
      cursor.limit(20)
      cursor.page(2)
      
      # this doesn't work in node 0.4 b/c regular expressions aren't "equal" so to speak
      # assert.deepEqual cursor.conditions(), { id: { '$in': [1, 2, 3, 4, 5, 6] }, name: { '!~': /[a-z]/, '=~': /[0-9]/ } }
      conditions = cursor.conditions()
      assert.deepEqual conditions.id, { '$in': [1, 2, 3, 4, 5, 6] }
      assert.deepEqual conditions.name['!~'].toString(), /[a-z]/.toString()
      assert.deepEqual conditions.name['=~'].toString(), /[0-9]/.toString()
      
      assert.deepEqual cursor.get('limit'), 20
      assert.deepEqual cursor.get('offset'), 20
      assert.deepEqual cursor.get('order'), [["name", "asc"]]
      
  test '#clone', ->
    assert.ok cursor.clone()

  test '#compile', ->
    
    
  test '#allIn', ->
    
  describe '#test', ->
    beforeEach ->
      cursor  = Tower.Model.Cursor.create()
      cursor.make(model: App.CursorTest)
      
    test 'eq', ->
      cursor.where(string: 'a string')
      
      assert.isTrue cursor.test(App.CursorTest.new(string: 'a string'))
      
      assert.isFalse cursor.test(new App.CursorTest(string: 'a strin'))
      
    test 'neq', ->
      cursor.where(string: '!=': 'a string')
      
      assert.isFalse cursor.test(new App.CursorTest(string: 'a string'))
      
      assert.isTrue cursor.test(new App.CursorTest(string: 'a strin'))
      
    test '$or', ->
      cursor.where($or: [{string: '==': 'a string'}, {integer: '<': 10}])
      
      assert.isTrue cursor.test(new App.CursorTest(string: 'a string'))
      assert.isTrue cursor.test(new App.CursorTest(string: 'a string', integer: 9))
      assert.isTrue cursor.test(new App.CursorTest(string: 'a strin', integer: 9))
      
      assert.isFalse cursor.test(new App.CursorTest(string: 'a strin'))
      assert.isFalse cursor.test(new App.CursorTest(string: 'a strin', integer: 10))
      
  describe '#addIds', ->
    test 'addIds', ->
      cursor.addIds(1, 2, 3)
      
  describe '#create', ->
    beforeEach ->
      cursor  = Tower.Model.Cursor.create()
      cursor.make(model: App.CursorTest)
      
    test 'create()', (done) ->
      cursor.insert (error, result) =>
        assert.ok result instanceof Tower.Model, 'result instanceof Tower.Model'
        assert.equal undefined, result.get('integer')
        done()
        
    test 'create(integer: 10)', (done) ->
      cursor.addData(integer: 10)
      
      cursor.insert (error, result) =>
        assert.ok result instanceof Tower.Model, 'result instanceof Tower.Model'
        assert.equal 10, result.get('integer')
        done()