require '../config'

describe "Tower.Application", ->
  beforeEach ->
    @application = Tower.Application.instance().initialize()
    
  it "should load routes", ->
    expect(Tower.Route.all().length).toEqual 1
    
  it "should load models", ->
    expect(App.Post).toBeTruthy()
  
  it "should load controllers", ->
    expect(App.ApplicationController).toBeTruthy()
    expect(App.PostsController).toBeTruthy()
    
  it "should respond to requests", ->
    #console.log @application.app
    #expect(request(app)).toRespond(
    #  { url: '/login' },
    #  { body: 'blog', status: 200 }
    #)
