describe "Tower.Application", ->
  app = null
  
  beforeEach ->
    app = Tower.Application.instance().initialize()
  
  test "load models", ->
    assert.ok App.Post
  
  test "load controllers", ->
    assert.ok App.ApplicationController
    assert.ok App.PostsController