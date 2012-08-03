param = null

describe 'Tower.NetParam', ->
  describe 'String', ->
    beforeEach ->
      param = Tower.NetParam.create("title", type: "String")
    
    test 'match string', ->
      cursor  = param.toCursor("Hello+World")
      assert.deepEqual cursor.conditions(), { "title": "$match": ["Hello", "World"] }
    
    test 'NOT match string', ->
      cursor  = param.toCursor("-Hello+-World")
      assert.deepEqual cursor.conditions(), { "title": "$notMatch": ["Hello", "World"] }
    
    test 'NOT match and match string', ->
      cursor  = param.toCursor("-Hello+World")
      assert.deepEqual cursor.conditions(), { "title": "$notMatch": ["Hello"], "$match": ["World"] }
    
    #test 'regexp', ->
    #  cursor  = param.toCursor("/Hello World/i")
    #  assert.deepEqual cursor.conditions(), { "title": "$match": /Hello World/i }
  
  describe 'Array', ->
    beforeEach ->
      param = Tower.NetParam.create("tags", type: "Array")
    
    test '$allIn', ->
      cursor  = param.toCursor("[ruby,javascript]")
      assert.deepEqual cursor.conditions(), { "tags": "$allIn": ["ruby", "javascript"] }
    
    #test 'multiple $all ($or)', ->
    #  cursor  = param.toCursor("[ruby,rails],[node,javascript]")
    #  assert.deepEqual cursor.conditions(), { "$or": [{"tags": "$all": ["ruby", "rails"]}, {"tags": "$all": ["node", "javascript"]}] }
    
    test '$anyIn', ->
      cursor  = param.toCursor("ruby,javascript")
      assert.deepEqual cursor.conditions(), { "tags": "$anyIn": ["ruby", "javascript"] }
    
    test '$notInAny with one value', ->
      cursor  = param.toCursor("-java")
      assert.deepEqual cursor.conditions(), { "tags": "$notInAny": ["java"] }
    
    test '$notInAny with multiple values', ->
      cursor  = param.toCursor("-java,-asp")
      assert.deepEqual cursor.conditions(), { "tags": "$notInAny": ["java", "asp"] }
    
    test '$notInAny and $anyIn together', ->
      cursor  = param.toCursor("-java,javascript")
      assert.deepEqual cursor.conditions(), { "tags": "$notInAny": ["java"], "$anyIn": ["javascript"] }
      
    test '$notInAll', ->
      cursor  = param.toCursor("-[java,.net]")
      assert.deepEqual cursor.conditions(), { "tags": "$notInAll": ["java", '.net'] }
  
  describe 'Date', ->
    param = null
    beforeEach ->
      param = Tower.NetParam.create("createdAt", type: "Date")

    test 'exact date', ->
      cursor  = param.toCursor("12-25-2012")
      assert.deepEqual cursor.conditions(), { "createdAt": _.toDate("12-25-2012") }
    
    test 'date range with start and end', ->
      cursor  = param.toCursor("12-25-2012..12-31-2012")
      assert.deepEqual cursor.conditions(), { "createdAt": "$gte": _.toDate("12-25-2012"), "$lte": _.toDate("12-31-2012") }

    test 'date range with start and NO end', ->
      cursor  = param.toCursor("12-25-2012..t")
      assert.deepEqual cursor.conditions(), { "createdAt": "$gte": _.toDate("12-25-2012") }
  
    test 'date range with NO start but WITH an end', ->
      cursor  = param.toCursor("t..12-31-2012")
      assert.deepEqual cursor.conditions(), { "createdAt": "$lte": _.toDate("12-31-2012") }

    #test 'multiple dates', ->

    #test 'exact time', ->

    test 'exact datetime', ->
      datetime  = "01-12-2012@3:25:50"
      cursor  = param.toCursor(datetime)
      assert.deepEqual cursor.conditions(), { "createdAt": _.toDate(datetime) }
  
  describe 'Number', ->
    param = null

    beforeEach ->
      param = Tower.NetParam.create("likeCount", type: "Number")

    test 'exact number `12`', ->
      cursor  = param.toCursor("12")
      assert.deepEqual cursor.conditions(), { "likeCount": 12.0 }
  
    test 'number range with start and end `12..80`', ->
      cursor  = param.toCursor("12..80")
      assert.deepEqual cursor.conditions(), { "likeCount": "$gte": 12, "$lte": 80 }

    test 'number range with start and NO end `12..n`', ->
      cursor  = param.toCursor("12..n")
      assert.deepEqual cursor.conditions(), { "likeCount": "$gte": 12 }
  
    test 'number range with NO start but WITH an end `n..80`', ->
      cursor  = param.toCursor("n..80")
      assert.deepEqual cursor.conditions(), { "likeCount": "$lte": 80 }

    #test 'multiple numbers, no ranges `10,100,1000`', ->
    #  cursor  = param.toCursor("10,100,1000")
    #  assert.deepEqual cursor.conditions(), { "likeCount": "$in": [10, 100, 1000] }
    #  
    #test 'multiple numbers with ranges `10,100,1000..1050`', ->
    #  cursor  = param.toCursor("10,100,1000..1050")
    #  assert.deepEqual cursor.conditions(), { "$or": [{"likeCount": {"$in": [10, 100]}}, {"likeCount": {"$gte": 1000, "$lte": 1050}}] }
    #  
    #test 'negative number `-10`', ->
    #  cursor  = param.toCursor("-10")
    #  assert.deepEqual cursor.conditions(), { "likeCount": -10 }
    #
    #test 'NOT number `^10`', ->
    #  cursor  = param.toCursor("^10")
    #  assert.deepEqual cursor.conditions(), { "likeCount": "$neq": 10 }
    #  
    #test 'NOT multiple numbers `^10,^12`', ->
    #  cursor  = param.toCursor("^10,^12")
    #  assert.deepEqual cursor.conditions(), { "likeCount": "$nin": [10, 12] }
    #
    #test 'NOT range `^10..100`', ->
    #  cursor  = param.toCursor("^10..100")
    #  assert.deepEqual cursor.conditions(), { "$nor": [{"likeCount": {"$gte": 10}}, {"likeCount": {"$lte": 100}}] }
    #
    #test 'NIN range with IN range `1..100,^10..50` (is this even possible in mongodb?)', ->
    #  cursor  = param.toCursor("1..100,^10..50")
    #  assert.deepEqual cursor.conditions(), { "$or": [{"likeCount": {"$gte": 1}}, {"likeCount": {"$lte": 100}}], "$nor": [{"likeCount": {"$gte": 10}}, {"likeCount": {"$lte": 50}}] }

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

  describe 'Order', ->
    param = null

    beforeEach ->
      param = Tower.NetParam.create("sort", type: "Order")

    test 'ascending (default)', ->
      values = param.parse('createdAt')
      assert.deepEqual ['createdAt', 'ASC'], values
      #cursor  = param.toCursor("createdAt")
      #assert.deepEqual cursor.conditions(), { "sort": ["createdAt", "ASC"] }

    test 'ascending (+)', ->
      values = param.parse('createdAt+')
      assert.deepEqual ['createdAt', 'ASC'], values

    test 'ascending (-)', ->
      values = param.parse('createdAt-')
      assert.deepEqual ['createdAt', 'DESC'], values

    test 'ascending/descending (default/-)', ->
      values = param.parse('createdAt,likeCount-')
      assert.deepEqual ['createdAt', 'ASC', 'likeCount', 'DESC'], values

    test 'ascending/descending (+/-)', ->
      values = param.parse('createdAt+,likeCount-')
      assert.deepEqual ['createdAt', 'ASC', 'likeCount', 'DESC'], values

    test 'descending/descending (-/-)', ->
      values = param.parse('createdAt-,likeCount-')
      assert.deepEqual ['createdAt', 'DESC', 'likeCount', 'DESC'], values
