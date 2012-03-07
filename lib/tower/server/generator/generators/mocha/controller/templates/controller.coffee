require "../config"

get     = Tower.get
urlFor  = Tower.urlFor

describe "<%= model.className %>", ->
  beforeEach (done) ->
    <%= project.namespace %>.<%= model.className %>.destroy =>
      <%= project.namespace %>.<%= model.className %>.create(id: 1, done)
  
  describe "#index", ->
    test 'url', ->
      assert.equal urlFor(<%= project.namespace %>.<%= model.className %>), "/<%= model.pluralName %>"
      
    test 'render', (done) ->
      get urlFor(<%= project.namespace %>.<%= model.className %>), (error, body) ->
        assert.equal @headers["Content-Type"], "text/html"
        assert.equal @collection.length, 1
        
        <%= project.namespace %>.<%= model.className %>.count (error, count) =>
          assert.equal count, 1
          done()
        
    test 'render json', ->
      get urlFor(<%= project.namespace %>.<%= model.className %>), format: "json", (error, body) ->
        assert.equal @headers["Content-Type"], "application/json"
        
        <%= project.namespace %>.<%= model.className %>.count (error, count) =>
          assert.equal count, 1
          done()
  
  describe "#new", ->
  
  describe "#create", ->
  
  describe "#show", ->
  
  describe "#edit", ->
  
  describe "#update", ->
  
  describe "#destroy", ->
