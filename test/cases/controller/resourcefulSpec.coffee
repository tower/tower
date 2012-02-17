require '../../config'

controller  = null
user        = null
router      = null

describe 'Tower.Controller.Resourceful', ->
  test '#index', ->
    Tower.get 'index', ->
      expect(@body).toEqual '<h1>Hello World</h1>\n'
      expect(@headers["Content-Type"]).toEqual "text/html"
      
  #test '#new', ->
  #  Tower.get 'new', ->
  #    expect(@body).toEqual '<h1>New User</h1>\n'
  #    expect(@contentType).toEqual "text/html"
  #
  #test '#create', ->
  #  Tower.post 'create', format: "json", user: firstName: "Lance", ->
  #    expect(@body).toEqual 'success'
  #    expect(@resource).toEqual true
  #
  #test '#show', ->
  #  User.create(id: 1, firstname: "Lance")
  #
  #  Tower.get 'show', id: 1, format: "json", ->
  #    expect(@body).toEqual '{"id":1,"firstname":"Lance","likes":0,"tags":[],"postIds":[]}'
  #    expect(@contentType).toEqual "application/json"
  #
  #test '#edit', ->
  #  Tower.get 'edit', ->
  #    expect(@body).toEqual '<h1>Editing User</h1>\n'
  #    expect(@contentType).toEqual "text/html"
  #    
  #test '#update', ->
  #  Tower.put 'update', ->
  #    expect(@body).toEqual '<h1>Show User</h1>\n'
  #    expect(@contentType).toEqual "text/html"      
  #
  #test '#destroy', ->
  #  Tower.destroy 'destroy', ->
  #    expect(@body).toEqual '<h1>New User</h1>\n'
  #    expect(@contentType).toEqual "text/html"
