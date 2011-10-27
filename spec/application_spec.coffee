require './helper'

describe "application", ->
  beforeEach ->
    @application = Metro.Application.initialize()
    
  it "should load routes", ->
    expect(Metro.Route.all().length).toEqual 1
    
  it "should load models", ->
    expect(Post).toBeTruthy()
  
  it "should load controllers", ->
    expect(ApplicationController).toBeTruthy()
    expect(PostsController).toBeTruthy()
    
  it "should respond to requests", ->
    #console.log @application.app
    #expect(request(app)).toRespond(
    #  { url: '/login' },
    #  { body: 'blog', status: 200 }
    #)