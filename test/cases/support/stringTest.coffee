describe 'Tower.SupportString', ->
  describe '#paramterize', ->
    parameterize = Tower.SupportString.parameterize
    
    test 'should replace special characters with dashes', ->
      assert.equal "tower-s-great", parameterize("Tower's great")
      assert.equal "holy", parameterize('Holy $#!@')
    
    test 'should not leave leading dashes', ->
      assert.equal "tower", parameterize("@tower")
      assert.equal "tower", parameterize("-tower")
      assert.equal "tower", parameterize("--tower")
    
    test 'should not leave trailing dashes', ->
      assert.equal "tower", parameterize("Tower!!!")
      assert.equal "tower", parameterize("tower-")
      assert.equal "tower", parameterize("tower--")
      
    test 'should reduce multiple dashes to one', ->
      assert.equal "testing-dashes", parameterize("testing-------dashes")
    
    test 'should underscore then dasherize camel-cased words', ->
      assert.equal "my-thing", parameterize("MyThing")
      assert.equal "my-thing", parameterize("myThing")
      assert.equal "my-thing1", parameterize("myThing1")
      
  describe 'inflection', ->
    support = Tower.SupportString
    
    test 'pluralize', ->
      assert.equal support.pluralize("entry"), "entries"
      assert.equal support.pluralize("business"), "businesses"
      assert.equal support.pluralize("people"), "people"
      assert.equal support.pluralize("person"), "people"
      assert.equal support.pluralize(2, "thing"), "things"
      assert.equal support.pluralize(1, "thing"), "thing"
      assert.equal support.pluralize(0, "thing"), "things"
      
    test 'singularize', ->
      assert.equal support.singularize("businesses"), "business"
      assert.equal support.singularize("people"), "person"
      assert.equal support.singularize("person"), "person"
  