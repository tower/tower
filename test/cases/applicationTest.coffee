describe "Tower.Application", ->
  app = null
  
  beforeEach ->
    app = Tower.Application.instance().initialize()

  test "load models", ->
    assert.isPresent !!App.Post
  
  test "load controllers", ->
    assert.isPresent App.ApplicationController
    assert.isPresent App.PostsController
