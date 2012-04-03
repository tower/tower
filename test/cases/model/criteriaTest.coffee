require '../../config'

scope     = null
criteria  = null

describe 'Tower.Model.Criteria', ->
  beforeEach ->
    criteria = new Tower.Model.Criteria
    
  afterEach ->
    criteria = null
  
  describe '#where', ->
    it '`$in: [1, 2, 3]`', ->
      criteria.where id: $in: [1, 2, 3]
      
      assert.deepEqual criteria.conditions(), id: { '$in': [1, 2, 3] }
      
    it '2 parts: `$in: [1, 2, 3], $in: [4, 5, 6]`', ->
      criteria.where id: $in: [1, 2, 3]
      criteria.where id: $in: [4, 5, 6]
      
      assert.deepEqual criteria.conditions(), id: { '$in': [1, 2, 3, 4, 5, 6] }
      
    it '2 different keys: `$in: [1, 2, 3], $nin: [4, 5, 6]`', ->
      criteria.where id: $in: [1, 2, 3]
      criteria.where id: $nin: [4, 5, 6]
      
      assert.deepEqual criteria.conditions(), id: { '$in': [1, 2, 3], '$nin': [4, 5, 6] }
      
    test 'before: `id: $in: [1, 2, 3]`, after: `id: 10`', ->
      criteria.where id: $in: [1, 2, 3]
      criteria.where id: 10
      
      assert.deepEqual criteria.conditions(), id: 10
      
    test 'before: `id: 10`, after: `id: $in: [1, 2, 3]`, ', ->  
      criteria.where id: 10
      criteria.where id: $in: [1, 2, 3]
      
      assert.deepEqual criteria.conditions(), id: { '$in': [1, 2, 3] }

  describe '#order', ->
    test 'sort by one property', ->
      criteria.order "firstName", "asc"
      
      assert.deepEqual criteria.conditions(), {}
      assert.deepEqual criteria.get('order'), [[ 'firstName', 'asc' ]]
  
    test 'sort by two properties', ->
      criteria.order "firstName", "asc"
      criteria.order "lastName", "desc"
      
      assert.deepEqual criteria.conditions(), {}
      assert.deepEqual criteria.get('order'), [[ 'firstName', 'asc' ], [ 'lastName', 'desc' ]]

    test 'sort default equals `asc`', ->
      criteria.order "firstName"
      
      assert.deepEqual criteria.conditions(), {}
      assert.deepEqual criteria.get('order'), [[ 'firstName', 'asc' ]]
      
  describe '#limit', ->
    it 'should limit', ->
      criteria.limit 20
      
      assert.deepEqual criteria.conditions(), {}
      assert.deepEqual criteria.get('limit'), 20
      
    it 'should override limit', ->
      criteria.limit 20
      criteria.limit 100

      assert.deepEqual criteria.conditions(), {}
      assert.deepEqual criteria.get('limit'), 100
      
  describe '#offset', ->
    it 'should offset', ->
      criteria.offset 20
      
      assert.deepEqual criteria.conditions(), {}
      assert.deepEqual criteria.get('offset'), 20
      
    it 'should override offset', ->
      criteria.offset 20
      criteria.offset 100

      assert.deepEqual criteria.conditions(), {}
      assert.deepEqual criteria.get('offset'), 100
      
  describe '#paginate', ->
    test 'pagination', ->
      criteria.paginate perPage: 20, page: 20
      
      assert.deepEqual criteria.conditions(), {}
      assert.deepEqual criteria.get('limit'), 20
      assert.deepEqual criteria.get('offset'), 380
      
    test 'override pagination', ->
      criteria.paginate perPage: 20, page: 20
      criteria.paginate perPage: 20, page: 2
      
      assert.deepEqual criteria.conditions(), {}
      assert.deepEqual criteria.get('limit'), 20
      assert.deepEqual criteria.get('offset'), 20
      
    test 'page', ->
      criteria.page(20)
      
      assert.deepEqual criteria.conditions(), {}
      assert.deepEqual criteria.get('offset'), 380
      
  describe 'integrated queries', ->
    test 'query, sort, and pagination', ->
      criteria.where id: $in: [1, 2, 3]
      criteria.where id: $in: [4, 5, 6]
      criteria.where name: "!~": /[a-z]/
      criteria.where name: "=~": /[0-9]/
      criteria.order "name", "asc"
      criteria.paginate perPage: 20, page: 2
      
      # this doesn't work in node 0.4 b/c regular expressions aren't "equal" so to speak
      # assert.deepEqual criteria.conditions(), { id: { '$in': [1, 2, 3, 4, 5, 6] }, name: { '!~': /[a-z]/, '=~': /[0-9]/ } }
      conditions = criteria.conditions()
      assert.deepEqual conditions.id, { '$in': [1, 2, 3, 4, 5, 6] }
      assert.deepEqual conditions.name['!~'].toString(), /[a-z]/.toString()
      assert.deepEqual conditions.name['=~'].toString(), /[0-9]/.toString()
      
      assert.deepEqual criteria.get('limit'), 20
      assert.deepEqual criteria.get('offset'), 20
      assert.deepEqual criteria.get('order'), [["name", "asc"]]
      
  test '#clone', ->
    assert.ok criteria.clone()
    
  test '#allIn', ->
    