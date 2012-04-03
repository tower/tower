require '../../config'

describeWith = (store) ->
  post = null
  
  describe "Tower.Model.Relation.HasMany (Tower.Store.#{store.name})", ->
    beforeEach (done) ->
      App.Post.store(store)
      App.Comment.store(store)
      App.Post.destroy =>
        App.Comment.destroy =>
          App.Post.create rating: 5, id: 10, title: "A Post", (error, record) =>
            post = record
            done()
    
    unless store == Tower.Store.Memory
      describe 'embedded', ->
        describe '.create', ->
          test 'existingPost.embeddedComments().create()', (done) ->
            post.embeddedComments().create (error, comment) =>
              assert.equal post.embeddedComments().records.length, 1
              assert.equal post.embeddedComments().records[0], comment
              assert.equal comment.constructor.name, "Comment"
              
              # test embedded document is actually stored in the post document
              App.Post.store().findOne {id: 10}, {raw: true}, (error, doc) =>
                assert.equal doc.embeddedComments.length, 1

                # since it's embedded, there's shouldn't be any in its own store
                App.Comment.count (error, count) =>
                  assert.equal count, 0

                  done()
        
          # sequential
          test 'existingPost.embeddedComments().create(body: "Comment 1"); ...create(body: "Comment 2")', (done) ->
            post.embeddedComments().create body: "Comment 1", (error, comment1) =>
              assert.equal post.embeddedComments().records.length, 1
              assert.equal post.embeddedComments().records[0], comment1
            
              post.embeddedComments().create body: "Comment 2", (error, comment2) =>
                assert.equal post.embeddedComments().records.length, 2
                assert.equal post.embeddedComments().records[0], comment1
                assert.equal post.embeddedComments().records[1], comment2

                # test embedded document is actually stored in the post document
                App.Post.store().findOne {id: 10}, {raw: true}, (error, doc) =>
                  assert.equal doc.embeddedComments.length, 2
                
                  # since it's embedded, there's shouldn't be any in its own store
                  App.Comment.count (error, count) =>
                    assert.equal count, 0

                    done()
        
          # array, parallel
          test 'existingPost.embeddedComments().create([{body: "Comment 1"}, {body: "Comment 2"}])', (done) ->
            post.embeddedComments().create [{body: "Comment 1"}, {body: "Comment 2"}], (error, comments) =>
              assert.equal post.embeddedComments().records.length, 2
            
              # test embedded document is actually stored in the post document
              App.Post.store().findOne {id: 10}, {raw: true}, (error, doc) =>
                assert.equal doc.embeddedComments.length, 2

                # since it's embedded, there's shouldn't be any in its own store
                App.Comment.count (error, count) =>
                  assert.equal count, 0

                  done()
        
          # scoped
          test 'existingPost.embeddedComments().where(body: "A Comment").create()', (done) ->
            post.embeddedComments().where(body: "A Comment").create (error, comment) =>
              assert.equal post.embeddedComments().records.length, 1
              assert.equal comment.get("body"), "A Comment"

              # since it's embedded, there's shouldn't be any in its own store
              App.Comment.count (error, count) =>
                assert.equal count, 0

                done()
        
        ###
        describe '.update', ->
          beforeEach (done) ->
            post.embeddedComments().create [{body: "Comment 1"}, {body: "Comment 2"}], done

          test 'existingPost.embeddedComments().update(body: "Changed Comment!")', (done) ->
            post.embeddedComments().update body: "Changed Comment!", (error, comments) =>
              assert.equal comments.length, 2
              assert.equal post.embeddedComments().records.length, 2

              for comment in comments
                assert.equal comment.get("body"), "Changed Comment!"

              App.Comment.count (error, count) =>
                assert.equal count, 0

                done()

          test 'existingPost.embeddedComments().where(body: /1/).update(body: "Changed Comment!")', (done) ->
            post.embeddedComments().where(body: /1/).update body: "Changed Comment!", (error, comments) =>
              assert.equal comments.length, 1
              assert.equal post.embeddedComments().records.length, 2

              assert.equal post.embeddedComments().records[0].get("body"), "Changed Comment!"
              assert.equal post.embeddedComments().records[1].get("body"), "Comment 2"

              App.Comment.count (error, count) =>
                assert.equal count, 0

                done()

        describe '.destroy', ->
          beforeEach (done) ->
            post.embeddedComments().create [{body: "Comment 1"}, {body: "Comment 2"}], done

          test 'existingPost.embeddedComments().destroy()', (done) ->
            post.embeddedComments().destroy (error, comments) =>
              done()

          test 'existingPost.embeddedComments().where(body: "Comment 1").destroy()', (done) ->
            post.embeddedComments().destroy (error, comments) =>
              done()
      ###
    describe 'referenced', ->
      describe '.create', ->
        test 'existingPost.referencedComments().create()', (done) ->
          post.referencedComments().create (error, comment) =>
            assert.equal post.referencedComments().records.length, 1
            assert.equal post.referencedComments().records[0], comment
            assert.equal comment.constructor.name, "Comment"
            
            comment.embeddingPost().first (error, embeddingPost) =>
              assert.deepEqual embeddingPost.get("id"), post.get("id")
              
              App.Comment.count (error, count) =>
                assert.equal count, 1

                done()
        
        # sequential
        test 'existingPost.referencedComments().create(body: "Comment 1"); ...create(body: "Comment 2")', (done) ->
          post.referencedComments().create body: "Comment 1", (error, comment1) =>
            assert.equal post.referencedComments().records.length, 1
            assert.equal post.referencedComments().records[0], comment1

            post.referencedComments().create body: "Comment 2", (error, comment2) =>
              assert.equal post.referencedComments().records.length, 2
              assert.equal post.referencedComments().records[0], comment1
              assert.equal post.referencedComments().records[1], comment2

              App.Comment.count (error, count) =>
                assert.equal count, 2

                done()

        # array, parallel
        test 'existingPost.referencedComments().create([{body: "Comment 1"}, {body: "Comment 2"}])', (done) ->
          post.referencedComments().create [{body: "Comment 1"}, {body: "Comment 2"}], (error, comments) =>
            assert.equal post.referencedComments().records.length, 2

            App.Comment.count (error, count) =>
              assert.equal count, 2

              done()

        # scoped
        test 'existingPost.referencedComments().where(body: "A Comment").create()', (done) ->
          post.referencedComments().where(body: "A Comment").create (error, comment) =>
            assert.equal post.referencedComments().records.length, 1
            assert.equal comment.get("body"), "A Comment"
            
            # since it's embedded, there's shouldn't be any in its own store
            App.Comment.count (error, count) =>
              assert.equal count, 1

              done()
  ###
      describe '.update', ->
        beforeEach (done) ->
          post.referencedComments().create [{body: "Comment 1"}, {body: "Comment 2"}], done

        test 'existingPost.referencedComments().update(body: "Changed Comment!")', (done) ->
          post.referencedComments().update body: "Changed Comment!", (error, comments) =>
            assert.equal comments.length, 2
            assert.equal post.referencedComments().records.length, 2

            for comment in comments
              assert.equal comment.get("body"), "Changed Comment!"

            App.Comment.count (error, count) =>
              assert.equal count, 0

              done()

        test 'existingPost.referencedComments().where(body: /1/).update(body: "Changed Comment!")', (done) ->
          post.referencedComments().where(body: /1/).update body: "Changed Comment!", (error, comments) =>
            assert.equal comments.length, 1
            assert.equal post.referencedComments().records.length, 2

            assert.equal post.referencedComments().records[0].get("body"), "Changed Comment!"
            assert.equal post.referencedComments().records[1].get("body"), "Comment 2"

            App.Comment.count (error, count) =>
              assert.equal count, 0

              done()

      describe '.destroy', ->
        beforeEach (done) ->
          post.referencedComments().create [{body: "Comment 1"}, {body: "Comment 2"}], done

        test 'existingPost.referencedComments().destroy()', (done) ->
          post.referencedComments().destroy (error, comments) =>
            done()

        test 'existingPost.referencedComments().where(body: "Comment 1").destroy()', (done) ->
          post.referencedComments().destroy (error, comments) =>
            done()
  ###  
#describeWith(Tower.Store.Memory)
#describeWith(Tower.Store.MongoDB)