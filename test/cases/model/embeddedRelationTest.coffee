require '../../config'

describeWith = (store) ->
  describe 'Tower.Model.Relation', ->
    beforeEach (done) ->
      async.parallel [
        (callback) => App.Child.destroy(callback)
        (callback) => App.Parent.destroy(callback)
      ], done
    
    describe 'inverseOf', ->
      test 'noInverse_noInverse', ->
        assert.notEqual "noInverse_noInverse", App.Parent.relation("noInverse_noInverse").inverse().name
        
      test 'parent: noInverse_withInverse, child: withInverse_noInverse', ->
        assert.equal "withInverse_noInverse", App.Parent.relation("noInverse_withInverse").inverse().name
        
      test 'withInverse_withInverse', ->
        assert.equal "withInverse_withInverse", App.Parent.relation("withInverse_withInverse").inverse().name
        
      test 'parent: withInverse_noInverse, child: noInverse_withInverse', ->
        assert.equal "noInverse_withInverse", App.Parent.relation("withInverse_noInverse").inverse().name
    
    describe 'embed: true', ->
      test 'embed', (done) ->
        App.Parent.create id: 1, (error, parent) =>
          parent.embeddedChildren().create firstName: "A Child!", (error, child) =>
            App.Parent.store().findOne {id: 1}, {raw: true}, (error, parent) =>
              console.log parent
              done()
    
describeWith(Tower.Store.MongoDB)