class App.OperatorsTest extends Tower.Model
  @field "string", type: "String"
  @field "integer", type: "Integer"
  @field "float", type: "Float"
  @field "date", type: "Date"
  @field "object", type: "Object", default: {}
  @field "arrayString", type: ["String"], default: []
  @field "arrayObject", type: ["Object"], default: []

describe "Tower.Store.Operators", ->
  o = Tower.Store.Operators
  r = null
  t = null
  
  test 'eq', ->
    assert.isTrue o.eq(1, 1), '1 === 1'
    assert.isTrue o.eq(1, 1.0), '1 === 1.0'
    assert.isTrue o.eq(new Date, new Date), 'now === now'
    assert.isTrue o.eq(/asdf/, "/asdf/"), '/asdf/ === "/asdf/"'
    assert.isTrue o.eq("/asdf/", /asdf/), '"/asdf/" === /asdf/'
    assert.isTrue o.eq(null, null), 'null === null'
    assert.isTrue o.eq(undefined, undefined), 'undefined === undefined'
    assert.isTrue o.eq(0, 0), '0 === 0'
    
    assert.isFalse o.eq(null, undefined), 'null === undefined'
    assert.isFalse o.eq(undefined, null), 'undefined === null'
    assert.isFalse o.eq(0, null), '0 === null'
    assert.isFalse o.eq(0, undefined), '0 === undefined'
    assert.isFalse o.eq(1, '1'), '1 === "1"'
    assert.isFalse o.eq(1, 1.1), '1 === 1.1'
    assert.isFalse o.eq(new Date, _(3).days().ago().toDate()), 'now === ago'
    assert.isFalse o.eq(/asdf/, "asdf"), '/asdf/ === "asdf"'
    
  test 'ne', ->
    assert.isTrue o.ne(null, undefined), 'null === undefined'
    assert.isTrue o.ne(undefined, null), 'undefined === null'
    assert.isTrue o.ne(0, null), '0 === null'
    assert.isTrue o.ne(0, undefined), '0 === undefined'
    assert.isTrue o.ne(1, '1'), '1 === "1"'
    assert.isTrue o.ne(1, 1.1), '1 === 1.1'
    assert.isTrue o.ne(new Date, _(3).days().ago().toDate()), 'now === ago'
    assert.isTrue o.ne(/asdf/, "asdf"), '/asdf/ === "asdf"'
    
    assert.isFalse o.ne(1, 1), '1 === 1'
    assert.isFalse o.ne(1, 1.0), '1 === 1.0'
    assert.isFalse o.ne(new Date, new Date), 'now === now'
    assert.isFalse o.ne(/asdf/, "/asdf/"), '/asdf/ === "/asdf/"'
    assert.isFalse o.ne("/asdf/", /asdf/), '"/asdf/" === /asdf/'
    assert.isFalse o.ne(null, null), 'null === null'
    assert.isFalse o.ne(undefined, undefined), 'undefined === undefined'
    assert.isFalse o.ne(0, 0), '0 === 0'
      
  describe 'gte', ->
    test 'integer', ->
      assert.isTrue o.gte(2, 1), '2 >= 1'
      assert.isTrue o.gte(2, 2), '2 >= 2'
      assert.isTrue o.gte(2, 0), '2 >= 0'
      assert.isTrue o.gte(-1, -2), '-1 >= -2'
    
      assert.isFalse o.gte(-1, 0), '-1 !>= 0'
      assert.isFalse o.gte(2, undefined), '2 !>= undefined'
      assert.isFalse o.gte(2, null), '2 !>= null'
    
    test 'date', ->
      now = new Date
      ago = _(3).days().ago().toDate()
      
      assert.isTrue o.gte(now, ago), 'now >= 3.days.ago'
      assert.isTrue o.gte(now, now), 'now >= now'
      
      assert.isFalse o.gte(ago, now), 'ago !>= now'
    
  test 'gt', ->
    assert.isTrue o.gt(2, 1), '2 > 1'
    assert.isTrue o.gt(2, 0), '2 > 0'
    assert.isTrue o.gt(-1, -2), '-1 > -2'
  
    assert.isFalse o.gt(2, 2), '2 !> 2'
    assert.isFalse o.gt(-1, 0), '-1 !> 0'
    assert.isFalse o.gt(2, undefined), '2 !> undefined'
    assert.isFalse o.gt(2, null), '2 !>= null'
    
  test 'lte', ->
    assert.isTrue o.lte(2, 2), '2 <= 2'
    assert.isTrue o.lte(-1, 0), '-1 <= 0'

    assert.isFalse o.lte(2, 1), '2 !<= 1'
    assert.isFalse o.lte(2, 0), '2 !<= 0'
    assert.isFalse o.lte(-1, -2), '-1 !<= -2'
    assert.isFalse o.lte(2, undefined), '2 !<= undefined'
    assert.isFalse o.lte(2, null), '2 !<= null'
  
  test 'lt', ->
    assert.isTrue o.lt(-1, 0), '-1 < 0'
    assert.isTrue o.lt(0, 1), '0 < 1'
    assert.isTrue o.lt(1, 2), '1 < 2'

    assert.isFalse o.lt(2, 1), '2 !< 1'
    assert.isFalse o.lt(2, 0), '2 !< 0'
    assert.isFalse o.lt(-1, -2), '-1 !< -2'
    assert.isFalse o.lt(2, undefined), '2 !< undefined'
    assert.isFalse o.lt(2, null), '2 !< null'
    assert.isFalse o.lt(2, 2), '2 !< 2'
  
  test 'match', ->
    assert.isTrue o.match("asdf", "a")
    assert.isTrue o.match("asdf", /a/)
    
    assert.isFalse o.match("a", "asdf")
    assert.isFalse o.match("asdf", /A/)
    
  test 'notMatch', ->
    assert.isTrue o.notMatch("a", "asdf")
    assert.isTrue o.notMatch("asdf", /A/)
    
    assert.isFalse o.notMatch("asdf", "a")
    assert.isFalse o.notMatch("asdf", /a/)

  test 'anyIn', ->
    assert.isTrue o.anyIn(['ruby', 'javascript'], ["javascript"])
    assert.isTrue o.anyIn(['ruby', 'javascript'], ["javascript", "node"])
    assert.isTrue o.anyIn(['ruby', 'javascript'], ["node", "javascript"])
    assert.isTrue o.anyIn(['ruby', 'javascript'], 'javascript')
    
    assert.isFalse o.anyIn(['ruby', 'javascript'], [".net"])
    
  test 'matchIn', ->
    assert.isTrue o.matchIn([{a: 1, b: 3}], a: 1)
    assert.isTrue o.matchIn([{a: 1, b: 3}, 7, {b: 99}, {a: 11}], a: 1, b: $gt: 1)
    
    assert.isFalse o.matchIn([1], a: 1)
    assert.isFalse o.matchIn([{a: 2, b: 3}], a: 1)
    
    assert.isTrue o.matchIn([{a: 2, b: 3}], $or: [{a: 1}, {b: 3}])
    
  test 'exists', ->
    assert.isTrue o.exists(true)
    assert.isTrue o.exists(false)
    assert.isTrue o.exists(null)
    assert.isTrue o.exists(0)
    assert.isTrue o.exists(1)
    assert.isTrue o.exists(-1)
    assert.isTrue o.exists("")
    assert.isTrue o.exists("asdf")
    
    assert.isFalse o.exists(undefined)
    
  test 'size', ->
    assert.isTrue o.size(['a', 'b', 'c'], 3)
    
    assert.isFalse o.size([], 3)
    assert.isFalse o.size('asdf', 4), 'not array'
    
  #test 'notInAll', ->
  #  assert.isTrue o.notInAll(['ruby', 'javascript']), ['node']
  #  assert.isTrue o.notInAll(['ruby', 'javascript']), 'node'
  #  
  #  assert.isFalse o.notInAll(['ruby', 'javascript']), ['node', 'javascript']
  #  assert.isFalse o.notInAll(['ruby', 'javascript']), ['javascript']
  #  
  #test 'notInAny', ->
  #  assert.isTrue o.notIn(['ruby', 'javascript']), ['node']
  #  assert.isTrue o.notIn(['ruby', 'javascript']), 'node'
  #  assert.isTrue o.notIn(['ruby', 'javascript']), ['node', 'javascript']
  
  test 'operators.test(recordValue, operators)', ->
    assert.isTrue o.testValue(1, $eq: 1)
    assert.isTrue o.testValue(1, $neq: 0)
    assert.isTrue o.testValue(1, $gt: 0, $lt: 2)
    assert.isTrue o.testValue(1, $gt: 0, $lt: 1.1)
    assert.isTrue o.testValue(1, $gt: 0, $lte: 1)
    
    assert.isFalse o.testValue(1, $gt: 0, $lt: 1)
    
    assert.isTrue o.testValue('acmeblahcorp', $regex: /acme.*corp/i)
    assert.isTrue o.testValue('acme-corp', $regex: /acme.*corp/i, $nin: ['acmeblahcorp'])
    assert.isFalse o.testValue('acmeblahcorp', $regex: /acme.*corp/i, $nin: ['acmeblahcorp'])
    
  describe 'test record', ->
    beforeEach ->
      t = new Date
      
      r = new App.OperatorsTest
        string:       "a string"
        integer:      10
        float:        12.2
        date:         t
        object:
          one:    "-one-"
          two:    "-two-"
        arrayString:  ['a', 'b', 'c']
        arrayObject:  [
          {a: 1, b: 7}
        ]
      
    test 'eq', ->
      assert.isTrue o.test(r, string: 'a string')
      assert.isTrue o.test(r, integer: 10)
      assert.isTrue o.test(r, integer: 10.0)
      
      assert.isFalse o.test(r, integer: 20)
      
      assert.isTrue o.test(r, string: $eq: 'a string')
      assert.isTrue o.test(r, string: '==': 'a string')
      
    test 'neq', ->
      assert.isTrue o.test(r, string: $neq: 'string')
      assert.isTrue o.test(r, string: '!=': 'string')
      
    test 'match', ->
      assert.isTrue o.test(r, string: $match: 'string')
      assert.isTrue o.test(r, string: /string/)
      assert.isTrue o.test(r, string: /strin/)
      
      assert.isFalse o.test(r, string: /asdf/)
      
    test 'gte', ->
      assert.isTrue o.test(r, integer: $gte: 5)
      assert.isTrue o.test(r, integer: '>=': 10)
      
      assert.isFalse o.test(r, integer: '>=': 20)
      
    test 'gt', ->
      assert.isTrue o.test(r, integer: $gt: 5)
      assert.isTrue o.test(r, integer: '>': 7)
      
      assert.isFalse o.test(r, integer: '>': 10)
      assert.isFalse o.test(r, integer: '>': 20)
      
    test 'anyIn', ->
      assert.isTrue o.test(r, arrayString: $anyIn: ['b'])
      assert.isTrue o.test(r, arrayString: $any: ['b'])
      assert.isTrue o.test(r, arrayString: $anyIn: ['b', 'x'])
      
      assert.isFalse o.test(r, arrayString: $anyIn: ['x'])
      
    test 'or', ->
      assert.isTrue o.test(r, $or: [{string: 'a string'}, {integer: 10}]), 'both match'
      assert.isTrue o.test(r, $or: [{string: 'a string'}, {integer: 20}]), 'first matches'
      assert.isTrue o.test(r, $or: [{string: 'asdf'}, {integer: 10}]), 'last matches'
      
      assert.isFalse o.test(r, $or: [{string: 'asdf'}, {integer: 20}]), 'none match'
      
    test 'nor', ->  
      assert.isTrue o.test(r, $nor: [{string: 'asdf'}, {integer: 20}]), 'none match'
      
      assert.isFalse o.test(r, $nor: [{string: 'a string'}, {integer: 10}]), 'both match'
      assert.isFalse o.test(r, $nor: [{string: 'a string'}, {integer: 20}]), 'first matches'
      assert.isFalse o.test(r, $nor: [{string: 'asdf'}, {integer: 10}]), 'last matches'
      
    test 'array', ->
      assert.isTrue o.test(r, arrayString: $anyIn: ['b'])
      
      assert.isFalse o.test(r, arrayString: $anyIn: ['x'])
      
    test 'elemMatch', ->
      assert.isTrue o.test(r, arrayObject: $matchIn: {a: 1})
      assert.isTrue o.test(r, arrayObject: $elemMatch: {a: 1})
      assert.isTrue o.test(r, arrayObject: $matchIn: {a: $lte: 2})
      
      assert.isFalse o.test(r, arrayObject: $matchIn: {a: 2})
    
    # todo
    # test 'nested keys', ->
    #   assert.isTrue o.test(r, 'object.one': '-one-')
    #   
    #   assert.isFalse o.test(r, 'object.one': '-two-')
    #   
    #   assert.isTrue o.test(r, $or: [{'object.one': '-two-'}, {'object.two': '-two-'}])
    
    # todo 
    #test 'dot notation', ->
    #  assert.isTrue o.test(r, 'arrayObject.0.b': 7)
      
    describe 'select', ->
      records = null
      
      beforeEach ->
        i       = 1
        records = []
        while i <= 20
          records.push new App.OperatorsTest(string: "string #{i}", integer: i)
          i++
      
      test 'select', ->
        assert.equal 10, o.select(records, integer: '>': 10).length
        assert.equal 11, o.select(records, integer: '>=': 10).length
        assert.equal 9, o.select(records, integer: '<': 10).length
        assert.equal 10, o.select(records, integer: '<=': 10).length
        
        assert.equal 2, o.select(records, integer: '>=': 10, '<=': 11).length