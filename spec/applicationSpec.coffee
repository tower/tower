require './helper'

describe "application", ->
  beforeEach ->
    @application = Metro.Application.instance().initialize()
    
  it "should load routes", ->
    expect(Metro.Route.all().length).toEqual 1
    
  it "should load models", ->
    expect(MetroSpecApp.Post).toBeTruthy()
  
  it "should load controllers", ->
    expect(MetroSpecApp.ApplicationController).toBeTruthy()
    expect(MetroSpecApp.PostsController).toBeTruthy()
    
  it "should respond to requests", ->
    #console.log @application.app
    #expect(request(app)).toRespond(
    #  { url: '/login' },
    #  { body: 'blog', status: 200 }
    #)
