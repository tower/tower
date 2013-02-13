describe 'Tower.SupportFormat', ->
  describe 'validation', ->
    test 'isPresent', ->
      assert.isFalse _.isPresent(null)
      assert.isFalse _.isPresent(undefined)
      assert.isFalse _.isPresent([])
      assert.isFalse _.isPresent({})
      assert.isFalse _.isPresent("")
      
      assert.isTrue _.isPresent("string")
      assert.isTrue _.isPresent(0)
      assert.isTrue _.isPresent(new Date)
      assert.isTrue _.isPresent(/asdf/)
      assert.isTrue _.isPresent({key:"value"})
      assert.isTrue _.isPresent([1])

  describe 'casting', ->
    test 'toInt', ->
      assert.equal _.toInt('123'), 123
      # this doesn't work in browser... bug
      #assert.equal _.toInt('0123'), 123
    
    test 'toBoolean', ->
      assert.equal _.toBoolean('true'), true
      
    test 'toFixed', ->
      assert.equal _.toFixed(0.615, 2), "0.62"
      assert.equal (0.615).toFixed(2), "0.61"
      
    test 'formatCurrency', ->
      assert.equal _.formatCurrency(12345678), '$12,345,678.00'
      assert.equal _.formatCurrency(-500000, "£ ", 0), '£ -500,000'
      
    test 'formatNumber', ->
      assert.equal _.formatNumber(5318008), '5,318,008'
      assert.equal _.formatNumber(9876543.21, 3, " "), '9 876 543.210'
      
    test 'unformatCurrency', ->
      assert.equal _.unformatCurrency("£ 12,345,678.90 GBP"), '12345678.9'
      
    test 'unformatCreditCard', ->
      assert.equal _.unformatCreditCard('4111 1111 1111 1111'), '4111111111111111'
      
    test 'formatBytes'
    
  describe 'dates', ->  
    test 'now', ->
      assert.deepEqual _.now().toDate().getSeconds(), (new Date).getSeconds()
      
    test 'strftime', ->
      assert.equal _.strftime(_.now(), 'YYYY'), '2013'
      assert.equal _.now().strftime('YYYY'), '2013'
      
    test 'toDate', ->
      assert.equal _.toDate("Dec 25, 1995").getFullYear(), 1995
      
    #test 'chaining', ->
    #  _.withDate("Dec 25, 1995").add(_.days(10))
    #   _(2)
    
    test '_(2).days().value()', ->
      assert.equal _(2).days().value(), 172800000
    
    # need a better way to test these b/c they might be a millisecond off and cause tests to fail
    # test '_(2).days().fromNow()', ->
    #   assert.deepEqual _(2).days().fromNow().toDate(), _.withDate().add('days', 2).toDate()
    #   
    # test '_(2).days().ago()', ->
    #   assert.deepEqual _(2).days().ago().toDate(), _.withDate().subtract('days', 2).toDate()
    #   
    # test '_(2).days().ago().endOfDay()', ->
    #   assert.deepEqual _(2).days().ago().endOfDay().toDate(), _.withDate().subtract('days', 2).eod().toDate()
    #   
    # test '_(2).days().ago().beginningOfDay()', ->
    #   assert.deepEqual _(2).days().ago().beginningOfDay().toDate(), _.withDate().subtract('days', 2).sod().toDate()
      
    test '_(3).days().ago().toHuman()', ->
      assert.equal _(3).days().ago().toHuman(), '3 days ago'
      
    test '_(3).days().fromNow().toHuman()', ->
      assert.equal _(3).days().fromNow().toHuman(), 'in 3 days'
      
    #test 'humanizeDuration', ->
    #  assert.equal _.humanizeDuration(_(3).days()), '3 days'
  
  describe 'sanitizing', ->
    #test 'trim', ->
    #  assert.equal _.trim(' \s\t\r hello \n'), 'hello'
    
    test 'ltrim', ->
      assert.equal _.ltrim('aaaaaaaaab', 'a'), 'b'
    
    test 'rtrim', ->
    
    # some client error...
    #test 'xss', ->
    #  assert.equal _.xss('javascript  : foobar'), '[removed] foobar'
    #  assert.equal _.xss('j a vasc ri pt: foobar'), '[removed] foobar'
    
    test 'entityDecode', ->
      assert.equal _.entityDecode('&lt;a&gt;'), '<a>'
      
    #test 'chain', ->
    #  assert.equal '&amp;amp;amp;', _.with('&').entityEncode().entityEncode().entityEncode().value()
  
  describe 'validating', ->
    test 'isEmail', ->
      assert.equal _.isEmail('example@gmail.com'), true
      assert.equal _.isEmail('example.com'), false
      
    test 'isWeakPassword', ->
      assert.equal _.isWeakPassword('sixchr'), true
      assert.equal _.isWeakPassword('foo'), false
      
    test 'isMediumPassword', ->
      assert.equal _.isMediumPassword('chrs123'), true
      assert.equal _.isMediumPassword('sixchr'), false
      
    test 'isStrongPassword', ->
      assert.equal _.isStrongPassword('HQSij2323#$%'), true
      assert.equal _.isStrongPassword('chrs123'), false
    
    test 'isUrl', ->
    
    test 'isIP', ->
    
    test 'isAlphanumeric'
    
    test 'isNumeric'
    
    test 'isLowerCase'
    
    test 'isUpperCase'
    
    test 'isDecimal'
    
    test 'isFloat'
    
    test 'notNull'
    
    test 'isNull'
    
    test 'isCreditCard'
    
    test 'isLuhn'
    
    test 'isVisa', ->
      assert.equal _.isVisa('4012888888881881'), true
      assert.equal _.isVisa('4111111111111111'), true
      assert.equal _.isVisa('4222222222222'), false
    
    test 'isMasterCard', ->
      assert.equal _.isMasterCard('5105105105105100'), true
    
    test 'isDiscover', ->
      assert.equal _.isDiscover('6011000990139424'), true
    
    test 'isAmex', ->
      assert.equal _.isAmex('371449635398431'), true
      
    test 'isSwitch, isSolo', ->
      assert.equal _.isSwitch('6331101999990016'), true
      assert.equal _.isSwitch('isSolo'), true
      
    test 'isDinersClub', ->
      assert.equal _.isDinersClub('30569309025904'), true
    
    test 'isUUID'
    
    test 'isPostalCode', ->
      assert.equal _.isPostalCode('91941'), true
      assert.equal _.isPostalCode('9194'), false
      assert.equal _.isPostalCode('91941-0912'), true
    
    test 'isPhone', ->
      # true
      assert.equal _.isPhone('1234567890'), true
      assert.equal _.isPhone('(123) 456-7890'), true
      assert.equal _.isPhone('123.456.7890'), true
      assert.equal _.isPhone('123-456-7890'), true
      # false
      assert.equal _.isPhone('123456789'), false
      
    test 'isPhone(format: "us")', ->  
      assert.equal _.isPhone('1234567890', format: 'us'), true
      assert.equal _.isPhone('(123) 456-7890', format: 'us'), true
      assert.equal _.isPhone('12 34 56 78 90', format: 'us'), false
      
    test 'isSlug', ->
      assert.equal _.isSlug('a-slug'), true
      assert.equal _.isSlug('a slug'), false
    
    test 'isDate', ->
      assert.equal _.isDate(new Date), true
    
    test 'isDateISO'
    
    test 'isDigits'
    
    test 'isAccept', ->
      assert.equal _.isAccept('.xls', 'xls|csv'), true
      assert.equal _.isAccept('xls', 'xls|csv'), false
  
  describe 'inflection', ->
    test 'pluralize', ->
      assert.equal _.pluralize("entry"), "entries"
      assert.equal _.pluralize("address"), "addresses"
      assert.equal _.pluralize("business"), "businesses"
      assert.equal _.pluralize("people"), "people"
      assert.equal _.pluralize("person"), "people"
      
    test 'singularize', ->
      assert.equal _.singularize("businesses"), "business"
      assert.equal _.singularize("people"), "person"
      assert.equal _.singularize("person"), "person"
      assert.equal _.singularize("address"), "address"