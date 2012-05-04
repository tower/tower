describe 'Tower.Support.String', ->
  describe '#paramterize', ->
    parameterize = Tower.Support.String.parameterize
    
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