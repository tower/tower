describeWith = (store) ->
  describe 'Tower.HTTP.Param', ->
    #describe 'String', ->
    #  param = null
    #  beforeEach ->
    #    param = Tower.HTTP.Param.create("title", type: "String")
    #
    #  test 'match string', ->
    #    criteria  = param.toCriteria("Hello+World")
    #    assert.deepEqual criteria.conditions(), { "title": "$match": ["Hello", "World"] }
    #  
    #  test 'NOT match string', ->
    #    criteria  = param.toCriteria("-Hello+-World")
    #    assert.deepEqual criteria.conditions(), { "title": "$notMatch": ["Hello", "World"] }
    #  
    #  test 'NOT match and match string', ->
    #    criteria  = param.toCriteria("-Hello+World")
    #    assert.deepEqual criteria.conditions(), { "title": "$notMatch": ["Hello"], "$match": ["World"] }
    #  
    #  test 'regexp', ->
    #    criteria  = param.toCriteria("/Hello World/i")
    #    assert.deepEqual criteria.conditions(), { "title": "$regex": /Hello World/i }
    
    #describe 'Array', ->
    #  param = null
    #  beforeEach ->
    #    param = Tower.HTTP.Param.create("tags", type: "Array")
    #  
    #  test '$all', ->
    #    criteria  = param.toCriteria("[ruby,javascript]")
    #    assert.deepEqual criteria.conditions(), { "tags": "$all": ["ruby", "javascript"] }
    #  
    #  test 'multiple $all ($or)', ->
    #    criteria  = param.toCriteria("[ruby,rails],[node,javascript]")
    #    assert.deepEqual criteria.conditions(), { "$or": [{"tags": "$all": ["ruby", "rails"]}, {"tags": "$all": ["node", "javascript"]}] }
    #  
    #  test '$in', ->
    #    criteria  = param.toCriteria("ruby,javascript")
    #    assert.deepEqual criteria.conditions(), { "tags": "$in": ["ruby", "javascript"] }
    #  
    #  test '$nin with one value', ->
    #    criteria  = param.toCriteria("^java")
    #    assert.deepEqual criteria.conditions(), { "tags": "$nin": ["java"] }
    #  
    #  test '$nin with multiple values', ->
    #    criteria  = param.toCriteria("^java,^asp")
    #    assert.deepEqual criteria.conditions(), { "tags": "$nin": ["java", "asp"] }
    #  
    #  test '$nin and $in together', ->
    #    criteria  = param.toCriteria("^java,javascript")
    #    assert.deepEqual criteria.conditions(), { "tags": "$nin": ["java"], "$in": ["javascript"] }
    
    describe 'Date', ->
      param = null
      beforeEach ->
        param = Tower.HTTP.Param.create("createdAt", type: "Date")
  
      test 'exact date', ->
        criteria  = param.toCriteria("12-25-2012")
        assert.deepEqual criteria.conditions(), { "createdAt": _.toDate("12-25-2012") }
      
      test 'date range with start and end', ->
        criteria  = param.toCriteria("12-25-2012..12-31-2012")
        assert.deepEqual criteria.conditions(), { "createdAt": "$gte": _.toDate("12-25-2012"), "$lte": _.toDate("12-31-2012") }
  
      test 'date range with start and NO end', ->
        criteria  = param.toCriteria("12-25-2012..t")
        assert.deepEqual criteria.conditions(), { "createdAt": "$gte": _.toDate("12-25-2012") }
    
      test 'date range with NO start but WITH an end', ->
        criteria  = param.toCriteria("t..12-31-2012")
        assert.deepEqual criteria.conditions(), { "createdAt": "$lte": _.toDate("12-31-2012") }
  
      #test 'multiple dates', ->
  
      #test 'exact time', ->
  
      test 'exact datetime', ->
        datetime  = "01-12-2012@3:25:50"
        criteria  = param.toCriteria(datetime)
        assert.deepEqual criteria.conditions(), { "createdAt": _.toDate(datetime) }
    
    describe 'Number', ->
      param = null
  
      beforeEach ->
        param = Tower.HTTP.Param.create("likeCount", type: "Number")
  
      test 'exact number `12`', ->
        criteria  = param.toCriteria("12")
        assert.deepEqual criteria.conditions(), { "likeCount": 12.0 }
    
      test 'number range with start and end `12..80`', ->
        criteria  = param.toCriteria("12..80")
        assert.deepEqual criteria.conditions(), { "likeCount": "$gte": 12, "$lte": 80 }
  
      test 'number range with start and NO end `12..n`', ->
        criteria  = param.toCriteria("12..n")
        assert.deepEqual criteria.conditions(), { "likeCount": "$gte": 12 }
    
      test 'number range with NO start but WITH an end `n..80`', ->
        criteria  = param.toCriteria("n..80")
        assert.deepEqual criteria.conditions(), { "likeCount": "$lte": 80 }
  
      #test 'multiple numbers, no ranges `10,100,1000`', ->
      #  criteria  = param.toCriteria("10,100,1000")
      #  assert.deepEqual criteria.conditions(), { "likeCount": "$in": [10, 100, 1000] }
      #  
      #test 'multiple numbers with ranges `10,100,1000..1050`', ->
      #  criteria  = param.toCriteria("10,100,1000..1050")
      #  assert.deepEqual criteria.conditions(), { "$or": [{"likeCount": {"$in": [10, 100]}}, {"likeCount": {"$gte": 1000, "$lte": 1050}}] }
      #  
      #test 'negative number `-10`', ->
      #  criteria  = param.toCriteria("-10")
      #  assert.deepEqual criteria.conditions(), { "likeCount": -10 }
      #
      #test 'NOT number `^10`', ->
      #  criteria  = param.toCriteria("^10")
      #  assert.deepEqual criteria.conditions(), { "likeCount": "$neq": 10 }
      #  
      #test 'NOT multiple numbers `^10,^12`', ->
      #  criteria  = param.toCriteria("^10,^12")
      #  assert.deepEqual criteria.conditions(), { "likeCount": "$nin": [10, 12] }
      #
      #test 'NOT range `^10..100`', ->
      #  criteria  = param.toCriteria("^10..100")
      #  assert.deepEqual criteria.conditions(), { "$nor": [{"likeCount": {"$gte": 10}}, {"likeCount": {"$lte": 100}}] }
      #
      #test 'NIN range with IN range `1..100,^10..50` (is this even possible in mongodb?)', ->
      #  criteria  = param.toCriteria("1..100,^10..50")
      #  assert.deepEqual criteria.conditions(), { "$or": [{"likeCount": {"$gte": 1}}, {"likeCount": {"$lte": 100}}], "$nor": [{"likeCount": {"$gte": 10}}, {"likeCount": {"$lte": 50}}] }
  
      #@operators:
      #  gte:            ":value..t"          
      #  gt:             ":value...t"
      #  lte:            "t..:value"
      #  lte:            "t...:value"
      #  rangeInclusive: ":i..:f"             # count=0..4
      #  rangeExclusive: ":i...:f"            # date=2011-08-10...2011-10-03
      #  in:             [",", "+OR+"]        # tags=ruby,javascript and tags=ruby+OR+javascript
      #  nin:            "-"                  # tags=-ruby,-javascript and tags=ruby+OR+javascript
      #  all:            "[:value]"           # tags=[ruby,javascript] and tags=ruby+AND+javascript
      #  nil:            "[-]"                # tags=[-]
      #  notNil:         "[+]"                # tags=ruby,[+]
      #  asc:            ["+", ""]
      #  desc:           "-"
      #  geo:            ":lat,:lng,:radius"   # geo=20,-50,7

describeWith(Tower.Store.Memory)
unless Tower.client
  describeWith(Tower.Store.MongoDB)