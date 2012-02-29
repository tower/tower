require '../config'

describe "Tower.Application", ->
  beforeEach ->
    @application = Tower.Application.instance().initialize()
    
  #it "should load routes", ->
  #  assert.equal Tower.Route.all().length, 1
    
  it "should load models", ->
    assert.ok App.Post
  
  it "should load controllers", ->
    assert.ok App.ApplicationController
    assert.ok App.PostsController
    
  it "should respond to requests", ->
    #console.log @application.app
    #assert.equal request(app)).toRespond(
    #  { url: '/login' },
    #  { body: 'blog', status: 200 }
    #)
