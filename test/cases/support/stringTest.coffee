describe 'Tower.Support.String', ->
  describe 'inflection', ->
    support = Tower.Support.String
    
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
  