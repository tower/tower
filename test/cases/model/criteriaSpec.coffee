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
      
      expect(criteria.query).toEqual id: { '$in': [1, 2, 3] }
      expect(criteria.options).toEqual {}
      
    it '2 parts: `$in: [1, 2, 3], $in: [4, 5, 6]`', ->
      criteria.where id: $in: [1, 2, 3]
      criteria.where id: $in: [4, 5, 6]
      
      expect(criteria.query).toEqual id: { '$in': [1, 2, 3, 4, 5, 6] }
      expect(criteria.options).toEqual {}
      
    it '2 different keys: `$in: [1, 2, 3], $nin: [4, 5, 6]`', ->
      criteria.where id: $in: [1, 2, 3]
      criteria.where id: $nin: [4, 5, 6]
      
      expect(criteria.query).toEqual id: { '$in': [1, 2, 3], '$nin': [4, 5, 6] }
      expect(criteria.options).toEqual {}
      
    test 'before: `id: $in: [1, 2, 3]`, after: `id: 10`', ->
      criteria.where id: $in: [1, 2, 3]
      criteria.where id: 10
      
      expect(criteria.query).toEqual id: 10
      expect(criteria.options).toEqual {}
      
    test 'before: `id: 10`, after: `id: $in: [1, 2, 3]`, ', ->  
      criteria.where id: 10
      criteria.where id: $in: [1, 2, 3]
      
      expect(criteria.query).toEqual id: { '$in': [1, 2, 3] }
      expect(criteria.options).toEqual {}
      
  describe '#order', ->
    test 'sort by one property', ->
      criteria.order "firstName", "asc"
      
      expect(criteria.query).toEqual {}
      expect(criteria.options).toEqual { sort : [[ 'firstName', 'asc' ]] }
  
    test 'sort by two properties', ->
      criteria.order "firstName", "asc"
      criteria.order "lastName", "desc"
      
      expect(criteria.query).toEqual {}
      expect(criteria.options).toEqual { sort : [[ 'firstName', 'asc' ], [ 'lastName', 'desc' ]] }

    test 'sort default equals `asc`', ->
      criteria.order "firstName"

      expect(criteria.query).toEqual {}
      expect(criteria.options).toEqual { sort : [[ 'firstName', 'asc' ]] }
      
  describe '#limit', ->
    it 'should limit', ->
      criteria.limit 20
      
      expect(criteria.query).toEqual {}
      expect(criteria.options).toEqual { limit : 20 }
      
    it 'should override limit', ->
      criteria.limit 20
      criteria.limit 100

      expect(criteria.query).toEqual {}
      expect(criteria.options).toEqual { limit : 100 }
      
  describe '#offset', ->
    it 'should offset', ->
      criteria.offset 20
      
      expect(criteria.query).toEqual {}
      expect(criteria.options).toEqual { offset : 20 }
      
    it 'should override offset', ->
      criteria.offset 20
      criteria.offset 100

      expect(criteria.query).toEqual {}
      expect(criteria.options).toEqual { offset : 100 }
      
  describe '#paginate', ->
    test 'pagination', ->
      criteria.paginate perPage: 20, page: 20
      
      expect(criteria.query).toEqual {}
      expect(criteria.options).toEqual { limit : 20, offset : 380 }
      
    test 'override pagination', ->
      criteria.paginate perPage: 20, page: 20
      criteria.paginate perPage: 20, page: 2

      expect(criteria.query).toEqual {}
      expect(criteria.options).toEqual { limit : 20, offset : 20 }
      
  describe 'integrated queries', ->
    test 'query, sort, and pagination', ->
      criteria.where id: $in: [1, 2, 3]
      criteria.where id: $in: [4, 5, 6]
      criteria.where name: "!~": /[a-z]/
      criteria.where name: "=~": /[0-9]/
      criteria.order "name", "asc"
      criteria.paginate perPage: 20, page: 2
      
      expect(criteria.query).toEqual { id: { '$in': [1, 2, 3, 4, 5, 6] }, name: { '!~': /[a-z]/, '=~': /[0-9]/ } }
      expect(criteria.options).toEqual { limit : 20, offset : 20, sort: [["name", "asc"]] }
      
  test '#clone', ->
    expect(criteria.clone()).toBeTruthy()
    
  test '#allIn', ->
