describe '<%= model.classNamePlural %>Controller', ->
  controller = undefined
  <%= model.name %> = undefined
  url = undefined
  
  beforeEach (done) ->
    controller = <%= app.namespace %>.<%= model.classNamePlural %>Controller.create()
    agent.controller = controller
    Tower.start(done)
    
  afterEach ->
    Tower.stop()
    delete agent.controller
    
  describe 'routes', ->
    test 'index', ->
      assert.equal urlFor(<%= app.namespace %>.<%= model.className %>), "/<%= model.namePlural %>"
        
    test 'new', ->
      <%= model.name %> = new <%= app.namespace %>.<%= model.className %>
      assert.equal urlFor(<%= model.name %>, action: 'new'), "/<%= model.namePlural %>/new"

    test 'show', ->
      <%= model.name %> = new <%= app.namespace %>.<%= model.className %>(id: 1)
      assert.equal urlFor(<%= model.name %>), "/<%= model.namePlural %>/#{<%= model.name %>.get('id')}"

    test 'edit', ->
      <%= model.name %> = new <%= app.namespace %>.<%= model.className %>(id: 1)
      assert.equal urlFor(<%= model.name %>, action: 'edit'), "/<%= model.namePlural %>/#{<%= model.name %>.get('id')}/edit"
  
  describe '#index', ->  
    beforeEach (done) ->
      factory '<%= model.name %>', (error, record) =>
        <%= model.name %> = record
        done()
    
    test 'render json', (done) ->
      get urlFor(<%= app.namespace %>.<%= model.className %>), format: "json", (request) ->
        assert.equal @headers["Content-Type"], 'application/json'
        
        done()
  
  describe '#new', ->
  
  describe '#create', ->
    beforeEach ->
      url = urlFor(<%= app.namespace %>.<%= model.className %>)

    test 'params', (done) ->
      params = {}
      
      post url, format: "json", params: params, (response) ->
        <%= app.namespace %>.<%= model.className %>.count (error, count) =>
          assert.equal count, 1
          done()
  
  describe "#show", ->
  
  describe "#edit", ->
  
  describe "#update", ->
  
  describe "#destroy", ->
