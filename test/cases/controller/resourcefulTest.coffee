require '../../config'

controller  = null
user        = null
router      = null

describe 'Tower.Controller.Resourceful', ->
  test '#index', ->
    Tower.get 'index', ->
      assert.equal @body, '<h1>Hello World</h1>\n'
      assert.equal @headers["Content-Type"], "text/html"
      
  #test '#new', ->
  #  Tower.get 'new', ->
  #    assert.equal @body, '<h1>New User</h1>\n'
  #    assert.equal @contentType, "text/html"
  #
  #test '#create', ->
  #  Tower.post 'create', format: "json", user: firstName: "Lance", ->
  #    assert.equal @body, 'success'
  #    assert.equal @resource, true
  #
  #test '#show', ->
  #  User.create(id: 1, firstname: "Lance")
  #
  #  Tower.get 'show', id: 1, format: "json", ->
  #    assert.equal @body, '{"id":1,"firstname":"Lance","likes":0,"tags":[],"postIds":[]}'
  #    assert.equal @contentType, "application/json"
  #
  #test '#edit', ->
  #  Tower.get 'edit', ->
  #    assert.equal @body, '<h1>Editing User</h1>\n'
  #    assert.equal @contentType, "text/html"
  #    
  #test '#update', ->
  #  Tower.put 'update', ->
  #    assert.equal @body, '<h1>Show User</h1>\n'
  #    assert.equal @contentType, "text/html"      
  #
  #test '#destroy', ->
  #  Tower.destroy 'destroy', ->
  #    assert.equal @body, '<h1>New User</h1>\n'
  #    assert.equal @contentType, "text/html"
