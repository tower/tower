require './helper'

describe "application", ->
  beforeEach ->
    @application = Coach.Application.instance().initialize()
    
  it "should load routes", ->
    expect(Coach.Route.all().length).toEqual 1
    
  it "should load models", ->
    expect(CoachSpecApp.Post).toBeTruthy()
  
  it "should load controllers", ->
    expect(CoachSpecApp.ApplicationController).toBeTruthy()
    expect(CoachSpecApp.PostsController).toBeTruthy()
    
  it "should respond to requests", ->
    #console.log @application.app
    #expect(request(app)).toRespond(
    #  { url: '/login' },
    #  { body: 'blog', status: 200 }
    #)
